import { Request, Response } from "express";
import { validator } from "../utils/validator";
import { categorySchema } from "../utils/schema/category.schema";
import { db } from "../libs/db";
import { error } from "console";

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const validation = validator(categorySchema, req.body);
  if(!validation){
     res.status(401).json({
        message: "Please Enter Required fields",
        
      });
  }
  const { name, description, slug, children, parent_id, is_active } = req.body;

  if (!(name && description && slug ))
    res.status(401).json({
      message: "Please Enter Required fields",
   
    });

  try {
    const existingCategory = await db.category.findFirst({
      where: { name: name },
    });

    if (existingCategory)
       res.status(401).json({
        message: "Category already Exist",
      });

    const category = await db.category.create({
      data: {
        name: name,
        description: description,
        slug: slug,
        parent_id: parent_id,
        children: children,
        is_active: true,
      },
    });

     res.status(201).json({
      category: category,
      message: "Category created Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error while creating category :", error);
     res.status(500).json({
      message: "Error while creating category",
      error: error,
    });
  }
};

export const fetchCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await db.category.findMany();

    if (!categories)
       res.status(401).json({
        message: "No Categories Found",
      });
     res.status(201).json({
      categories: categories,
      message: "Categoires fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error while fetching category :", error);
     res.status(500).json({
      message: "Error while fetching category",
      error: error,
    });
  }
};
