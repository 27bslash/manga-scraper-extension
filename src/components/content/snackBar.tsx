import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
type customSnackProps = {
  open: boolean;
  handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
};
export const CustomSnackBar = ({ open, handleClose }: customSnackProps) => {
  const vertical = "top";
  const horizontal = "center";
  const action = (
    <>
      <IconButton aria-label="open" onClick={handleClose}>
        <DoneIcon color="secondary" fontSize="medium" className="add-icon-mu" />
      </IconButton>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon
          color="secondary"
          fontSize="medium"
          className="close-icon-mu"
        />
      </IconButton>
    </>
  );
  console.log("snack open", open);
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <SnackbarContent
        message="Start Reading? "
        action={action}
        sx={{
          display: "grid",
          minWidth: "100px !important",
          textAlign: "center",
          ".MuiSnackbarContent-action": {
            paddingLeft: "0",
            display: "block",
            marginLeft: "0",
            marginRight: "0",
          },
        }}
      />
    </Snackbar>
  );
};
