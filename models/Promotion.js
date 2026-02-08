import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    // Tipo de promoción: banner hero, carrusel, popup
    type: {
      type: String,
      enum: ["hero", "carousel", "popup"],
      default: "carousel",
    },
    // A dónde lleva el click
    linkType: {
      type: String,
      enum: ["none", "url", "business", "category", "product"],
      default: "none",
    },
    linkValue: {
      type: String,
      default: null,
    },
    // Etiqueta/badge (ej: "30% OFF", "Nuevo", "Popular")
    badge: {
      type: String,
      default: null,
      trim: true,
    },
    // Orden de los elementos visuales en la tarjeta
    contentOrder: {
      type: [String],
      default: ["title", "badge", "subtitle"],
    },
    // Configuración visual
    backgroundColor: {
      type: String,
      default: "#E11D48",
    },
    textColor: {
      type: String,
      default: "#FFFFFF",
    },
    // Control
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    // Fechas de vigencia (opcional)
    startsAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

promotionSchema.index({ isActive: 1, order: 1 });

export default mongoose.model("Promotion", promotionSchema);
