import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "@mui/material/Container";

import Paper from "@mui/material/Paper";

import PollForm from "./PollForm";
import Review from "./Review";
import PollLinks from "./PollLinks";

import { resetPoll } from "./NewPollStore";

export const Create = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const matches = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const resetForm = () => {
    resetPoll();
    setActiveStep(0);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

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
        <Container maxWidth="lg" sx={{ marginBottom: 10 }}>
          <Paper variant="elevated" elevated={0}>
            <React.Fragment>
              {activeStep === 0 && (
                <PollForm resetForm={resetForm} handleNext={handleNext} />
              )}
              {activeStep === 1 && (
                <Review
                  resetForm={resetForm}
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
              )}
              {activeStep === 2 && <PollLinks resetForm={resetForm} />}
            </React.Fragment>
          </Paper>
        </Container>
      </Container>
    </div>
  );
};

export default Create;
