import Settings from "../../models/Settings.js";

// GET /api/settings - PÚBLICO (sin auth)
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      settings: {
        appName: settings.appName,
        logo: settings.logo,
        logoText: settings.logoText,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        slogan: settings.slogan,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        contactWhatsApp: settings.contactWhatsApp,
        address: settings.address,
        socialMedia: settings.socialMedia,
        deliveryFee: settings.deliveryFee,
        minOrderAmount: settings.minOrderAmount,
        maxDeliveryRadius: settings.maxDeliveryRadius,
        currency: settings.currency,
        currencySymbol: settings.currencySymbol,
        timezone: settings.timezone,
        isMaintenanceMode: settings.isMaintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
        termsUrl: settings.termsUrl,
        privacyUrl: settings.privacyUrl
      }
    });
  } catch (error) {
    console.error("Error obteniendo settings:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la configuración",
      error: error.message
    });
  }
};

// GET /api/settings/full - Solo ADMIN (incluye timestamps)
export const getFullSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error("Error obteniendo settings:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la configuración",
      error: error.message
    });
  }
};
