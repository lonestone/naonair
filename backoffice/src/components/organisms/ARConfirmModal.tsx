import { Box, Button, Modal, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import { Dispatch, SetStateAction } from "react";
import { removeNews } from "../../api/news.api";

interface ARConfirmModalProps {
  isOpen: boolean;
  newsUUID?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchNews: () => Promise<void>;
}

const modalStyle: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "600px",
  minHeight: "200px",
  background: "#FFFFFF",
  boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "4px",
  padding: "40px",
  display: "grid",
  rowGap: 2,
};

const ARConfirmModal = ({
  isOpen,
  newsUUID,
  setIsOpen,
  fetchNews,
}: ARConfirmModalProps) => {
  const handleRemoveNews = async () => {
    const response = await removeNews(newsUUID!);
    if (response.status === 500) {
      console.log("Error 500");
    }
    await fetchNews();
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography variant="h3">
          Souhaitez-vous vraiment supprimer cette information ?
        </Typography>
        <Typography variant="body1">Cet action est irreversible.</Typography>
        <div>
          <Button onClick={() => setIsOpen(false)} color="success">
            NON
          </Button>
          <Button onClick={handleRemoveNews} color="success">
            OUI
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ARConfirmModal;
