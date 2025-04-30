import * as React from "react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import {
  Box,
  Stepper as MuiStepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import httpClient from "../../../util/HttpClient";
import Swal from "sweetalert2";
import Snackbar from "@mui/material/Snackbar";

function Stepper({ initialData = [], onClose }) {
  console.log("in", initialData);

  const [activeStep, setActiveStep] = React.useState(0);
  const [replies, setReplies] = React.useState({});
  const statusSteps = ["open", "in progress", "closed"];
  const [alertMessage, setAlertMessage] = useState(null);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(null); // true = success, false = error

  const handleChangeReply = (e, status) => {
    setReplies((prev) => ({
      ...prev,
      [status]: e.target.value,
    }));
  };

  const handleNext = async () => {
    const status = statusSteps[activeStep];
    const ticket = initialData.find((item) => item.status === status);
    console.log("tikectks", ticket);

    const reply = replies[status];

    if (!ticket) return;

    if (!reply) {
      // Close the modal immediately
      if (onClose) onClose();

      const result = await Swal.fire({
        title: "No Reply Provided",
        text: "Do you want to change the status without replying to the client?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change status",
        cancelButtonText: "No, reply first",
        customClass: {
          popup: "custom-z-index-swal",
        },
      });

      if (result.isConfirmed) {
        try {
          await httpClient.patch(`admin/contact-us/${ticket._id}`, {
            status: statusSteps[activeStep + 1] || "closed",
          });
          setAlertMessage("Status has been changed.");
          setCloseSnakeBar(true);

          // Reopen modal after 2 seconds at next step
          setTimeout(() => {
            if (onClose) onClose(activeStep + 1);
          }, 2000);
        } catch (error) {
          setAlertMessage("Failed to update status.");
          setCloseSnakeBar(true);

          // Optional: reopen current step if error
          setTimeout(() => {
            if (onClose) onClose(activeStep);
          }, 1000);
        }
      } else {
        setAlertMessage("Please write a reply before continuing.");
        setCloseSnakeBar(true);

        // Reopen modal after 1 second at current step
        setTimeout(() => {
          if (onClose) onClose(activeStep);
        }, 1000);
      }
    } else {
      try {
        await httpClient.post("admin/mail/send-mail", {
          email: ticket.email,
          subject: ticket.subject,
          body: reply,
        });

        setApiSuccess(true);
        setAlertMessage("Reply has been sent to the client.");
        setCloseSnakeBar(true);

        // Close after 3 seconds (no need to change step)
        setTimeout(() => {
          if (onClose) onClose();
        }, 3000);
      } catch (error) {
        setApiSuccess(false);
        setAlertMessage("Failed to send reply.");
        setCloseSnakeBar(true);
      }
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => {
    setActiveStep(0);
    setReplies({});
    if (onClose) onClose();
  };

  return (
    <>
      <Snackbar
        open={closeSnakeBar}
        autoHideDuration={2000}
        message={alertMessage}
        ContentProps={{
          sx: apiSuccess
            ? { backgroundColor: "green" }
            : { backgroundColor: "red" },
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={() => setCloseSnakeBar(false)}
          >
            <CloseIcon />
          </IconButton>
        }
      />
      <Box sx={{ maxWidth: 600 }}>
        <MuiStepper activeStep={activeStep} orientation="vertical">
          {statusSteps.map((status, index) => {
            const ticket = initialData.find((item) => item.status === status);

            return (
              <Step key={status}>
                <StepLabel>
                  <Typography
                    variant="subtitle1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    Step {index + 1}: {status} Status
                  </Typography>
                </StepLabel>
                <StepContent>
                  {ticket ? (
                    <Box>
                      <Typography>
                        <strong>
                          {ticket.first_name} {ticket.last_name} (
                          {ticket.ticket_number})
                        </strong>{" "}
                        - {ticket.status}({ticket.createdAt.substring(0, 10)})
                      </Typography>
                      <Typography>{ticket.email}</Typography>
                      <Typography>{ticket.phone}</Typography>
                      <Typography>Team :- {ticket.subject}</Typography>
                      <Typography>Message :- {ticket.message}</Typography>

                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Reply :-"
                        value={replies[status] || ""}
                        onChange={(e) => handleChangeReply(e, status)}
                        sx={{ mt: 2 }}
                      />

                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mr: 1 }}
                        >
                          {index === statusSteps.length - 1
                            ? "Finish"
                            : "Continue"}
                        </Button>
                        {/* <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button> */}
                      </Box>
                    </Box>
                  ) : (
                    <Typography>No data available for this status</Typography>
                  )}
                </StepContent>
              </Step>
            );
          })}
        </MuiStepper>

        {activeStep === statusSteps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed — you're finished</Typography>
            {/* <Button onClick={handleReset} sx={{ mt: 1 }}>
            Reset
          </Button> */}
          </Paper>
        )}
      </Box>
    </>
  );
}

export default Stepper;
