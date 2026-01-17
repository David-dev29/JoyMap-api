import Order from "../../models/Order.js";
import Payment from "../../models/Payment.js";
import { io } from "../../server.js"; // 🔹 Importa la instancia de io

export const updateOrder = async (req, res, next) => {
  try {
    // 1. Actualiza la orden como lo haces ahora
    const orderUpdated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!orderUpdated) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✨ LA SOLUCIÓN: Antes de responder, popula todos los campos necesarios.
    const populatedOrder = await orderUpdated.populate([
        { path: 'customerId', select: 'name phone' },
        { path: 'deliveryPerson' },
        { path: 'payments' } // <--- ESTA LÍNEA ES LA CLAVE
    ]);

    // 2. Emite y responde con la orden COMPLETA
    io.emit("order:update", populatedOrder);
    return res.status(200).json({ response: populatedOrder });

  } catch (error) {
    next(error);
  }
};


export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const { id } = req.params;

    // ✨ 1. Log para verificar que recibimos los datos correctos
    console.log(`Intentando cancelar pedido: ${id} con razón: ${reason}`);

    // Primero, buscamos el pedido para asegurar que existe
    const order = await Order.findById(id);

    if (!order) {
      console.log(`Cancelación fallida: Pedido con ID ${id} no encontrado.`);
      return res.status(404).json({ message: "Order not found" });
    }

    // ✨ 2. Actualizamos los campos y guardamos explícitamente
    // Esto es más robusto que findByIdAndUpdate para depurar.
    order.status = "cancelled";
    order.cancelReason = reason;
    const savedOrder = await order.save(); // Guardamos el documento actualizado

    // ✨ 3. Log para confirmar que el guardado fue exitoso
    console.log("Pedido guardado con estado:", savedOrder.status);

    // Populate para enviar la info completa al frontend
    const orderCancelled = await Order.findById(savedOrder._id)
      .populate("customerId", "name phone")
      .populate("deliveryPerson");
    
    // Emitir evento al frontend
    io.emit("order:update", orderCancelled);

    return res.status(200).json({ response: orderCancelled });

  } catch (error) {
    // ✨ 4. Log de errores detallado
    console.error("Error detallado en cancelOrder:", error);
    next(error);
  }
};


// --- ✨ VERSIÓN FINAL Y CORREGIDA DE registerPayment ---
export const registerPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, tip, method, cashReceived } = req.body;

    const order = await Order.findById(id).populate('payments'); // <-- Pobla los pagos desde el inicio
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const totalCollected = (Number(amount) || 0) + (Number(tip) || 0);
    let changeGiven = 0;
    if (method === 'Efectivo' && cashReceived) {
      changeGiven = (Number(cashReceived) || 0) - totalCollected;
    }

    const newPayment = new Payment({
      orderId: id,
      amount: Number(amount),
      tip: Number(tip),
      method: method,
      amountTendered: Number(cashReceived) || 0,
      changeGiven: changeGiven,
    });
    await newPayment.save();

    // --- ✨ LÓGICA DE ACTUALIZACIÓN CORREGIDA ---
    
    // 1. Calcula el total que ya estaba pagado
    const previouslyPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
    
    // 2. Súmale el nuevo pago para obtener el total final
    const newTotalPaid = previouslyPaid + newPayment.amount;

    // 3. Actualiza el estado basándote en este cálculo fiable
    if (newTotalPaid >= order.subtotal) {
      order.paymentStatus = 'paid';
    } else {
      order.paymentStatus = 'partial';
    }

    // 4. Añade la referencia del nuevo pago y guarda la orden
    order.payments.push(newPayment._id);
    await order.save();
    
    // 5. Popula la orden actualizada para la respuesta
    const populatedOrder = await Order.findById(order._id)
      .populate('customerId', 'name phone')
      .populate('payments');

    io.emit("order:update", populatedOrder);
    return res.status(200).json({ response: populatedOrder });

  } catch (error) {
    console.error("Error al registrar el pago:", error);
    next(error);
  }
};



// PATCH /api/orders/:orderId/items/:itemId
export const updateOrderItemStatus = async (req, res, next) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body; // ej. { status: "prepared" }

    console.log("=== updateOrderItemStatus ===");
    console.log("orderId:", orderId);
    console.log("itemId:", itemId);
    console.log("status recibido:", status);

    // 1. Buscar la orden
    const order = await Order.findById(orderId).populate({
      path: "items.productId",
      populate: { path: "kitchenId", model: "kitchens" } // 👈 poblamos kitchenId dentro del producto
    });

    if (!order) {
      console.log("Orden no encontrada");
      return res.status(404).json({ message: "Order not found" });
    }
    console.log("Orden encontrada:", order._id, "con items:", order.items.length);

    // 2. Encontrar el item dentro de la orden
    const item = order.items.id(itemId);
    if (!item) {
      console.log("Item no encontrado en la orden");
      return res.status(404).json({ message: "Item not found" });
    }
    console.log("Item encontrado:", item._id, "status actual:", item.status);

    // 3. Actualizar el estado del item
    item.status = status;
    await order.save();
    console.log("Item actualizado a status:", item.status);

    // 4. Verificar todos los items por cocina
    const itemsByKitchen = {};
    order.items.forEach(it => {
      const kitchenId = it.productId?.kitchenId?._id?.toString();
      if (!kitchenId) return;
      if (!itemsByKitchen[kitchenId]) itemsByKitchen[kitchenId] = [];
      itemsByKitchen[kitchenId].push(it.status);
    });
    console.log("Estado de items por cocina:", itemsByKitchen);

    // 5. Calcular estado final por cocina
    const kitchensStatus = {};
    for (const [kitchenId, statuses] of Object.entries(itemsByKitchen)) {
      if (statuses.every(st => st === "prepared")) {
        kitchensStatus[kitchenId] = "ready";
      } else if (statuses.some(st => st === "preparing")) {
        kitchensStatus[kitchenId] = "preparing";
      } else {
        kitchensStatus[kitchenId] = "pending";
      }
    }
    console.log("Estado final por cocina:", kitchensStatus);

    // 6. Guardar el estado de las cocinas en la orden
    order.kitchensStatus = kitchensStatus;
    await order.save();
    console.log("Orden guardada con kitchensStatus actualizado");

    // 7. Repoblar la orden completa para responder (con todos los datos necesarios)
    const populatedOrder = await Order.findById(orderId)
      .populate("customerId", "name phone")
      .populate("deliveryPerson")
      .populate("payments")
      .populate({
        path: "items.productId",
        populate: { path: "kitchenId", model: "kitchens" }
      });

    console.log("Orden repoblada y lista para emitir");

    // 8. Emitir el cambio al frontend en tiempo real
    io.emit("order:update", populatedOrder);
    console.log("Evento 'order:update' emitido");

    return res.status(200).json({ response: populatedOrder });
  } catch (error) {
    console.error("Error al actualizar el estado del item:", error);
    next(error);
  }
};




