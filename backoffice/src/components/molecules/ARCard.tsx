import { Add, Delete, Edit, Today } from "@mui/icons-material";
import { Card, Link, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import { useState } from "react";
import theme from "../../theme";
import ARButtonIcon from "../atoms/ARButtonIcon";
import ARTitleIcon from "../atoms/ARTitleIcon";
import ARModal from "../organisms/ARModal";

const cardStyle: SxProps<Theme> = {
  border: 1,
  borderColor: "primary.100",
  maxWidth: 600,
  minHeight: 190,
  padding: "20px",
  boxShadow: "none",
};

const emptyCardStyle: SxProps<Theme> = {
  border: 1,
  borderColor: "primary.100",
  backgroundColor: "primary.50",
  maxWidth: 600,
  minHeight: 190,
  padding: "20px",
  boxShadow: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

interface Props {
  newsDetails?: {
    duration: string;
    mainText: string;
    linkText: string;
  };
}

const ARCard = ({ newsDetails }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {newsDetails ? (
        <>
          <Card sx={cardStyle}>
            <ARTitleIcon label="Titre de linfo" icon={<Today />} isNewsTitle />
            <div style={{ display: "grid", gap: theme.spacing(2) }}>
              <Typography variant="body1" color="primary.light">
                {newsDetails.duration}
              </Typography>
              <Typography variant="body1" color="primary">
                {newsDetails.mainText}
              </Typography>
              <Link
                variant="body1"
                color="primary"
                underline="always"
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  console.info("I'm a button.");
                }}
              >
                {newsDetails.linkText}
              </Link>
            </div>
          </Card>
          <div style={{ display: "flex", gap: 15 }}>
            <ARButtonIcon
              label="Modifier"
              icon={<Edit />}
              backgroundColor="primary"
            />
            <ARButtonIcon icon={<Delete />} backgroundColor="error" />
          </div>
        </>
      ) : (
        <>
          <Card sx={emptyCardStyle}>
            <Typography variant="h2" color="primary.light">
              Pas d'information
            </Typography>
          </Card>
          <div>
            <ARButtonIcon
              label="Créer"
              icon={<Add />}
              backgroundColor="primary"
              onClick={() => setIsOpen(true)}
            />
          </div>
          <ARModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
      )}
    </>
  );
};

export default ARCard;
