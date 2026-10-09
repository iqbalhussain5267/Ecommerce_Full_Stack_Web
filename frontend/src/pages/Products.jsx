import React, { useEffect, useState } from 'react'
import FilterSideBar from './FilterSideBar'
import ProductsCard from './ProductsCard'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from 'react-redux'
import { setproducts } from '@/redux/productSlice'
import { SearchCode } from 'lucide-react'


// const items = [
//   { label: "sort by price", value: null },
//   { label: "Apple", value: "apple" },
//   { label: "Banana", value: "banana" },
//   { label: "Blueberry", value: "blueberry" },
//   { label: "Grapes", value: "grapes" },
//   { label: "Pineapple", value: "pineapple" },
// ]

const Products = () => {
  const {products}=useSelector(store => store.product)
const[allproducts,setallproducts]=useState([])
const [loading ,setloading]=useState(false);
const [priceRange ,setPriceRange]=useState([0,10000000]);
const dispatch=useDispatch()
const [search ,setsearch]=useState("")
const [category,setcategory]=useState("All")
const [brand,setbrand]=useState("All")
const [sortorder,setsortorder]=useState('')




  const getAllProucts=async()=>{
    try{
      setloading(true)
const res =await axios.get("http://localhost:3005/api/v1/products/getallproducts");
if(res.data.success){
setallproducts(res.data.products)
dispatch(setproducts(res.data.products))

}
    }catch(error){
      console.log(error)
      toast.err(error.res.data.message)
    }finally{
      setloading(false);
    }
  }
  useEffect(()=>{
    getAllProucts()
    },[])
    // console.log(allproducts)

//     useEffect(() => {
//   if (allproducts.length === 0) return;
//   let filter = [...allproducts]

//   if (search && search.trim() !== "") {
//     filter = filter.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase())) // Fixed 'Search' typo to 'search'
//   }
  
//   if (category !== "All") {
//     filter = filter.filter(p => p.category === category) // Fixed '-' to '='
//   }
  
//   if (brand !== "All") {
//     filter = filter.filter(p => p.brand === brand) // Fixed '-' to '='
//   }
  
  
//   filter = filter.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

//   if (sortorder === "lowprice") { // Matches your select item value
//     filter.sort((a, b) => a.productPrice - b.productPrice)
//   } else if (sortorder === "highprice") { // Matches your select item value
//     filter.sort((a, b) => b.productPrice - a.productPrice) // Fixed '.filter' to '.sort'
//   }
// console.log("Filter length:", filter.length);
// console.log("Filtered products:", filter);

//   dispatch(setproducts(filter))
  


 
//     // console.log("Filtered products:", filter) // Added for debugging
// }, [search, brand, category, sortorder, allproducts, priceRange, dispatch])


useEffect(() => {
  

  if (allproducts.length === 0) return;

  let filter = [...allproducts];
  

  if (search && search.trim() !== "") {
    filter = filter.filter((p) =>
      p.productName?.toLowerCase().includes(search.toLowerCase())
    );

  }

  if (category !== "All") {
    filter = filter.filter((p) => p.category === category);
   
  }

  if (brand !== "All") {
    filter = filter.filter((p) => p.brand === brand);
    
  }

  filter = filter.filter(
    (p) =>
      p.productPrice >= priceRange[0] &&
      p.productPrice <= priceRange[1]
  );
if(sortorder==="LowToHigh"){
  filter.sort((a,b)=>a.productPrice-b.productPrice)
}else if(sortorder=="HighToLow"){
  filter.sort((a,b)=>b.productPrice - a.productPrice)
}
  
  dispatch(setproducts(filter));
}, [search, brand, category, sortorder, allproducts, priceRange]);
  return (
    <div className='pt-20 pb-10'>
      <div className="max-w-7xl mx-auto  flex gap-7">

        <FilterSideBar allproducts={allproducts} 
      
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        search={search}
        setsearch={setsearch}
        category={category}
        setcategory={setcategory}
        brand={brand}
        setbrand={setbrand}
        ></FilterSideBar>
        {/* main products section */}

        <div className='flex flex-col flex-1'>
          <div className="flex justify-end mb-4">
{/* <p>this is wiil be the select section for low to high</p> */}
<Select onValueChange={(value)=>setsortorder(value)}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="sort by price" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {/* {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))} */}
      <SelectItem value="LowToHigh">price low to high</SelectItem>
      <SelectItem value="HighToLow">price high to low</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

          </div>

{/* show products card */}

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">

{
  products.map((product)=>{
    return <ProductsCard key={product._id} product={product} loading={loading}/>
  })
}

</div>
        </div>
      </div>
      
    </div>
  )
}

export default Products
