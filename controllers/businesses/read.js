import Business from "../../models/Business.js";

export const getBusinessesByType = async (req, res) => {
  try {
    const { type } = req.params; // comida, tienda, envio

    // Validar tipo
    if (!['comida', 'tienda', 'envio'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Tipo inválido. Debe ser: comida, tienda o envio"
      });
    }

    // Buscar negocios y popular la categoría para filtrar por type
    const businesses = await Business.find({ isActive: true })
      .populate({
        path: 'category',
        match: { type: type }, // ✅ Filtrar por tipo de categoría
        select: 'name slug icon type'
      })
      .select('name category location mapIcon iconType iconSvg isOpen rating discount deliveryTime deliveryCost minOrderAmount logo banner address description paymentMethods brandColor')
      .sort({ createdAt: -1 });

    // Filtrar negocios que tengan categoría (el match puede devolver null)
    const filteredBusinesses = businesses.filter(b => b.category !== null);

    return res.status(200).json({
      success: true,
      count: filteredBusinesses.length,
      type: type,
      response: filteredBusinesses
    });

  } catch (error) {
    console.error("❌ getBusinessesByType:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener negocios"
    });
  }
};

// ============================================
// 2. ACTUALIZAR: allMapBusinesses 

// 🗺️ Para el mapa - Solo devuelve lo necesario
export const allMapBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ isActive: true })
      .populate('category', 'name slug icon type') // ✅ Agregado 'type'
      .select('name category location mapIcon iconType iconSvg isOpen rating discount deliveryTime deliveryCost minOrderAmount logo banner paymentMethods brandColor')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      response: businesses
    });
  } catch (error) {
    next(error);
  }
};

// 📋 Para el admin/dashboard - Filtra según rol
export const getAllBusinesses = async (req, res) => {
  try {
    let filter = { isActive: true };

    // Si hay usuario autenticado y es business_owner, solo ve su negocio
    if (req.user && req.user.role === "business_owner" && req.user.businessId) {
      filter._id = req.user.businessId;
    }

    const businesses = await Business.find(filter)
      .populate("category", "name slug icon type")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: businesses.length,
      response: businesses
    });
  } catch (error) {
    console.error("Error getAllBusinesses:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener negocios"
    });
  }
};

// 🔍 Obtener un negocio por ID
export const mapBusinessByID = async (req, res, next) => {
  try {
    const businessId = req.params.id;

    const business = await Business.findById(businessId)
      .populate('category', 'name slug icon type'); // ✅ Agregado 'type'

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      response: business
    });
  } catch (error) {
    next(error);
  }
};


export const getBusinessBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    console.log(`🔍 Buscando negocio con slug: ${slug}`);
    
    // Convertir slug a patrón de búsqueda más flexible
    // "taqueria-el-buen-pastor" -> "taqueria.*el.*buen.*pastor"
    const searchPattern = slug
      .split('-')
      .map(word => {
        // Crear patrón que incluya versiones con y sin tildes
        return word
          .replace(/a/g, '[aáàâä]')
          .replace(/e/g, '[eéèêë]')
          .replace(/i/g, '[iíìîï]')
          .replace(/o/g, '[oóòôö]')
          .replace(/u/g, '[uúùûü]')
          .replace(/n/g, '[nñ]');
      })
      .join('.*'); // Permite espacios u otros caracteres entre palabras
    
    console.log(`🔎 Patrón de búsqueda: ${searchPattern}`);
    
    // Buscar negocio con regex case-insensitive
    const business = await Business.findOne({
      name: { $regex: new RegExp(searchPattern, 'i') },
      isActive: true
    })
    .populate('category', 'name slug icon type');

    if (!business) {
      console.log('❌ Negocio no encontrado');
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    console.log('✅ Negocio encontrado:', business.name);

    return res.status(200).json({
      success: true,
      response: business
    });

  } catch (error) {
    console.error("❌ Error en getBusinessBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Error al buscar negocio"
    });
  }
};