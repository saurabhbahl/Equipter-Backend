import { dbInstance } from "../config/dbConnection.cjs";
import {
  accessory,
  accessoryImage,
  accessoryProduct,
} from "../models/tables.js";
import { and, eq, ne } from "drizzle-orm";

// Accessories
// Create a new accessory
export const createNewAccessory = async (req, res) => {
  try {
    const newAccessory = await dbInstance
      .insert(accessory)
      .values(req.body)
      .returning();

    res.status(201).json({ success: true, data: newAccessory[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an accessory
export const updateAccessoryDetails = async (req, res) => {
  try {
    const updatedAccessory = await dbInstance
      .update(accessory)
      .set(req.body)
      .where(eq(accessory.id, req.params.id))
      .returning();

    if (!updatedAccessory.length) {
      return res
        .status(404)
        .json({ success: false, message: "Accessory not found" });
    }

    res.json({ success: true, data: updatedAccessory[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an accessory
export const removeAccessory = async (req, res) => {
  try {
    const deleted = await dbInstance
      .delete(accessory)
      .where(eq(accessory.id, req.params.id))
      .returning();

    if (!deleted.length) {
      return res
        .status(404)
        .json({ success: false, message: "Accessory not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch all accessories with images
export const fetchAllAccessoriesWithImages = async (req, res) => {
  try {
    const accessories = await dbInstance.select().from(accessory);
    const accessoryImages = await dbInstance.select().from(accessoryImage);

    const accessoriesWithImages = accessories.map((acc) => ({
      ...acc,
      images: accessoryImages.filter((img) => img.accessory_id === acc.id),
    }));

    res.json({ success: true, data: accessoriesWithImages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch accessory by ID with images
export const fetchAccessoryByIdWithImages = async (req, res) => {
  try {
    const accessoryData = await dbInstance
      .select()
      .from(accessory)
      .where(eq(accessory.id, req.params.id));

    if (!accessoryData.length) {
      return res
        .status(404)
        .json({ success: false, message: "Accessory not found" });
    }

    const images = await dbInstance
      .select()
      .from(accessoryImage)
      .where(eq(accessoryImage.accessory_id, req.params.id));

    const accessoryWithImages = {
      ...accessoryData[0],
      images,
    };

    res.json({ success: true, data: accessoryWithImages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// accessory product apis

export const getAllAccessoryProducts = async (req, res) => {
  try {
    const relationships = await dbInstance.select().from(accessoryProduct);
    res.json({ success: true, data: relationships });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const createAccessoryProduct = async (req, res) => {
  try {
    const newRelationship = await dbInstance
      .insert(accessoryProduct)
      .values(req.body)
      .returning();

    res.status(201).json({ success: true, data: newRelationship[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeAccessoryProduct = async (req, res) => {
  try {
    const { aId, pId } = req.query;
    console.log(aId);
    const deleted = await dbInstance
      .delete(accessoryProduct)
      .where(eq(accessoryProduct.accessory_id, aId))
      // .where(and(eq(accessoryProduct.product_id, pId),eq(accessoryProduct.accessory_id,aId)))
      .returning();
    console.log(deleted);
    if (!deleted.length) {
      return res
        .status(404)
        .json({ success: false, message: "Relationship not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// accessory images apis

export const getAllAccessoryImages = async (req, res) => {
  try {
    const images = await dbInstance.select().from(accessoryImage);
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addAccessoryImage = async (req, res) => {
  try {
    const newImage = await dbInstance
      .insert(accessoryImage)
      .values(req.body)
      .returning();

    res.status(201).json({ success: true, data: newImage[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAccessoryImageById = async (req, res) => {
  try {
    const image = await dbInstance
      .select()
      .from(accessoryImage)
      .where(eq(accessoryImage.id, req.params.id));

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

export const deleteAccessoryImage = async (req, res) => {
  try {
    const deleted = await dbInstance
      .delete(accessoryImage)
      .where(eq(accessoryImage.id, req.params.id))
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

// slug




export const isSlugUnique = async (req, res) => {
  try {
    const { id, slug } = req.query;
 
    console.log(req.query)

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
    if (id && slug) {
      console.log("first")
      // Validate ID format if it's expected to be a UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid ID format" });
      }

      // While editing, ensure slug is unique except for the current accessory
      const accessories = await dbInstance
        .select()
        .from(accessory)
        .where(and(eq(accessory.accessory_url, slug), ne(accessory.id, id)));

      const isUnique = accessories.length === 0;
      return res.json({
        isUnique, // Added 'isUnique' field
        message: isUnique
          ? "The URL is Unique"
          : "This URL is already in use. Please modify the Meta Title.",
      });
    } else {
      // While creating, ensure slug is unique
      const accessories = await dbInstance
        .select()
        .from(accessory)
        .where(eq(accessory.accessory_url, slug));
        console.log(accessories)

      const isUnique = accessories.length === 0;
      return res.json({
        isUnique, // Added 'isUnique' field
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






export const ensureFeaturedImage = async (req, res) => {
  try {
    const accessoryId = req.params.id;
    const { featuredImageId } = req.body;

    if (!featuredImageId) {
      return res.status(400).json({ success: false, message: "featuredImageId is required." });
    }

    // Start a transaction to ensure atomicity
    await dbInstance.transaction(async (tx) => {
      // Set all images' is_featured to false
      await tx.update(accessoryImage)
        .set({ is_featured: false })
        .where(eq(accessoryImage.accessory_id, accessoryId));

      // Set the selected image's is_featured to true
      const updatedImage = await tx.update(accessoryImage)
        .set({ is_featured: true })
        .where(and(eq(accessoryImage.id, featuredImageId), eq(accessoryImage.accessory_id, accessoryId)))
        .returning();

      if (!updatedImage.length) {
        throw new Error("Featured image not found for this accessory.");
      }
    });

    res.json({ success: true, message: "Featured image set successfully." });
  } catch (error) {
    console.error("Error in ensureFeaturedImage:", error.message);
    res.status(500).json({ success: false, error: "An unexpected error occurred." });
  }
};
