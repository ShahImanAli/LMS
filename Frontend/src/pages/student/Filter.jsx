import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "web-development", label: "Web Development" },
  { id: "data-science", label: "Data Science" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "business", label: "Business" },
  { id: "nextjs", label: "Next JS" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "react", label: "React" },
  { id: "nodejs", label: "Node.js" },
  { id: "mongodb", label: "MongoDB" },
  { id: "docker", label: "Docker" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

      handleFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  };
  return (
    <div className="w-full md:w-[25%]">
      <div className="flex items-center justify-between ">
        <h1 className="font-semibold text-lg md:text-lg text-gray-900 dark:text-gray-100">
          Filter Options
        </h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            <SelectGroup>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <div>
        <h1 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          CATEGORY
        </h1>
        {categories.map((category) => (
          <div className="flex items-center space-x-2 my-2" key={category.id}>
            <Checkbox
              id={category.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
