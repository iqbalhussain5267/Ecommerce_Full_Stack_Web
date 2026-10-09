import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import React from "react"; 

const FilterSideBar = ({ 
  allproducts, 
  priceRange, 
  setPriceRange, 
  search, 
  setsearch, 
  category, 
  setcategory, 
  brand, 
  setbrand, 
}) => { 
  const Categories = allproducts.map((p) => p.category); 
  const uniqueCategory = ["All", ...new Set(Categories)]; 

  const Brand = allproducts.map((p) => p.brand); 
  const uniqueBrand = ["All", ...new Set(Brand)]; 

  const handleCategoryClick = (val) => { 
    setcategory(val); 
  }; 

  const handleBrandChanges = (e) => { 
    setbrand(e.target.value); 
  }; 

  const handleMinChange = (e) => { 
    const value = Number(e.target.value); 
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]); 
  }; 

  const handleMaxChange = (e) => { 
    const value = Number(e.target.value); 
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value]); 
  }; 

  const resetFilter = () => { 
    setsearch(""); 
    setbrand("All"); 
    setPriceRange([0, 10000000]); 
    setcategory("All"); 
  }; 

  return ( 
    <div className="bg-gray-100 p-4 rounded-md h-max hidden md:block w-64"> 
      <Input 
        type="text" 
        placeholder="search... " 
        value={search || ""} 
        onChange={(e) => setsearch(e.target.value)} 
        className="bg-white p-2 rounded-md border-gray-400 border-2 w-full" 
      /> 

      <h1 className="mt-5 font-semibold text-xl">Category</h1> 
      <div> 
        {uniqueCategory.map((item, index) => ( 
          <div key={index} className="flex gap-3 items-center"> 
            <input 
              checked={category === item} 
              onChange={() => handleCategoryClick(item)} 
              type="radio" 
            /> 
            <label>{item}</label> 
          </div> 
        ))} 
      </div> 

      <h1 className="mt-5 font-semibold text-xl">Brands</h1> 
      <select 
        name="brand" 
        id="brand" 
        value={brand} 
        onChange={handleBrandChanges} 
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-md" 
      > 
        {uniqueBrand.map((item, index) => ( 
          <option key={index} value={item}> 
            {item} 
          </option> 
        ))} 
      </select> 

      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1> 
      <div className="flex flex-col gap-3"> 
        <label> 
          Price Range : pkr {priceRange[0]}-{priceRange[1]} 
        </label> 
        <div className="flex gap-2 items-center"> 
          <input 
            type="number" 
            min="0" 
            max="10000000" 
            value={priceRange[0]} 
            onChange={handleMinChange} 
            className="w-20 p-1 border border-gray-300 rounded" 
          /> 
          <span>-</span> 
          <input 
            type="number" 
            min="0" 
            max="10000000" 
            value={priceRange[1]} 
            onChange={handleMaxChange} 
            className="w-20 p-1 border border-gray-300 rounded" 
          /> 
        </div> 
        <div> 
          <input 
            type="range" 
            min="0" 
            max="10000000" 
            step="100" 
            value={priceRange[0]} 
            onChange={handleMinChange} 
            className="w-full" 
          /> 
          <input 
            type="range" 
            min="0" 
            max="10000000" 
            step="100" 
            value={priceRange[1]} 
            onChange={handleMaxChange} 
            className="w-full" 
          /> 
        </div> 
        <Button 
          onClick={resetFilter} 
          className="bg-pink-600 text-white mt-5 cursor-pointer w-full" 
        > 
          Reset Filter 
        </Button> 
      </div> 
    </div> 
  ); 
}; 

export default FilterSideBar;
