import { Schema, model } from "mongoose";

let collection = "discounts";

const schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  // null = aplica a todos los negocios
  businessId: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    default: null,
    index: true
  },
  minOrder: {
    type: Number,
    default: 0
  },
  // null = ilimitado
  maxUses: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index para búsquedas por código
schema.index({ code: 1 });

let Discount = model(collection, schema);
export default Discount;
