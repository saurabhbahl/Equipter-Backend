import { eq } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import {
  product,
  accessoryProduct,
  accessory,
  productImage,
} from "../models/tables.js";

export const getAllProducts = async () =>
  await dbInstance.select().from(product);

export const getProductById = async (id) =>
  await dbInstance.select().from(product).where(eq(product.id, id));





export const deleteProduct = async (id) =>
  await dbInstance.delete(product).where(eq(product.id, id));

export const getAllProductsWithDetails = async () => {
  // Fetch all products
  const products = await dbInstance.select().from(product);

  // Fetch related images for all products
  const productImages = await dbInstance.select().from(productImage);

  // Fetch related accessories for all products
  const accessories = await dbInstance
    .select({
      ...accessory, // Select all fields from `accessory`
      product_id: accessoryProduct.product_id, // Include product_id from accessoryProduct
    })
    .from(accessory)
    .innerJoin(
      accessoryProduct,
      eq(accessoryProduct.accessory_id, accessory.id)
    );

  const productsWithDetails = products.map((prod) => ({
    ...prod, // Include all product fields
    images: productImages.filter((img) => img.product_id === prod.id), // Include related images
    accessories: accessories.filter((acc) => acc.product_id === prod.id), // Include related accessories
  }));

  return productsWithDetails;
};

export const getProductByIdWithDetails = async (productId) => {
  // Fetch the product by ID
  console.log(productId);
  const productData = await dbInstance
    .select()
    .from(product)
    .where(eq(product.id, productId));

  if (!productData.length) {
    throw new Error(`Product with id ${productId} not found.`);
  }
  console.log(productData);

  const productDetails = productData[0];

  // Fetch related images for the product
  const productImages = await dbInstance
    .select()
    .from(productImage)
    .where(eq(productImage.product_id, productId));

  // Fetch related accessories for the product
  const accessories = await dbInstance
    .select({
      ...accessory, // Select all fields from `accessory`
      product_id: accessoryProduct.product_id, // Include product_id from accessoryProduct
    })
    .from(accessory)
    .innerJoin(
      accessoryProduct,
      eq(accessoryProduct.accessory_id, accessory.id)
    )
    .where(eq(accessoryProduct.product_id, productId));

  // Combine product details with related data
  const productWithDetails = {
    ...productDetails, // Include all product fields
    images: productImages, // Include related images
    accessories: accessories, // Include related accessories
  };

  return productWithDetails;
};

// export const getAllProductsWithDetails = async () => {
//   const products = await dbInstance
//     .select({
//       product_id: product.id,
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       stock_quantity: product.stock_quantity,
//       created_at: product.created_at,
//       updated_at: product.updated_at,
//       images: dbInstance
//         .select({
//           id: productImage.id,
//           url: productImage.image_url,
//           description: productImage.image_description,
//           is_featured: productImage.is_featured,
//         })
//         .from(productImage)
//         .where(eq(productImage.product_id.product.id))
//         .as("images"),
//       accessories: dbInstance
//         .select({
//           id: accessory.id,
//           name: accessory.name,
//           description: accessory.description,
//           price: accessory.price,
//         })
//         .from(accessory)
//         .innerJoin(accessoryProduct, eq(accessoryProduct.accessory_id.accessory.id))
//         .where(eq(accessoryProduct.product_id.product.id))
//         .as("accessories"),
//     })
//     .from(product);

//   return products;
// };

// export const getAllProductsWithDetails = async () => {
//   const products = await dbInstance
//     .select({
//       images: dbInstance
//         .select({
//           id: productImage.id,
//           url: productImage.image_url,
//           description: productImage.image_description,
//           is_featured: productImage.is_featured,
//         })
//         .from(productImage)
//         .where(eq(productImage.product_id, product.id))
//         .as("images"),
//       accessories: dbInstance
//         .select()
//         .from(accessory)
//         .innerJoin(accessoryProduct, eq(accessoryProduct.accessory_id, accessory.id))
//         .where(eq(accessoryProduct.product_id, product.id))
//         .as("accessories"),
//     })
//     .from(product);

//   return products;
// };

// export const getAllProductsWithDetails = async () => {
//     // Fetch all products
//     const products = await dbInstance
//       .select()
//       .from(product);

//     // Fetch related images for all products
//     const productImages = await dbInstance
//       .select()
//       .from(productImage);

//     // Fetch related accessories for all products
//     const accessories = await dbInstance
//       .select({
//         product_id: accessoryProduct.product_id,
//         accessory_id: accessory.id,
//         name: accessory.name,
//         description: accessory.description,
//         price: accessory.price,
//       })
//       .from(accessory)
//       .innerJoin(accessoryProduct, eq(accessoryProduct.accessory_id, accessory.id));

//     //  related data to products
//     const productsWithDetails = products.map((prod) => ({
//       ...prod,
//       images: productImages.filter((img) => img.product_id === prod.id),
//       accessories: accessories
//         .filter((acc) => acc.product_id === prod.id)
//         .map(({ accessory_id, name, description, price }) => ({
//           id: accessory_id,
//           name,
//           description,
//           price,
//         })),
//     }));

//     return productsWithDetails;
//   };
