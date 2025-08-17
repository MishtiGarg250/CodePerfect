
import Category from "../models/Category.js";
import "../models/Question.js";



export const getContent = async (req, res) => {
  try {
    let { search = "", difficulty = "", page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    // Fetch all categories
    const categories = await Category.find()
      .populate({
        path: "questions",
        match: {
          ...(difficulty ? { difficulty } : {}),
          ...(search ? { title: { $regex: search, $options: "i" } } : {}),
        },
        select: "title url difficulty p1_link p2_link tags",
      });

    // Debug log
    console.log('Categories fetched:', categories.length);
    const result = categories.map((cat) => {
      const questionsArr = Array.isArray(cat.questions) ? cat.questions : [];
      if (!Array.isArray(cat.questions)) {
        console.warn('cat.questions is not an array for category:', cat.title, cat.questions);
      }
      const paginatedQuestions = questionsArr.slice((page - 1) * limit, page * limit);
      return {
        _id: cat._id,
        title: cat.title,
        questions: paginatedQuestions,
        totalQuestions: questionsArr.length,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('getContent error:', err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
