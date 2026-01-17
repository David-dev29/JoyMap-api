import Product from '../../models/Product.js';
import { io } from "../../server.js";

const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    io.emit('productDeleted', deletedProduct);

    return res.status(200).json({
      success: true,
      response: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export { deleteProduct };
