const mongoose = require("mongoose");

const WithdrawalSchema = new mongoose.Schema(
    {
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        paymentMethod: { 
            type: String, 
            enum: ["Bank Transfer", "PayPal"], 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["Pending", "Approved", "Rejected"], 
            default: "Pending" 
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", WithdrawalSchema);
