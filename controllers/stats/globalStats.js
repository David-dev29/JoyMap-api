import Order from '../../models/Order.js';
import Business from '../../models/Business.js';
import User from '../../models/User.js';

export const getGlobalStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Stats de los últimos 7 días para gráficos
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await Order.find({
        createdAt: { $gte: date, $lt: nextDate },
        status: { $in: ['delivered', 'completed'] }
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('es-MX', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      });
    }

    // Stats de hoy
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      status: { $in: ['delivered', 'completed'] }
    });

    // Stats de ayer
    const yesterdayOrders = await Order.find({
      createdAt: { $gte: yesterday, $lt: today },
      status: { $in: ['delivered', 'completed'] }
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Calcular crecimiento porcentual
    const revenueGrowth = yesterdayRevenue > 0
      ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
      : todayRevenue > 0 ? 100 : 0;

    const ordersGrowth = yesterdayOrders.length > 0
      ? Math.round(((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100)
      : todayOrders.length > 0 ? 100 : 0;

    // Top 5 negocios (últimos 30 días)
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    const topBusinesses = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
          status: { $in: ['delivered', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$businessId',
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'businesses',
          localField: '_id',
          foreignField: '_id',
          as: 'business'
        }
      },
      { $unwind: { path: '$business', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          businessId: '$_id',
          name: { $ifNull: ['$business.name', 'Negocio eliminado'] },
          logo: '$business.logo',
          mapIcon: '$business.mapIcon',
          totalRevenue: 1,
          totalOrders: 1
        }
      }
    ]);

    // Órdenes recientes (últimas 10)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('businessId', 'name logo')
      .populate('customerId', 'name phone');

    res.json({
      success: true,
      data: {
        today: {
          orders: todayOrders.length,
          revenue: todayRevenue,
          ordersGrowth,
          revenueGrowth
        },
        yesterday: {
          orders: yesterdayOrders.length,
          revenue: yesterdayRevenue
        },
        last7Days,
        topBusinesses,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error getting global stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas globales',
      error: error.message
    });
  }
};
