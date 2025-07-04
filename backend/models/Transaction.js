import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: "other"
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ""
  }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
