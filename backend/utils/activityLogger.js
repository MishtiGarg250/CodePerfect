import DailyLog from "../models/DailyLog.js";
import dayjs from "dayjs";

async function recordAction(userId, actionType, meta = {}) {
  const date = dayjs().format('YYYY-MM-DD');
  const update = {
    $set: { [`stats.lastVisit`]: new Date() },
    $inc: { [`stats.${actionType}`]: 1 }
  };
  await DailyLog.findOneAndUpdate(
    { user: userId, date },
    update,
    { upsert: true, new: true }
  );
}

async function getDailyStats(userId, date = null) {
  const d = date || dayjs().format('YYYY-MM-DD');
  const log = await DailyLog.findOne({ user: userId, date: d });
  return log?.stats || { solved: 0, bookmarked: 0, completed: 0, lastVisit: null };
}

async function touchLastVisit(userId) {
  const date = dayjs().format('YYYY-MM-DD');
  await DailyLog.findOneAndUpdate(
    { user: userId, date },
    { $set: { "stats.lastVisit": new Date() } },
    { upsert: true }
  );
}

export { recordAction, getDailyStats, touchLastVisit };