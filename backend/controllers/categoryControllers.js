import Category from "../models/categoryModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

export { getCategories };
