import mongoose from "mongoose";

const DailyLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, index: true }, 
    stats: {
        solved: { type: Number, default: 0 },
        bookmarked: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        lastVisit: { type: Date }
    },
    summary: { type: Object }, 
}, { timestamps: true });

DailyLogSchema.index({ user: 1, date: -1 }, { unique: true }); 
DailyLogSchema.index({ user: 1 });

export default mongoose.model("DailyLog", DailyLogSchema);

