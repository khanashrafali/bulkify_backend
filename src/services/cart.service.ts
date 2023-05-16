import { Res } from "tsoa";
import { bdProductModel, cartModel } from "../models";
import { helper } from "../utils";
import { IRequest } from "../utils/interfaces";
import adminService from "./admin.service";
import bdService from "./bd.service";
import productService from "./product.service";

helper.loadEnvFile();

const calculateShipCharge = async (cartTotal: number) => {
  let config = await adminService.getConfigInfo();
  let shippingCharge = 0;

  if (config.cartTotalPrice > 0) {
    if (cartTotal < config.cartTotalPrice) {
      shippingCharge = config.shippingCharge;
    }
  }

  return shippingCharge;
};

const getCartTotal = async (userId: string) => {
  try {
    let cartItems = await cartModel.find({ user: userId }).populate({ path: "product" });
    const itemTotal = cartItems.reduce((amount: number, c: any) => c.quantity * c.product.sellingPrice + amount, 0);
    const shippingCharges = 0;
    return { totalItem: cartItems?.length || 0, itemTotal, shippingCharges, total: itemTotal + shippingCharges };
  } catch (error) {
    throw error;
  }
};

/**
 * check item is out of stock
 */
const checkOutOfStock = async (productId: string, size: string, quantity: number, isCart: boolean) => {
  let product = await productService.findProduct(productId);
  let productToJson: any = product.toJSON();
  let sizeExists = productToJson.sizes.find((v: any) => v == size);

  if (!sizeExists) throw helper.buildError("Product not available!", 404);

  if (!isCart) return { product, size, cartItemQuantity: quantity };
  if (product.quantity < 1) throw helper.buildError("Out of stocks", 400);
  if (product.quantity < quantity) {
    throw helper.buildError(`Out of stock`, 400);
  }

  return { product, size, cartItemQuantity: quantity };
};

/**
 * add item into cart handler
 */
const addCartItem = async (req: IRequest, productId: string, size: string, quantity: number,customization:string,coupleName:string, throwExistsError: boolean = true) => {
  try {
    await checkOutOfStock(productId, size, quantity, true);
    const cItem = await cartModel.findOne({ product: productId, user: req.user._id });
    if (cItem && !throwExistsError) return;
    if (cItem) throw helper.buildError("Item already added", 200);
    await cartModel.create({ product: productId, size, quantity,customization,coupleName, user: req.user._id });
    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

/**
 * delete item from cart handler
 */
const deleteCartItem = async (req: IRequest, itemId: string) => {
  try {
    const cItem = await cartModel.findOne({ _id: itemId, user: req.user._id });
    if (!cItem) throw helper.buildError("No item found with this id", 404);
    await cItem.remove();
    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

/**
 * decrease item from cart handler
 */
const decreaseCartItem = async (req: IRequest, itemId: string) => {
  try {
    const cItem = await cartModel.findOne({ _id: itemId, user: req.user._id });
    if (!cItem) throw helper.buildError("No item found with this id", 404);
    let cItemToJson: any = cItem.toJSON();
    if (cItemToJson.quantity > 1) await cItem.set({ quantity: cItemToJson.quantity - 1 }).save();
    else await cItem.remove();

    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

/**
 * increase item from cart handler
 */
const increaseCartItem = async (req: IRequest, itemId: string) => {
  try {
    const cItem = await cartModel.findOne({ _id: itemId, user: req.user._id });
    if (!cItem) throw helper.buildError("No item found with this id", 404);
    let cItemToJson: any = cItem.toJSON();
    await checkOutOfStock(cItemToJson?.product?.toString(), cItemToJson?.variant?._id?.toString(), cItemToJson?.quantity + 1, true);
    await cItem.set({ quantity: cItemToJson.quantity + 1 }).save();
    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

/**
 * get cart handler
 */
const getCart = async (userId: string) => {
  try {
    let items = await cartModel.find({ user: userId }).populate({ path: "product" }).lean();
    let total = 0;
    let totalQty = 0;

    items = items.map((ci: any) => {
      total += ci.quantity * ci.product.sellingPrice;
      totalQty += ci.quantity;
      return ci;
    });

    return { items, total, totalQty };
  } catch (error) {
    await clearCart(userId);
    throw error;
  }
};

/**
 * clear cart handler
 */
const clearCart = async (userId: string) => {
  try {
    await cartModel.deleteMany({ user: userId });
    return await getCartTotal(userId);
  } catch (error) {
    throw error;
  }
};

/**
 * add items into cart handler
 */
const addCartItems = async (req: IRequest, items: any[]) => {
  try {
    await clearCart(req.user._id);
    for await (let item of items) await addCartItem(req, item.productId, item.size, item.quantity,item.coupleName, item.customization,false);
    return await getCartTotal(req.user._id);
  } catch (error) {
    throw error;
  }
};

export default {
  addCartItem,
  deleteCartItem,
  decreaseCartItem,
  increaseCartItem,
  getCart,
  clearCart,
  checkOutOfStock,
  addCartItems,
  getCartTotal,
};
