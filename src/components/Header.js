import { ContentPasteSearchOutlined } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const check = (value) => {
    if(value === "logout"){
      history.push("/")
      window.localStorage.clear();
      window.location.reload()
    }
    history.push(`/${value}`)
  }
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

      { hasHiddenAuthButtons ? <><Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
        >
          Back to explore
        </Button></> : <Stack direction="row" spacing={2}>
          {
          children ? <><Button
          className="button"
          variant="text"
          onClick={() => check("login")}
        >
        LOGIN
        </Button>
        <Button
          className="button"
          variant="contained"
          onClick={() => check("register")}
        >
         REGISTER
        </Button></> : <>
       <Avatar src="avatar.png" alt={window.localStorage.username || "Profile"}/><span style={{width:"40px", position:"relative",top:"8px"}}>{window.localStorage.username}</span>
        <Button
          className="button"
          variant="text"
          onClick={() => check("logout")}
        >
         LOGOUT
        </Button></>}
        </Stack> }
      </Box>
    );
};

export default Header;


{/* <Avatar src="avatar.png" alt="User avatar"/><span style={{width:"50px"}}>{children.buttonOne}</span> */}