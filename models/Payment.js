// models/Payment.js
import { Schema, model } from "mongoose";

const collection = "payments";

const schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'orders', required: true },
  amount: { type: Number, required: true }, // Lo que se abona a la cuenta
  tip: { type: Number, default: 0 },
  method: { type: String, enum: ['Efectivo', 'Tarjeta', 'Transferencia'], required: true },
  
  // ✨ CAMPOS NUEVOS Y CLAVE
  // El dinero que el cliente te entrega (solo relevante para 'Efectivo')
  amountTendered: { type: Number, default: 0 }, 
  // El cambio que le devuelves al cliente (solo relevante para 'Efectivo')
  changeGiven: { type: Number, default: 0 }, 
  
  transactionId: { type: String } 
}, {
  timestamps: true
});

export default model(collection, schema);