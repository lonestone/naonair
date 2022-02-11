import { Today } from "@mui/icons-material";
import { Card, Link, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import { format } from "date-fns";
import theme from "../../theme";
import { NewsDTO } from "@aireal/dtos";
import { convertNewsType } from "../../types/news";
import ARTitleIcon from "../atoms/ARTitleIcon";

type ARCardProps = {
  news?: NewsDTO;
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
            <ARTitleIcon
              label={convertNewsType[news.type]}
              icon={<Today />}
              isNewsTitle
              marginBottom={theme.spacing(2)}
            />
            <div style={{ display: "grid", gap: theme.spacing(2) }}>
              <Typography variant="body1" color="primary.light">
                {news.endDate
                  ? `Du ${format(
                      new Date(news.startDate),
                      "dd/MM/yyyy",
                    )} au ${format(new Date(news.endDate), "dd/MM/yyyy")} `
                  : `Depuis ${format(new Date(news.startDate), "dd/MM/yyyy")}`}
              </Typography>
              <Typography variant="body1" color="primary">
                {news.message}
              </Typography>
              <Link
                variant="body1"
                color="primary"
                sx={{ cursor: "pointer" }}
                href={news.link}
              >
                {news.linkTitle}
              </Link>
            </div>
          </Card>
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
