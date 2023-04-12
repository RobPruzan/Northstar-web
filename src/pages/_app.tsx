import { type Document } from "@prisma/client";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { useContext, useState } from "react";
import { type WindowDifficulty } from "~/components/hooks/useGetWindowScores";
import { DifficultiesContext } from "~/Context/DifficultiesContext";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import { StatsContext, type Stats } from "~/Context/StatsContext";
import { WindowDifficultiesContext } from "~/Context/WindowDifficultyContext";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats>({
    difficulty: [],
    diversity_per_difficulty: [],
    diversity_per_topic: [],
    overall_diversity: [],
    sentiment: [],
  });
  const [windowDifficulties, setWindowDifficulties] = useState<
    WindowDifficulty[]
  >([]);

  const [difficulties, setDifficulties] = useState<number[]>([]);

  return (
    <WindowDifficultiesContext.Provider
      value={{ windowDifficulties, setWindowDifficulties }}
    >
      <DifficultiesContext.Provider value={{ difficulties, setDifficulties }}>
        <StatsContext.Provider value={{ stats, setStats }}>
          <SelectedDocumentsContext.Provider
            value={{ selectedDocuments, setSelectedDocuments }}
          >
            <SessionProvider session={session}>
              <Component {...pageProps} />
            </SessionProvider>
          </SelectedDocumentsContext.Provider>
        </StatsContext.Provider>
      </DifficultiesContext.Provider>
    </WindowDifficultiesContext.Provider>
  );
};

export default api.withTRPC(MyApp);
