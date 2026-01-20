import { Schema, model } from "mongoose";

let collection = "users";

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, select: false },
  address: {
    street: { type: String },
    reference: { type: String },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  role: {
    type: String,
    enum: ["admin", "business_owner", "driver", "customer"],
    default: "customer"
  },
  // Solo para business_owner: negocio asignado
  businessId: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    default: null
  },
}, {
  timestamps: true
});

let User = model(collection, schema);
export default User;
