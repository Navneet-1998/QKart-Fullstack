import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";

import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import Cart, {generateCartItemsFrom} from "./Cart";
import "./Products.css";
import ProductCard from "./ProductCard";



const Products = () => {
  
const [productsData, updateProdeuctsData] = useState([]);
const [login,updateLogin] = useState(true);
const [items,updateItems] = useState([]);
const [filtered,updateFiltered] = useState([]);
const [debounce,setDebounce] = useState(0);
const [isloading, setloading] = useState(false);
const { enqueueSnackbar } = useSnackbar();
const token = localStorage.getItem("token")
useEffect(() => {
  if(window.localStorage.username){
    updateLogin(false)
  }
},[login])
// const check = () => ˆß


//     window.localStorage.clear();
//     window.location.reload()
// }

async function addToCart(token,items,products,productId,qty,option = {preventDuplicate:false}){
  
  
  if(!token){
    // enqueueSnackbar("Please login to add to cart", {variant:"warning"})
    enqueueSnackbar(
      "Please login to add to cart",
      {
        variant: 'warning',
      }
    )
    return ;
  }

  
  if(option.preventDuplicate && items.find(item => item.productId === productId)){
    enqueueSnackbar(
      'Item already in cart. Use the cart sidebar to update quantity or remove item.',
      {
        variant: 'warning',
      }
    )
    return;
  }

  try{
    const res = await axios.post(`${config.endpoint}/cart`, { productId, qty }, {
      headers: {
        Authorization : `Bearer ${token}`
      }
    }
    )
    updateCart(res.data, products);
  } catch(error){
    enqueueSnackbar("Error adding to cart", {variant:"error"})
  }
  return true;
}


// Definition of Data Structures used
/**
//  * @typedef {Object} Product - Data on product available to buy
//  * 
//  * @property {string} name - The name or title of the product
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
 */



  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
  //  * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setloading(true)

    try {
      const response = await axios.get(`${config.endpoint}/products` )

      setloading(false)
      updateProdeuctsData(response.data)
        updateFiltered(response.data)
        return response.data;
    } catch (e) {
      setloading(false)

      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: 'error' })
        return null
      } else {
        enqueueSnackbar(
          'Could not fetch products. Check that the backend is running, reachable and returns valid JSON.',
          {
            variant: 'error',
          },
        )
      }
    }
  };




  const fetchCart = async(token) => {
    if (!token) return

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      // CRIO_SOLUTION_START_MODULE_CART
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
      // CRIO_SOLUTION_END_MODULE_CART
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: 'error' })
      } else {
        enqueueSnackbar(
          'Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.',
          {
            variant: 'error',
          },
        )
      }
      return null
  }
  }

  useEffect(() => {
    const onLoadHandler = async () => {
      const prd = await performAPICall();
      const cartData = await fetchCart(token);
      const cartDetails = await generateCartItemsFrom(cartData, prd)
      updateItems(cartDetails)
    }
    onLoadHandler();
  },[])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    if(text){
    setloading(true)
    await axios.get(config.endpoint+"/products/search?value="+text)
    .then(function (response){
      setloading(false)
      updateFiltered(response.data)
      return response.data;
    })
    .catch(function(error){
      if(error.response && error.response.status === 404){
        setloading(false)
        updateFiltered([])
      }
      else if(error.response && error.response.status === 500){
      setloading(false)
        enqueueSnackbar(error.repsonse.data.message, { variant: "error" })
        return null;
      }else{
        setloading(false)
        enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable and return the valid JSON", { variant: "error" })
      }
    })
  } else {
    performAPICall()
  }
  };

const updateCart = (cartData,products) => {
  const cartItems = generateCartItemsFrom(cartData, products)
  updateItems(cartItems)
}

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const searchItem = event.target.value;
    if(debounceTimeout){
      clearTimeout(debounceTimeout)
    }

    const timer = setTimeout(() => performSearch(searchItem), 500);
     
    setDebounce(timer)
  };


  if(!login){
    return(
      <div>
      <Header login={login}>
        <TextField className="search-desktop"
        size="small" 
        InputProps={{ 
          className:"search",
           endAdornment:(
              <InputAdornment position="end">
                <Search color="primary" />
                </InputAdornment>
                ),
                }}
                placeholder="Search for items/categories"
                name="search"
                onChange={(e) => debounceSearch(e,debounce)}
                /> 
      </Header>
      <TextField fullWidth className="search-mobile"
        size="small" 
        InputProps={{ 
           endAdornment:(
              <InputAdornment position="end">
                <Search color="primary" />
                </InputAdornment>
                ),
                }}
                placeholder="Search for items/categories"
                name="search"
                onChange={(e) => debounceSearch(e,debounce)}
                /> 
<Grid sx={{ flexGrow: 1 }} container > 
      <Grid item xs={12} sm={9}>
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
           {isloading ? 
           <Box className="loading">
            <Box><CircularProgress /></Box>
            <Box><p>Loading Products...</p></Box>
            </Box> : (
              <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
                {filtered.length ? (filtered.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                    product={product}

                    handleAddToCart={async () => {
                      await addToCart(
                        token,
                        items,
                        productsData,
                        product._id,
                        1,
                        {
                          preventDuplicate: true
                        }
                      );
                    }}
                    />
                  </Grid>
                ))) : (<><Box className="loading">
                  <Box><SentimentDissatisfied /></Box>
                <Box><p>No products found</p></Box>
                </Box></>)}
              </Grid>
            )}
        </Grid>
       </Grid>
       {token ? (
        <Grid item  style={{ width: "900px",backgroundColor:"#E9F5E1"}} xs={12} sm={3}>
        <Cart 
              products={productsData}
              items={items}
              handleQuantity={addToCart}
              hasCheckoutButton="true"
              />
       </Grid> ) : null}
       </Grid>

      <Footer />
    </div>
    )
  }





  return (
    <div>
      <Header login={login}>
        <TextField className="search-desktop"
        size="small" 
        InputProps={{ 
          className:"search",
           endAdornment:(
              <InputAdornment position="end">
                <Search color="primary" />
                </InputAdornment>
                ),
                }}
                placeholder="Search for items/categories"
                name="search"
                onChange={(e) => debounceSearch(e,debounce)}
                /> 
      </Header>

      <TextField fullWidth className="search-mobile"
        size="small" 
        InputProps={{ 
           endAdornment:(
              <InputAdornment position="end">
                <Search color="primary" />
                </InputAdornment>
                ),
                }}
                placeholder="Search for items/categories"
                name="search"
                onChange={(e) => debounceSearch(e,debounce)}
                /> 
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
           {isloading ? 
           <Box className="loading">
            <Box><CircularProgress /></Box>
            <Box><p>Loading Products...</p></Box>
            </Box> : (
              <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
                {filtered.length ? (filtered.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                    product={product}
                    />
                  </Grid>
                ))) : (<><Box className="loading">
                  <Box><SentimentDissatisfied /></Box>
                <Box><p>No products found</p></Box>
                </Box></>)}
              </Grid>

            )
          }
       </Grid>
      <Footer />
    </div>
  );
};

export default Products;
