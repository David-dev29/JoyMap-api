import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3Client.js";

const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

// 🔹 Función principal que detecta el tipo de archivo
export const uploadToS3 = async (file, folder = null) => {
  // Determinar la carpeta automáticamente si no se especifica
  let uploadFolder = folder;
  
  if (!uploadFolder) {
    // Detectar por fieldname
    if (file.fieldname === 'icon') {
      uploadFolder = 'categories/icons';
    } else if (file.fieldname === 'banner') {
      // Banner puede ser de categoría o negocio
      uploadFolder = 'businesses/banners'; // ⬅️ CAMBIÉ: ahora por defecto va a businesses
    } else if (file.fieldname === 'logo') {
      // Logo de negocio
      uploadFolder = 'businesses/logos';
    } else {
      // Por defecto productos
      uploadFolder = 'products';
    }
  }

  const fileKey = `${uploadFolder}/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    
    // ⬇️ IMPORTANTE: Asegurar que siempre tenga https://
    const cloudfront = CLOUDFRONT_DOMAIN.startsWith('http') 
      ? CLOUDFRONT_DOMAIN 
      : `https://${CLOUDFRONT_DOMAIN}`;
    
    const url = `${cloudfront}/${fileKey}`;
    
    console.log(`✅ Archivo subido: ${file.originalname} -> ${url}`);
    return url;
  } catch (error) {
    console.error(`❌ Error subiendo archivo ${file.originalname}:`, error);
    throw error;
  }
};

// 🔹 Funciones específicas para mayor claridad
export const uploadProductImage = async (file) => {
  return uploadToS3(file, 'products');
};

export const uploadCategoryIcon = async (file) => {
  return uploadToS3(file, 'categories/icons');
};

export const uploadCategoryBanner = async (file) => {
  return uploadToS3(file, 'categories/banners');
};

// 🔹 Funciones para negocios
export const uploadBusinessLogo = async (file) => {
  return uploadToS3(file, 'businesses/logos');
};

export const uploadBusinessBanner = async (file) => {
  return uploadToS3(file, 'businesses/banners');
};