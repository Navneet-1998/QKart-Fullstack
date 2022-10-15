import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const formData = {
    username: "",
    password: "",
    confirmPassword: "",

  };
  const [registerData, getRegisterData] = useState(formData);
  const [isloading, setloading] = useState(false);
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
    

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    getRegisterData({ ...registerData, [name]: value });
  }

  
  const register = async () => {
    if(validateInput(data)){
      setloading(true)
      await axios.post(config.endpoint+"/auth/register", {username:registerData.username,password:registerData.password})
      .then(function (response) {
        setloading(false)
        if(response && response.status === 201){
        enqueueSnackbar("Registered Successfully",{variant: "success" })
        history.push("/login")
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

  const data = {
    username: registerData.username,
    password: registerData.password,
    confirmPassword: registerData.confirmPassword,
  };
  
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic


  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  
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
    }else if(data.confirmPassword !== data.password){
      enqueueSnackbar("Passwords do not match",{variant: "warning" })
      return false;
    }

    return true
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={registerData.username}
            onChange={(e) => handleInputChange(e)}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            value={registerData.password}
            onChange={(e) => handleInputChange(e)}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={(e) => handleInputChange(e)}
            type="password"
            fullWidth
          />
           <Button className="button" variant="contained" onClick={register}>

           {isloading ? <><CircularProgress size={20} /></> : <><span>REGISTER NOW</span></> }
           </Button>
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" >
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
