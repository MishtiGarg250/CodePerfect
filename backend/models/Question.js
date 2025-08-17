import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: String,
  url: String,        // for yt_link 
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"   // default if missing
  },
  p1_link: String,
  p2_link: String,
  tags: [String]
});
export default mongoose.model("Question", questionSchema);