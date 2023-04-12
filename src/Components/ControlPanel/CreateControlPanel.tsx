import Link from "next/link";
import {
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";

import CollectionSearch from "../ChooseDocument/CollectionSearch";
import CollectionTypeTabs from "../ChooseDocument/CollectionTypeTabs";
import { useGetDifficultyScore } from "../hooks/useGetDifficultyScore";
import { useGetWindowScores } from "../hooks/useGetWindowScores";
import SpeedRadioGroups from "./SpeedRadioGroups";
import { useMutation } from "@tanstack/react-query";
import { StatsContext, statsSchema } from "~/Context/StatsContext";
export type CollectionType = "user" | "library";
export type CreateControlPanelProps = {
  setCollectionTypeToView: Dispatch<SetStateAction<CollectionType | undefined>>;
  collectionTypeToView: CollectionType | undefined;
};

const CreateControlPanel = ({
  collectionTypeToView,
  setCollectionTypeToView,
}: CreateControlPanelProps) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );

  const [value, setValue] = useState(50);
  const { stats, setStats } = useContext(StatsContext);
  const difficultyMutation = useGetDifficultyScore();
  const windowDifficultyMutation = useGetWindowScores();

  const statsMutation = useMutation(
    () => {
      const url = process.env["NEXT_PUBLIC_MODEL_ENDPOINT_URL"]
        ? `${process.env["NEXT_PUBLIC_MODEL_ENDPOINT_URL"]}/stats`
        : "";

      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts: selectedDocuments.map((doc) => doc.text),
        }),
      }).then((res) => res.json());
    },
    {
      onSuccess: (data) => {
        console.log("la statistics", data);
        const stats = statsSchema.parse(data);

        setStats(stats);
      },
    }
  );
  const handleCompare = () => {
    statsMutation.mutate();
  };
  return (
    <div className="flex h-full w-full flex-col overflow-y-scroll">
      <div className=" flex h-full w-full flex-col items-center p-2 ">
        <CollectionTypeTabs
          collectionTypeToView={collectionTypeToView}
          setCollectionTypeToView={setCollectionTypeToView}
        />
        <CollectionSearch
          collectionTypeToView={collectionTypeToView}
          setCollectionTypeToView={setCollectionTypeToView}
        />
        <SpeedRadioGroups />
      </div>
      <Link
        onClick={() => {
          void handleCompare();
        }}
        href={"/view"}
        className="m-auto mb-5"
      >
        <div className=" ">
          <button
            onClick={() => {
              void handleCompare();
            }}
            className=" h-fit w-fit rounded border border-slate-400 bg-slate-700 py-2 px-4 font-bold text-white transition ease-out hover:scale-105 hover:bg-slate-800"
          >
            Analyze
          </button>
        </div>
      </Link>
    </div>
  );
};

export default CreateControlPanel;
