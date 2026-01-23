import { Schema, model } from "mongoose";

let collection = "reviews";

const schema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required: true,
    index: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    default: null
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index compuesto para evitar reviews duplicadas por orden
schema.index({ customerId: 1, orderId: 1 }, { unique: true, sparse: true });

let Review = model(collection, schema);
export default Review;
