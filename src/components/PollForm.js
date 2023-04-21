import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import { useForm, Controller } from "react-hook-form";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Fade from "@mui/material/Fade";

import { useNewPollState } from "./NewPollStore";

export const PollForm = ({ handleReset, handleNext, handleGotoLinks }) => {
  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    watch,
    formState: {
      errors,
    },
  } = useForm();

  const newPollState = useNewPollState();
  const onSubmit = (data) => {
    let cands = [];
    for (const key in data) {
      if (key.startsWith("C") && data[key] !== "") {
        if (!cands.includes(data[key].trim())) {
          cands.push(data[key].trim());
        }
      }
    }
    newPollState.merge({
         title: data["title"],
         candidates: cands
        });
    console.log(newPollState.candidates.get())
    handleNext();
  };
  var initNumExtraCands =
  newPollState.candidates.get() !== undefined
      ? newPollState.candidates.get().length - 2
      : 0;

  initNumExtraCands = initNumExtraCands < 0 ? 0 : initNumExtraCands;

  const watchExtraNumCands = watch("watchExtraNumCands");
  function extraNumCandidates() {
    return [...Array(parseInt(watchExtraNumCands || initNumExtraCands)).keys()];
  }

  return (
    <Box component="div" variant={"body1"} sx={{ p: 2, marginTop: 7 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              defaultValue={newPollState.title.get()}
              label="Poll Name"
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id="poll-name"
                  fullWidth
                  error={errors.title ? true : false}
                  helperText={
                    errors.title ? "Please enter a title for the poll." : ""
                  }
                  label="Poll Name"
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="C1"
              control={control}
              defaultValue={
                newPollState.candidates.get().length > 0
                  ? newPollState.candidates.get()[0]
                  : ""
              }
              rules={{
                required: true,
                validate: (value) => value.trim() !== getValues("C2").trim(),
              }}
              render={({ field }) => (
                <TextField
                  id="c1"
                  fullWidth
                  label={`Candidate 1`}
                  error={errors.C1 || errors.candError ? true : false}
                  helperText={
                    errors.C1 ? "Please enter at least two candidates." : ""
                  }
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="C2"
              control={control}
              defaultValue={
                newPollState.candidates.get().length > 1
                  ? newPollState.candidates.get()[1]
                  : ""
              }
              rules={{
                required: true,
                validate: (value) => value.trim() !== getValues("C1").trim(),
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="c2"
                  label={`Candidate 2`}
                  error={errors.C2 || errors.candError ? true : false}
                  helperText={
                    errors.C2 ? "Please enter at least two candidates." : ""
                  }
                  {...field}
                />
              )}
            />
          </Grid>

          {extraNumCandidates().map((cnum) => {
            return (
              <Fade in={true} key={cnum}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name={`C${3 + cnum}`}
                    control={control}
                    defaultValue={
                      newPollState.candidates.get()[2 + cnum] !== undefined
                        ? newPollState.candidates.get()[2 + cnum]
                        : ""
                    }
                    rules={{ required: false }}
                    render={({ field }) => (
                      <TextField
                        id = {`c${3 + cnum}`} 
                        fullWidth
                        error={errors.candError ? true : false}
                        label={`Candidate ${3 + cnum}`}
                        {...field}
                      />
                    )}
                  />
                </Grid>
              </Fade>
            );
          })}

          <Fab
            onClick={() => {
              setValue(
                "watchExtraNumCands",
                parseInt(watchExtraNumCands || initNumExtraCands) + 1
              );
            }}
            variant="extended"
            size="small"
            color="primary"
            aria-label="add"
            sx={{
              marginTop: 4,
              marginLeft: 3,
              paddingLeft: 2,
              paddingRight: 2,
            }}
          >
            <AddBoxOutlinedIcon sx={{ marginRight: 1 }} /> Add Candidate
          </Fab>
          <Grid item xs={12}>
            <Box
              sx={{ marginTop: 4, display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                id = "reset-form"
                onClick={() => {
                  reset({ title: "", C1: "", C2: "" });
                  handleReset();
                }}
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  paddingLeft: 2,
                  paddingRight: 2,
                  marginRight: 1,
                }}
              >
                Reset Form
              </Button>
              <Button
                id="next-button"
                variant="contained"
                color="primary"
                sx={{ marginLeft: 2, paddingLeft: 2, paddingRight: 2 }}
                onClick={handleSubmit(onSubmit)}
              >
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PollForm;
