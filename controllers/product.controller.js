import { and, eq, ne, sql } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import {
  product,
  accessoryProduct,
  webQuote,
  accessory,
  productImage,
  accessoryImage,
} from "../models/tables.js";

export const createNewProduct = async (req, res) => {
  try {
    const newProduct = await dbInstance
      .insert(product)
      .values(req.body)
      .returning();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProductDetails = async (req, res) => {
  try {
    const updatedProduct = await dbInstance
      .update(product)
      .set(req.body)
      .where(eq(product.id, req.params.id))
      .returning();
    console.log(updatedProduct);
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeProducts = async (req, res) => {
  try {
    const productId = req.params.id;

    // Step 1: Delete related records in web_quote
    await dbInstance.delete(webQuote).where(eq(webQuote.product_id, productId));

    // Step 2: Delete related records in quote_accessory
    await dbInstance
      .delete(quoteAccessory)
      .where(
        eq(
          quoteAccessory.webquote_id,
          dbInstance
            .select(webQuote.id)
            .from(webQuote)
            .where(eq(webQuote.product_id, productId))
        )
      );

    // Step 3: Delete related records in accessoryProduct
    await dbInstance
      .delete(accessoryProduct)
      .where(eq(accessoryProduct.product_id, productId));

    // Step 4: Delete related records in productImage
    await dbInstance
      .delete(productImage)
      .where(eq(productImage.product_id, productId));

    // Step 5: Delete the product itself
    const deletedProduct = await dbInstance
      .delete(product)
      .where(eq(product.id, productId))
      .returning();

    // Handle case where product was not found
    if (deletedProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Respond with success
    res.json({
      success: true,
      message: "Product and all related data deleted successfully",
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    let prod = await dbInstance
      .delete(product)
      .where(eq(product.id, req.params.id))
      .returning();
 
    if (prod.length == 0) {
      return res.json({ success: true, message: "No Product Found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const fetchAllProductsWithDetails = async (req, res) => {
  try {
    const products = await dbInstance.select().from(product);
    const productImages = await dbInstance.select().from(productImage);
    const accessories = await dbInstance
      .select({
        ...accessory,
        product_id: accessoryProduct.product_id,
      })
      .from(accessory)
      .innerJoin(
        accessoryProduct,
        eq(accessoryProduct.accessory_id, accessory.id)
      );

    const productsWithDetails = products.map((prod) => ({
      ...prod,
      images: productImages.filter((img) => img.product_id === prod.id),
      accessories: accessories.filter((acc) => acc.product_id === prod.id),
    }));

    res.json({
      success: true,
      length: productsWithDetails.length,
      data: productsWithDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const fetchProductByIdWithDetails = async (req, res) => {
  try {
    const productData = await dbInstance
      .select()
      .from(product)
      .where(eq(product.id, req.params.id));

    if (!productData.length) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const productDetails = productData[0];
    const productImages = await dbInstance
      .select()
      .from(productImage)
      .where(eq(productImage.product_id, req.params.id));
    const accessories = await dbInstance
      .select({
        ...accessory,
        product_id: accessoryProduct.product_id,
      })
      .from(accessory)
      .innerJoin(
        accessoryProduct,
        eq(accessoryProduct.accessory_id, accessory.id)
      )
      .where(eq(accessoryProduct.product_id, req.params.id));

    const productWithDetails = {
      ...productDetails,
      images: productImages,
      accessories,
    };

    res.json({ success: true, data: productWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const isSlugUnique = async (req, res) => {
  try {
    console.log("first");
    const { id, slug } = req.query;

    // Log query parameters (only for development)
    if (process.env.NODE_ENV === "development") {
      console.log("ID:", id, "Slug:", slug);
    }

    // Validate slug
    if (!slug) {
      return res
        .status(400)
        .json({ success: false, message: "Slug is required" });
    }

    // Check if we are editing or creating
    if (id) {
      // Validate ID format if it's expected to be a UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid ID format" });
      }

      // While editing, ensure slug is unique except for the current product
      const products = await dbInstance
        .select()
        .from(product)
        .where(and(eq(product.product_url, slug), ne(product.id, id)));

      const isUnique = products.length === 0;
      return res.json({
        success: isUnique,
        message: isUnique
          ? "The URL is Unique"
          : "This URL is already in use. Please modify the Meta Title.",
      });
    } else {
      // While creating, ensure slug is unique
      const products = await dbInstance
        .select()
        .from(product)
        .where(eq(product.product_url, slug));

      const isUnique = products.length === 0;
      return res.json({
        success: isUnique,
        message: isUnique
          ? "The URL is Unique"
          : "This URL is already in use. Please modify the Meta Title.",
      });
    }
  } catch (error) {
    console.error("Error in isSlugUnique:", error.message);
    res
      .status(500)
      .json({ success: false, error: "An unexpected error occurred." });
  }
};

// product images

export const getAllProductImages = async (req, res) => {
  try {
    const images = await dbInstance.select().from(productImage);
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addProductImage = async (req, res) => {
  try {
    const newImage = await dbInstance
      .insert(productImage)
      .values(req.body)
      .returning();

    res.status(201).json({ success: true, data: newImage[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductImageById = async (req, res) => {
  try {
    const image = await dbInstance
      .select()
      .from(productImage)
      .where(eq(productImage.id, req.params.id));

    if (!image.length) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    res.json({ success: true, data: image[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const updateProductImageById1 = async (req, res) => {
  try {
    const image = await dbInstance
      .select()
      .update(productImage)
      .set(req.body)
      .where(eq(productImage.id, req.params.id))
      .returning();

    if (!image.length) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    res.json({ success: true, data: image[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProductImageById = async (req, res) => {
  try {
    // Set the new values for the product image
    const updatedValues = req.body;

    // Perform the update operation
    const [updatedImage] = await dbInstance
      .update(productImage)
      .set(updatedValues)
      .where(eq(productImage.id, req.params.id))
      .returning();

    if (!updatedImage) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    res.json({ success: true, data: updatedImage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const deleted = await dbInstance
      .delete(productImage)
      .where(eq(productImage.id, req.params.id))
      .returning();

    if (!deleted.length) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// //get single prod with url
export const fetchProductByURLWithDetails = async (req, res) => {
  try {
    // single product
    const productData = await dbInstance
      .select()
      .from(product)
      .where(eq(product.product_url, req.params.url));

    if (!productData.length) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const productDetails = productData[0];

    // product images
    const productImages = await dbInstance
      .select()
      .from(productImage)
      .where(eq(productImage.product_id, productDetails.id));

    // accessories related to product
    const accessories = await dbInstance
      .select({
        ...accessory,
        product_id: accessoryProduct.product_id,
      })
      .from(accessory)
      .innerJoin(
        accessoryProduct,
        eq(accessoryProduct.accessory_id, accessory.id)
      )
      .where(eq(accessoryProduct.product_id, productDetails.id));

    let accessoriesWithImages = [];
    if (accessories.length > 0) {
      accessoriesWithImages = await Promise.all(
        accessories.map(async (acc) => {
          const accessoryImages = await dbInstance
            .select()
            .from(accessoryImage)
            .where(eq(accessoryImage.accessory_id, acc.id));

          return {
            ...acc,
            images: accessoryImages,
          };
        })
      );
    }
    const productWithDetails = {
      ...productDetails,
      images: productImages,
      accessories: accessoriesWithImages,
    };

    res.json({ success: true, data: productWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
