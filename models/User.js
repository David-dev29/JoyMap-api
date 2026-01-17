import { Schema, model } from "mongoose";

let collection = "users";

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // opcional si no todos usan email
  phone: { type: String, required: true },
  password: { type: String, required: false },
  address: {
    street: { type: String },
    reference: { type: String },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  role: { type: String, enum: ['customer', 'delivery', 'admin'], default: 'customer' },
}, {
  timestamps: true
});

let User = model(collection, schema);
export default User;
