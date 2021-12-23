import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  youth: {
    type: String,
    required: true,
  },
  merchant: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model("orders", OrderSchema);
