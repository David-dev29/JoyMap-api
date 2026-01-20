import { Schema, model } from "mongoose";

const collection = "orders";

const schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', default: null },

  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
      name: { type: String }, // redundancia para consultas rápidas
      price: { type: Number },
      quantity: { type: Number, required: true },
      status: {
        type: String,
        enum: ['pending', 'preparing', 'prepared'],
        default: 'pending'
      }
    }
  ],

  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'onTheWay', 'delivered', 'cancelled'],
    default: 'pending'
  },

  statusHistory: [
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],

  deliveryAddress: {
    street: { type: String },
    reference: { type: String },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },

  deliveryPerson: { type: Schema.Types.ObjectId, ref: 'User' }, // rol delivery

  paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'partial'], default: 'pending' },

  notes: { type: String }, // instrucciones extra
  orderNumber: { type: Number },
  payments: [{ type: Schema.Types.ObjectId, ref: 'payments' }], // <-- nuevo campo

  // 🔥 Nuevo: estado por cocina
  kitchensStatus: {
    type: Map,
    of: String, // "ready" | "preparing" | "pending"
    default: {}
  }
}, {
  timestamps: true
});

export default model(collection, schema);
