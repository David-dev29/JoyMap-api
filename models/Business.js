// models/Business.js
import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    logo: { type: String, default: null },
    banner: { type: String, default: null },

    // Icono del marker (puede venir de categoría o sobrescribirse)
    mapIcon: {
      type: String,
      default: "📍",
      trim: true,
    },

    // Tipo de icono para el menú: 'emoji', 'svg', 'image'
    iconType: {
      type: String,
      enum: ["emoji", "svg", "image"],
      default: "emoji"
    },

    // Código SVG del icono (cuando iconType es 'svg')
    iconSvg: {
      type: String,
      default: null
    },

    // Categoría (referencia real)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryBusiness",
      required: true
    },

    isActive: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: true },

    deliveryTime: {
      min: { type: Number, default: 20 },
      max: { type: Number, default: 40 },
    },

    deliveryCost: { type: Number, default: 0 },
    minOrderAmount: { type: Number, default: 0 },

    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },

    address: { type: String, required: true },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },

    // Owner del negocio (business_owner)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null
    },

    // Métodos de pago aceptados
    paymentMethods: {
      cash: { type: Boolean, default: true },        // Efectivo
      card: { type: Boolean, default: false },       // Tarjeta
      transfer: { type: Boolean, default: false }    // Transferencia
    },

    // Datos bancarios para transferencias
    bankInfo: {
      bankName: { type: String, default: null },
      accountNumber: { type: String, default: null },
      clabe: { type: String, default: null },
      accountHolder: { type: String, default: null },
    },

    // Color personalizado del negocio (para UI del menú)
    brandColor: {
      type: String,
      default: null  // Si es null, usar rojo por defecto (#E53935)
    },
  },
  { timestamps: true }
);

// Índices
businessSchema.index({ location: "2dsphere" });
businessSchema.index({ category: 1 });
businessSchema.index({ isActive: 1, isOpen: 1 });

export default mongoose.model("Business", businessSchema);
