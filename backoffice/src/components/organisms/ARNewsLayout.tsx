import { Add, Delete, Edit, InfoSharp } from "@mui/icons-material";
import { useState } from "react";
import { removeNews } from "../../api/news.api";
import { NewsDTO } from "../../types/dist/news.dto";
import ARButtonIcon from "../atoms/ARButton";
import ARTitleIcon from "../atoms/ARTitleIcon";
import ARCard from "../molecules/ARCard";
import ARModal from "./ARModal";

type ARNewsLayoutProps = {
  title: string;
  subtitle: string;
  news: NewsDTO | undefined;
};

const ARNewsLayout = ({ title, subtitle, news }: ARNewsLayoutProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <ARTitleIcon label={title} icon={<InfoSharp />} subtitle={subtitle} />
      <ARCard news={news} />

      {!news ? (
        <ARButtonIcon
          label="Créer"
          icon={<Add />}
          backgroundColor="primary"
          onClick={() => setIsOpen(true)}
        />
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <ARButtonIcon
            label="Modifier"
            icon={<Edit />}
            backgroundColor="primary"
            onClick={() => setIsOpen(true)}
          />
          <ARButtonIcon
            onClick={() => removeNews(news.uuid)}
            icon={<Delete />}
            backgroundColor="error"
          />
        </div>
      )}
      <ARModal isOpen={isOpen} setIsOpen={setIsOpen} news={news} />
    </div>
  );
};

export default ARNewsLayout;
