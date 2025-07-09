import { Request, Response } from "express";
import { validator } from "../utils/validator";
import { categorySchema } from "../utils/schema/category.schema";
import { db } from "../libs/db";


export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request using Zod or Yup schema
    console.log("Called create category")
    const validation = validator(categorySchema, req.body);
    if (!validation.success) {
      res.status(400).json({
        message: "Please enter required fields correctly",
        errors: validation.error,
        success: false,
      });
    }

    const { name, description, slug, children, parent_id } = req.body;

    // Check for existing category with same name
    const existingCategory = await db.category.findFirst({
      where: { name },
    });

    if (existingCategory) {
      res.status(409).json({
        message: "Category already exists",
        success: false,
      });
    }

    const category = await db.category.create({
      data: {
        name,
        description,
        slug,
        parent_id: parent_id || null, // Ensure parent_id is null if not present
        children: children || [],
        is_active: true,
      },
    });

    res.status(201).json({
      category,
      message: "Category created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error while creating category:", error);
    res.status(500).json({
      message: "Internal server error while creating category",
      success: false,
      error,
    });
  }
};

export const fetchCategoryPosts=async (req:Request,res:Response):Promise<void>=>{
try {
  if(!req.params.categoryId)
     res.status(401).json({
    message:"Required :Category selection",success:false})
  const categoriesPosts = await db.category.findUnique({
    where:{
    id:req.params.categoryId as unknown as number
    },
    include:{
      posts:true
    }
  })

  console.log(`categories Post  :${categoriesPosts}`);
  res.status(201).json({
    message:"Post fetched",
    posts:categoriesPosts,
    success:true
  })
} catch (error) {
  
}
}

export const fetchCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await db.category.findMany({
      include: {
        posts:true, 
      },
    });

    res.status(200).json({
      categories,
      message: "Categories fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error while fetching category:", error);
    res.status(500).json({
      message: "Error while fetching categories",
      success: false,
      error,
    });
  }
};
