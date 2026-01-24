import { Schema, model } from "mongoose";

const collection = "settings";

const schema = new Schema({
  appName: { type: String, default: 'JoyMap' },
  logo: { type: String, default: null },
  logoText: { type: String, default: null },
  primaryColor: { type: String, default: '#E53935' },
  secondaryColor: { type: String, default: '#1976D2' },
  slogan: { type: String, default: 'Tu comida favorita' },
  contactEmail: { type: String, default: null },
  contactPhone: { type: String, default: null },
  contactWhatsApp: { type: String, default: null },
  address: { type: String, default: null },
  socialMedia: {
    facebook: { type: String, default: null },
    instagram: { type: String, default: null },
    twitter: { type: String, default: null },
    tiktok: { type: String, default: null }
  },
  deliveryFee: { type: Number, default: 15 },
  minOrderAmount: { type: Number, default: 50 },
  maxDeliveryRadius: { type: Number, default: 10 }, // km
  currency: { type: String, default: 'MXN' },
  currencySymbol: { type: String, default: '$' },
  timezone: { type: String, default: 'America/Mexico_City' },
  isMaintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: 'Estamos en mantenimiento. Volvemos pronto.' },
  termsUrl: { type: String, default: null },
  privacyUrl: { type: String, default: null }
}, {
  timestamps: true
});

// Singleton - Solo debe existir un documento de settings
schema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = model(collection, schema);
export default Settings;
