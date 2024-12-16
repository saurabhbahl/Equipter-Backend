import express from "express";
import {
  createNewProduct,
  updateProductDetails,
  removeProduct,
  fetchAllProductsWithDetails,
  fetchProductByIdWithDetails,
  isSlugUnique,
  getAllProductImages,
  addProductImage,
  getProductImageById,
  deleteProductImage,
  updateProductImageById,
  fetchProductByURLWithDetails,
} from "../controllers/product.controller.js";
import { checkAdminRole, verifyToken } from "../middlewares/verifyToken.js";

const productRouter = express.Router();
productRouter.get("/", fetchAllProductsWithDetails);
productRouter.get("/url/:url", fetchProductByURLWithDetails);


productRouter.get("/slug",  verifyToken, checkAdminRole,isSlugUnique);
productRouter.get("/:id", verifyToken, checkAdminRole, fetchProductByIdWithDetails);
productRouter.post("/", verifyToken, checkAdminRole, createNewProduct);
productRouter.put("/:id",  verifyToken, checkAdminRole,updateProductDetails);
productRouter.delete("/:id", verifyToken, checkAdminRole, removeProduct);

// product images

productRouter.get("/product-images",verifyToken, checkAdminRole, getAllProductImages);
productRouter.post("/product-images",verifyToken, checkAdminRole, addProductImage);
productRouter.get("/product-images/:id",verifyToken, checkAdminRole, getProductImageById);
productRouter.put("/product-images/:id",verifyToken, checkAdminRole, updateProductImageById);
productRouter.delete("/product-images/:id",verifyToken, checkAdminRole, deleteProductImage);

export default productRouter;
