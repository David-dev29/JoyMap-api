import Settings from "../../models/Settings.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";

// PUT /api/settings - Solo ADMIN
export const updateSettings = async (req, res) => {
  try {
    const {
      appName,
      logo,
      logoText,
      primaryColor,
      secondaryColor,
      slogan,
      contactEmail,
      contactPhone,
      contactWhatsApp,
      address,
      socialMedia,
      deliveryFee,
      minOrderAmount,
      maxDeliveryRadius,
      currency,
      currencySymbol,
      timezone,
      isMaintenanceMode,
      maintenanceMessage,
      termsUrl,
      privacyUrl
    } = req.body;

    let settings = await Settings.getSettings();

    // Actualizar solo los campos proporcionados
    if (appName !== undefined) settings.appName = appName;
    if (logo !== undefined) settings.logo = logo;
    if (logoText !== undefined) settings.logoText = logoText;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (secondaryColor !== undefined) settings.secondaryColor = secondaryColor;
    if (slogan !== undefined) settings.slogan = slogan;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (contactWhatsApp !== undefined) settings.contactWhatsApp = contactWhatsApp;
    if (address !== undefined) settings.address = address;
    if (socialMedia !== undefined) {
      settings.socialMedia = {
        ...settings.socialMedia,
        ...socialMedia
      };
    }
    if (deliveryFee !== undefined) settings.deliveryFee = deliveryFee;
    if (minOrderAmount !== undefined) settings.minOrderAmount = minOrderAmount;
    if (maxDeliveryRadius !== undefined) settings.maxDeliveryRadius = maxDeliveryRadius;
    if (currency !== undefined) settings.currency = currency;
    if (currencySymbol !== undefined) settings.currencySymbol = currencySymbol;
    if (timezone !== undefined) settings.timezone = timezone;
    if (isMaintenanceMode !== undefined) settings.isMaintenanceMode = isMaintenanceMode;
    if (maintenanceMessage !== undefined) settings.maintenanceMessage = maintenanceMessage;
    if (termsUrl !== undefined) settings.termsUrl = termsUrl;
    if (privacyUrl !== undefined) settings.privacyUrl = privacyUrl;

    await settings.save();

    res.json({
      success: true,
      message: "Configuración actualizada exitosamente",
      settings
    });
  } catch (error) {
    console.error("Error actualizando settings:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la configuración",
      error: error.message
    });
  }
};

// POST /api/settings/upload-logo - Subir logo a S3
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionó imagen"
      });
    }

    const logoType = req.body.type || 'logo'; // 'logo' o 'logoText'
    const folder = logoType === 'logoText' ? 'settings/logo-text' : 'settings/logo';

    // Subir a S3
    const logoUrl = await uploadToS3(req.file, folder);

    // Actualizar settings
    let settings = await Settings.getSettings();

    if (logoType === 'logoText') {
      settings.logoText = logoUrl;
    } else {
      settings.logo = logoUrl;
    }

    await settings.save();

    res.json({
      success: true,
      message: `${logoType === 'logoText' ? 'Logo tipográfico' : 'Logo'} actualizado exitosamente`,
      url: logoUrl,
      logoType,
      settings
    });
  } catch (error) {
    console.error("Error subiendo logo:", error);
    res.status(500).json({
      success: false,
      message: "Error al subir el logo",
      error: error.message
    });
  }
};
