import { Box, Modal, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import { Dispatch, SetStateAction } from "react";
import theme from "../../theme";
import { NewsDTO } from "../../types/dist/news.dto";
import ARInputs from "../molecules/ARInputs";

interface ARModalProps {
  isOpen: boolean;
  news?: NewsDTO | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const style: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "790px",
  minHeight: "640px",
  background: "#FFFFFF",
  boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "4px",
  padding: "40px",
};

const ARModal = ({ isOpen, setIsOpen, news }: ARModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          variant="h3"
          color="primary"
          sx={{ marginBottom: theme.spacing(5) }}
        >
          Créer une information
        </Typography>
        <ARInputs />
      </Box>
    </Modal>
  );
};

export default ARModal;
