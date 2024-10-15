import { useState } from "react";

export const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const resp = await fetch("/api/categoriesAPI", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await resp.json();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return { categories, fetchCategories };
};
