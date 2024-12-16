import express from "express";
import { isSlugUnique,addAccessoryImage, createAccessoryProduct, createNewAccessory, deleteAccessoryImage, fetchAccessoryByIdWithImages,  fetchAllAccessoriesWithImages, getAccessoryImageById, getAllAccessoryImages, getAllAccessoryProducts, removeAccessory, removeAccessoryProduct, updateAccessoryDetails, ensureFeaturedImage } from "../controllers/accessory.controller.js";
import { checkAdminRole, verifyToken } from "../middlewares/verifyToken.js";



const accessoryRouter = express.Router();

accessoryRouter.get("/", fetchAllAccessoriesWithImages);

// Accessory Products Routes
accessoryRouter.get("/slug",verifyToken, checkAdminRole, isSlugUnique);
accessoryRouter.delete("/accessory-products",verifyToken, checkAdminRole, removeAccessoryProduct);
accessoryRouter.get("/accessory-products", verifyToken, checkAdminRole,getAllAccessoryProducts);
accessoryRouter.post("/accessory-products",verifyToken, checkAdminRole, createAccessoryProduct);
accessoryRouter.post("/:id/images/ensure-featured",verifyToken, checkAdminRole, ensureFeaturedImage);

// Accessory CRUD routes
accessoryRouter.get("/:id/", verifyToken, checkAdminRole,fetchAccessoryByIdWithImages);
accessoryRouter.post("/",verifyToken, checkAdminRole, createNewAccessory);
accessoryRouter.put("/:id",verifyToken, checkAdminRole, updateAccessoryDetails);
accessoryRouter.delete("/:id", verifyToken, checkAdminRole,removeAccessory);



// Accessory Images Routes
accessoryRouter.get("/accessory-images",verifyToken, checkAdminRole, getAllAccessoryImages);
accessoryRouter.post("/accessory-images", verifyToken, checkAdminRole,addAccessoryImage);
accessoryRouter.get("/accessory-images/:id",verifyToken, checkAdminRole, getAccessoryImageById);
accessoryRouter.delete("/accessory-images/:id",verifyToken, checkAdminRole, deleteAccessoryImage);




export default accessoryRouter;
