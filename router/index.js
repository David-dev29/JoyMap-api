import { Router } from 'express';
import authRouter from "./auth.js";
import meRouter from "./me.js";
import adminRouter from "./admin.js";
import userRouter from "./users.js";
import orderRouter from "./orders.js";
import storesRouter from "./stores.js";
import categoriesRouter from "./categories.js";
import subcategoriesRouter from "./subcategories.js";
import productsRouter from "./products.js";
import kitchensRouter from "./kitchens.js";
import businessesRouter from "./business.js";
import categoriesBusinessesRouter from "./categoriesBusiness.js";
import discountsRouter from "./discounts.js";
import reviewsRouter from "./reviews.js";
import productCategoriesRouter from "./productCategories.js";
import settingsRouter from "./settings.js";
import couponsRouter from "./coupons.js";
import statsRouter from "./stats.js";
import promotionsRouter from "./promotions.js";

const router = Router();

// Auth y rutas personales
router.use('/auth', authRouter);
router.use('/me', meRouter);
router.use('/admin', adminRouter);

// Recursos
router.use('/users', userRouter)
router.use('/orders', orderRouter)
router.use('/stores', storesRouter)
router.use('/categories', categoriesRouter)
router.use('/subcategories', subcategoriesRouter)
router.use('/products', productsRouter)
router.use('/kitchens', kitchensRouter)
router.use('/map', businessesRouter)
router.use('/businesses', businessesRouter)
router.use('/business-categories', categoriesBusinessesRouter)
router.use('/discounts', discountsRouter)
router.use('/reviews', reviewsRouter)
router.use('/product-categories', productCategoriesRouter)
router.use('/settings', settingsRouter)
router.use('/coupons', couponsRouter)
router.use('/stats', statsRouter)
router.use('/promotions', promotionsRouter)

export default router
