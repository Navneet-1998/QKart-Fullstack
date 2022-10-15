import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";



const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();


  const formData = {
    username : "",
    password : ""
  }

  const [loginData, getLoginData] = useState(formData);
  const [isloading, setloading] = useState(false);


  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    getLoginData({ ...loginData, [name]: value });
  }
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
  //   if(validateInput(data)){
  //     setloading(true)
  //   try{
  //     let res = await axios.post(config.endpoint+"/auth/login", {username:loginData.username,password:loginData.password})
  //     setloading(false)
  //     if(res.response && res.response.status === 201){
  //       setloading(false)
  //       enqueueSnackbar("Logged in successfully",{variant: "success" })
  //       console.log(res.response)
  //     }
  //   }
  //   catch (e) {
  //     setloading(false)
  //       if(e.response && e.response.status === 400 ){
  //         enqueueSnackbar(e.response.data.message,{variant: "error" })
  //         console.log(e.response)
  //       }else{
  //         console.log(e.response)
  //         enqueueSnackbar("Something went wrong, Check that the backend is running, reachable and return valid JSON.",{ variant: "error" })
  //       }
  //   }
  // }

  if(validateInput(data)){
    setloading(true)
    await axios.post(config.endpoint+"/auth/login", {username:loginData.username,password:loginData.password})
    .then(function (response) {
      setloading(false)
      if(response && response.status === 201){
      enqueueSnackbar("Logged In Successfully",{variant: "success" })
      persistLogin(response.data.token,response.data.username,response.data.balance)
      history.push("/");
      } 
    })
    .catch(function (error) {
      setloading(false)
      if(error.response && error.response.status === 400 ){
        enqueueSnackbar(error.response.data.message,{variant: "error" })
      }else{
        enqueueSnackbar("Something went wrong, Check that the backend is running, reachable and return valid JSON.",{ variant: "error" })
      }
    });
  }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */


   const data = {
    username : loginData.username,
    password : loginData.password
  }

  const validateInput = (data) => {
    if(data.username === ""){
      enqueueSnackbar("Username is a required field",{variant: "warning" })
      return false;
    }else if(data.username.length < 6){
      enqueueSnackbar("Username must be at least 6 characters",{variant: "warning" })
      return false;
    }else if(data.password === ""){
      enqueueSnackbar("Password is a required field",{variant: "warning" })
      return false;
    }else if(data.password.length < 6){
      enqueueSnackbar("Password must be at least 6 characters",{variant: "warning" })
      return false;
    }
    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('balance', balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Link to="/" >
      <Header hasHiddenAuthButtons />
      </Link>
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={loginData.username}
            onChange={(e) => handleInputChange(e)}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={loginData.password}
            onChange={(e) => handleInputChange(e)}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <Button className="button" variant="contained" onClick={login}>
{isloading ? <><CircularProgress size={20} /></> : <><span>LOGIN TO QKART</span></> }
</Button>
<p className="secondary-action">
 Don't have an account?{" "}
 <Link to="/register"  >
            Register now
            </Link>
</p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;

