import { Login, Search, SentimentDissatisfied } from "@mui/icons-material";
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
import "./Products.css";



const Products = () => {
const [login,updateLogin] = useState(true);

useEffect(() => {
  if(window.localStorage.username){
    updateLogin(false)
  }
})

// const check = () => {
//     window.localStorage.clear();
//     window.location.reload()
// }

  return (
    <div>
      <Header children={login}>
      </Header>

       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               Indias <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>
      <Footer />
    </div>
  );
};

export default Products;
