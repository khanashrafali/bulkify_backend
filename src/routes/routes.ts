import { Router } from "express";
import {
  addressRoutes,
  adminRoutes,
  adsRoutes,
  authRoutes,
  badalDaloProductsRoutes,
  bankRoutes,
  brandRoutes,
  cartRoutes,
  categoryRoutes,
  collectionRoutes,
  contentRoutes,
  couponRoutes,
  deleveryRoutes,
  dynamicRoutes,
  erpApiRoutes,
  hdfcRoutes,
  inventoryRoutes,
  mainCatRoutes,
  notificationRoutes,
  orderRoutes,
  payoutRoutes,
  pricesRoutes,
  productRoutes,
  queriesRoutes,
  reviewRoutes,
  roleRoutes,
  shipchargeRoutes,
  shipRocketRoutes,
  sliderRoutes,
  userRoutes,
  utilRoutes,
  variantsRoutes,
  vendorRoutes,
  wishlistRoutes,
} from ".";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/vendors", vendorRoutes);
router.use("/products", productRoutes);
router.use("/collections", collectionRoutes);
router.use("/utils", utilRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/address", addressRoutes);
router.use("/banks", bankRoutes);
router.use("/slider", sliderRoutes);
router.use("/review", reviewRoutes);
router.use("/admins", adminRoutes);
router.use("/ship-rocket", shipRocketRoutes);
router.use("/payouts", payoutRoutes);
router.use("/content", contentRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/prices", pricesRoutes);
router.use("/erp-api", erpApiRoutes);
router.use("/variants", variantsRoutes);
router.use("/delevery-address", deleveryRoutes);
router.use("/roles", roleRoutes);
router.use("/main-categories", mainCatRoutes);
router.use("/hdfc", hdfcRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/brands", brandRoutes);
router.use("/ads", adsRoutes);
router.use("/DB-products", badalDaloProductsRoutes);
router.use("/queries", queriesRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dynamic-heading", dynamicRoutes);
router.use("/ship-charge", shipchargeRoutes);

export default router;
