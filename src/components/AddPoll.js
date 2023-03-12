
import React, { useState, useEffect } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from "@mui/material/Container";

export const AddPoll = (props) => {
    const matches = useMediaQuery("(min-width:600px)");
    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }, []);
  
    return (
      <div>
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
          }}
        >
          Add Poll
        </Container>
      </div>
    );
  };
  
export default AddPoll