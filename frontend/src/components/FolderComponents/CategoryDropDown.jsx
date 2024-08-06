import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

const fetchCategories = async (type) => {
  const urlMap = {
    purchases: 'http://localhost:3000/api/companies/purchases/categories',
    sales: 'http://localhost:3000/api/companies/sales/categories',
    suppliers: 'http://localhost:3000/api/companies/suppliers/categories',
  };

  try {
    const response = await axios.get(urlMap[type]);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} categories:`, error);
    return [];
  }
};

const updateCategory = async (type, companyId, itemId, newCategory) => {
  const urlMap = {
    purchases: `http://localhost:3000/api/companies/${companyId}/purchases/${itemId}/categories/update`,
    sales: `http://localhost:3000/api/companies/${companyId}/sales/${itemId}/categories/update`,
    suppliers: `http://localhost:3000/api/companies/${companyId}/suppliers/${itemId}/categories/update`,
  };

  try {
    const response = await axios.patch(urlMap[type], { category: newCategory });
    return response.data;
  } catch (error) {
    console.error(`Error updating ${type} category:`, error);
  }
};

const CategoryDropdown = ({ type, selectedCategory, onCategoryChange, isSmall, companyId, itemId }) => {
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState(selectedCategory);

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories(type);
      setCategories(fetchedCategories);
    };

    loadCategories();
  }, [type]);

  const handleCategoryChange = async (newCategory) => {
    onCategoryChange(newCategory);
    if (newCategory && !categories.includes(newCategory)) {
      await updateCategory(type, companyId, itemId, newCategory);
      setCategories((prevCategories) => [...prevCategories, newCategory]);
    } else if (newCategory) {
      await updateCategory(type, companyId, itemId, newCategory);
    }
  };

  return (
    <Autocomplete
      value={selectedCategory}
      onChange={(event, newValue) => {
        handleCategoryChange(newValue);
        setInputValue(newValue);
      }}
      options={categories}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={selectedCategory || ''}
          size={isSmall ? 'small' : 'medium'}
        />
      )}
      freeSolo
    />
  );
};

export default CategoryDropdown;