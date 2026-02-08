import mongoose from "mongoose";

const userFavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Un usuario solo puede tener un favorito por negocio
userFavoriteSchema.index({ userId: 1, businessId: 1 }, { unique: true });

export default mongoose.model("UserFavorite", userFavoriteSchema);
