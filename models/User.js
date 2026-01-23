import { Schema, model } from "mongoose";

let collection = "users";

// Schema para direcciones
const addressSchema = new Schema({
  label: { type: String, default: "Casa" }, // Casa, Trabajo, Otro
  street: { type: String },
  reference: { type: String },
  coordinates: { type: [Number] }, // [lng, lat]
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  // Password opcional para flujo quick-register
  password: { type: String, required: false, select: false },
  // Dirección principal (legacy/compatibilidad)
  address: {
    street: { type: String },
    reference: { type: String },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  // Array de direcciones guardadas
  addresses: [addressSchema],
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
  // Para quick-register: indica si el usuario tiene password configurado
  hasPassword: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index para búsquedas por teléfono
schema.index({ phone: 1 });

let User = model(collection, schema);
export default User;
