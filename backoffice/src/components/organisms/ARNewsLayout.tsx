import { Add, Delete, Edit, InfoSharp } from "@mui/icons-material";
import { useState } from "react";
import { removeNews } from "../../api/news.api";
import { NewsDTO } from "../../types/dist/news.dto";
import ARButtonIcon from "../atoms/ARButton";
import ARTitleIcon from "../atoms/ARTitleIcon";
import ARCard from "../molecules/ARCard";
import ARConfirmModal from "./ARConfirmModal";
import ARModal from "./ARModal";

type ARNewsLayoutProps = {
  title: string;
  subtitle: string;
  news: NewsDTO | undefined;
  fetchNews: () => Promise<void>;
};

const ARNewsLayout = ({
  title,
  subtitle,
  news,
  fetchNews,
}: ARNewsLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
            onClick={() => setIsConfirmOpen(true)}
            icon={<Delete />}
            backgroundColor="error"
          />
        </div>
      )}
      <ARModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        news={news}
        fetchNews={fetchNews}
      />
      <ARConfirmModal
        isOpen={isConfirmOpen}
        newsUUID={news?.uuid}
        setIsOpen={setIsConfirmOpen}
        fetchNews={fetchNews}
      />
    </div>
  );
};

export default ARNewsLayout;
