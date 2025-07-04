import Transaction from '../models/Transaction.js';

// ✅ GET All Transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ ADD a New Transaction
export const addTransaction = async (req, res) => {
  try {
    console.log("Incoming transaction body:", req.body);
    console.log("Authenticated user:", req.user);

    const { type, amount, category, date, description } = req.body;

    const newTransaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      category,
      date,
      description,
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction saved successfully",
      transaction: savedTransaction,
    });
  } catch (err) {
    console.error("Error saving transaction:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ DELETE a Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ UPDATE a Transaction
export const updateTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { type, amount, category, date, description },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
