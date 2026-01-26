// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage"
    },
    description: {
      type: String,
      default: ""
    },
    minOrder: {
      type: Number,
      default: 0
    },
    maxUses: {
      type: Number,
      default: null // null = ilimitado
    },
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startsAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: null // null = no expira
    }
  },
  { timestamps: true }
);

// Índice único para code + businessId (mismo código puede existir en diferentes negocios)
couponSchema.index({ code: 1, businessId: 1 }, { unique: true });

// Método para verificar si el cupón es válido
couponSchema.methods.isValid = function () {
  const now = new Date();

  if (!this.isActive) return { valid: false, reason: "Cupón inactivo" };
  if (this.expiresAt && now > this.expiresAt) return { valid: false, reason: "Cupón expirado" };
  if (this.startsAt && now < this.startsAt) return { valid: false, reason: "Cupón aún no disponible" };
  if (this.maxUses && this.usedCount >= this.maxUses) return { valid: false, reason: "Cupón agotado" };

  return { valid: true };
};

export default mongoose.model("Coupon", couponSchema);
