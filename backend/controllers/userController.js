import DailyLog from "../models/DailyLog.js";
import generateDailySummary from "../services/geminiService.js";
import User from "../models/User.js";
import dayjs from "dayjs";
import { recordAction } from "../utils/activityLogger.js";

export const getDailyLogs = async (req, res) => {
  console.log("getDailyLogs")
  try {
    const userId = req.user.id;
    const today = dayjs().format('YYYY-MM-DD');
    let logs = await DailyLog.find({ user: userId })
      .sort({ date: -1 })
      .limit(7)
      .lean();

    // If today's log exists but has no summary, generate it now
    let todayLog = logs.find(l => dayjs(l.date).format('YYYY-MM-DD') === today);
    console.log("todaylog");
    if (todayLog && !todayLog.summary) {
      console.log("i am in this block")
      try {
        // Fetch user and stats
        const user = await User.findById(userId).select('name email bookmarks progress').populate({ path: 'bookmarks', select: 'title difficulty' });
        const stats = todayLog.stats || {};
        const recentBookmarks = (user?.bookmarks || []).slice(0, 3).map(b => `${b.title} (${b.difficulty})`);
        const extra = { recent: recentBookmarks, recommendations: [] };
        const summary = await generateDailySummary(user.name || user.email, stats, extra);
        console.log("AI summary generated:", summary)
        await DailyLog.findOneAndUpdate({ _id: todayLog._id }, { $set: { summary } });
        todayLog.summary = summary;
      } catch (aiErr) {
        console.error("Error generating AI summary:", aiErr);
        todayLog.summary = { raw: "AI summary error: " + (aiErr?.message || aiErr) };
      }
    }
    // Re-fetch logs if we updated today's summary
    if (todayLog && !logs[0].summary) {
      logs = await DailyLog.find({ user: userId })
        .sort({ date: -1 })
        .limit(7)
        .lean();
    }
    const summary = logs[0]?.summary || null;
    console.log("Final summary:", summary);
    res.json({ logs, summary });
  } catch (e) {
    console.error("getDailyLogs error:", e);
    res.status(500).json({ error: "Could not fetch daily logs", details: e?.message || e });
  }
};


export const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ progress: user.progress });
  } catch (e) {
    res.status(500).json({ error: "Could not fetch progress" });
  }
};


export const addOrRemoveBookmark = async (req, res) => {
  try {
    const { questionId, action } = req.body; // action: 'add' | 'remove' | 'toggle'
    if (!questionId) return res.status(400).json({ error: "questionId required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const exists = user.bookmarks.some((id) => String(id) === questionId);
    let changed = false;

    if (action === "add" && !exists) { user.bookmarks.push(questionId); changed = true; }
    else if (action === "remove" && exists) { user.bookmarks = user.bookmarks.filter((id) => String(id) !== questionId); changed = true; }
    else if (action === "toggle") {
      if (exists) user.bookmarks = user.bookmarks.filter((id) => String(id) !== questionId);
      else user.bookmarks.push(questionId);
      changed = true;
    }

    if (changed) {
      await user.save();
      // Log bookmark action in DailyLog
      await recordAction(user._id, 'bookmarked', { questionId });
    }

    const populated = await user.populate({ path: "bookmarks", select: "title url difficulty" });
    res.json({ bookmarks: populated.bookmarks });
  } catch (e) {
    res.status(500).json({ error: "Could not update bookmarks" });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({ path: "bookmarks", select: "title url difficulty" });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ bookmarks: user.bookmarks });
  } catch (e) {
    res.status(500).json({ error: "Could not fetch bookmarks" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { questionId, completed } = req.body; 
    if (!questionId || typeof completed !== "boolean") return res.status(400).json({ error: "questionId and completed required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const has = user.progress.some((id) => String(id) === questionId);
    let logUpdated = false;
    if (completed && !has) {
      user.progress.push(questionId);
      await recordAction(user._id, 'completed', { questionId });
      logUpdated = true;
    }
    if (!completed && has) {
      user.progress = user.progress.filter((id) => String(id) !== questionId);
      logUpdated = true;
    }
    await user.save();

    // Immediately generate/update today's summary if log was updated
    if (logUpdated) {
      const today = dayjs().format('YYYY-MM-DD');
      let todayLog = await DailyLog.findOne({ user: user._id, date: today });
      if (todayLog) {
        // Fetch user and stats
        const freshUser = await User.findById(user._id).select('name email bookmarks progress').populate({ path: 'bookmarks', select: 'title difficulty' });
        const stats = todayLog.stats || {};
        const recentBookmarks = (freshUser?.bookmarks || []).slice(0, 3).map(b => `${b.title} (${b.difficulty})`);
        const extra = { recent: recentBookmarks, recommendations: [] };
        const summary = await generateDailySummary(freshUser.name || freshUser.email, stats, extra);
        await DailyLog.findOneAndUpdate({ _id: todayLog._id }, { $set: { summary } });
      }
    }

    res.json({ progress: user.progress });
  } catch (e) {
    res.status(500).json({ error: "Could not update progress" });
  }
};