import multer from "multer";

const storage = multer.memoryStorage();

// Configuración básica para productos (un solo archivo)
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  }
});

// 🔹 Configuración específica para categorías (múltiples campos)
export const uploadCategoryImages = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por archivo
    files: 2, // máximo 2 archivos
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 Archivo recibido:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    // Verificar que sean imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
}).fields([
  { name: 'icon', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);

// 🔹 Configuración específica para negocios (logo y banner)
export const uploadBusinessImages = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por archivo
    files: 2, // máximo 2 archivos
  },
  fileFilter: (req, file, cb) => {
    console.log('🏪 Archivo de negocio recibido:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    // Verificar que sean imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);

// 🔹 Alternativa más permisiva para debug
export const uploadAnyImages = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 Archivo recibido (ANY):', file.fieldname, file.originalname);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
}).any(); // Acepta cualquier campo

// Export por defecto (para productos)
export default upload;