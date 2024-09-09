import {
  CategoryFormatted,
  CategoryRaw,
} from "@/app/interface/CategoryInterface";

export const formatCategories = (categories: CategoryRaw[]) => {
  const formattedCategories: CategoryFormatted[] = [];
  categories.forEach((category) => {
    formattedCategories.push({
      value: category.id,
      label: category.name,
    });
  });
  return formattedCategories;
};
