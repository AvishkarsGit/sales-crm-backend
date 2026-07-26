import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Deal title is required"],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, "Deal value is required"],
      min: 0,
    },
    stage: {
      type: String,
      enum: ["Prospect", "Negotiation", "Won", "Lost"],
      default: "Prospect",
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Deal", dealSchema);
