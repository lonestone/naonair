import { Today } from "@mui/icons-material";
import { Card, Link, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import theme from "../../theme";
import { NewsDTO } from "../../types/dist/news.dto";
import ARTitleIcon from "../atoms/ARTitleIcon";

type ARCardProps = {
  news?: NewsDTO | undefined;
};

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

const ARCard = ({ news }: ARCardProps) => {
  return (
    <>
      {news ? (
        <>
          <Card sx={cardStyle}>
            <ARTitleIcon label={news.type} icon={<Today />} isNewsTitle />
            <div style={{ display: "grid", gap: theme.spacing(2) }}>
              <Typography variant="body1" color="primary.light">
                {`Du ${news.startDate} au ${news.endDate} `}
              </Typography>
              <Typography variant="body1" color="primary">
                {news.message}
              </Typography>
              <Link
                variant="body1"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  console.info("I'm a button.");
                }}
              >
                {news.linkTitle}
              </Link>
            </div>
          </Card>
          <div style={{ display: "flex", gap: 15 }}></div>
        </>
      ) : (
        <>
          <Card sx={emptyCardStyle}>
            <Typography variant="h3" color="primary.light">
              Pas d'information
            </Typography>
          </Card>
        </>
      )}
    </>
  );
};

export default ARCard;
