import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { resetPoll } from "./NewPollStore";

import PollForm from "./PollForm";
import PollSettings from "./PollSettings";
import PollLinks from "./PollLinks";

export default function Create() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleGotoLinks = () => {
    setActiveStep(2);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    resetPoll();
    setActiveStep(0);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        marginTop: "50px",
        maxWidth:1000,
        paddingLeft:5, 
        paddingRight:5,
        marginBottom: 20
      }}
    >
        <Paper variant="elevated" elevated={0}>
          <Stepper activeStep={activeStep}>
            <Step key={1}>
              <StepLabel>Add poll name and candidates</StepLabel>
            </Step>
            <Step key={2}>
              <StepLabel optional = {<Typography variant="caption">Optional</Typography>}>Change poll settings</StepLabel>
            </Step>
            <Step key={3}>
              <StepLabel>Share poll links</StepLabel>
            </Step>
          </Stepper>
          {activeStep === 0 && (
            <PollForm
              handleReset={handleReset}
              handleNext={handleNext}
              handleGotoLinks={handleGotoLinks}
            />
          )}
          {activeStep === 1 && (
            <PollSettings
              handleReset={handleReset}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          )}
          {activeStep === 2 && <PollLinks handleReset={handleReset} />}
        </Paper>
     </Container>
  );
}
