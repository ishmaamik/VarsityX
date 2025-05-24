import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Initiated", "Success", "Failed"], default: "Initiated" },
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
