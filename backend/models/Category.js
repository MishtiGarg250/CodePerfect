import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
});

export default mongoose.model("Category", categorySchema);
