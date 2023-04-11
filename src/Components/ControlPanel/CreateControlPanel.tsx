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
export type CollectionType = "user" | "library";
export type CreateControlPanelProps = {
  setCollectionTypeToView: Dispatch<SetStateAction<CollectionType | undefined>>;
  collectionTypeToView: CollectionType | undefined;
};

// shape of stats
// # shape: {'text': [], 'difficulty': [], 'diversity_per_topic': [], 'overall_diversity': [], 'diversity_per_difficulty': [], 'sentiment': []}
type Stats = {
  text: string[];
  difficulty: number[];
  diversity_per_topic: number[];
  overall_diversity: number[];
  diversity_per_difficulty: number[];
  sentiment: number[];
};

const CreateControlPanel = ({
  collectionTypeToView,
  setCollectionTypeToView,
}: CreateControlPanelProps) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );
  const [value, setValue] = useState(50);

  const difficultyMutation = useGetDifficultyScore();
  const windowDifficultyMutation = useGetWindowScores();

  const statsMutation = useMutation(() => {
    const url = process.env.NEXT_PUBLIC_MODEL_ENDPOINT_URL
      ? `${process.env.NEXT_PUBLIC_MODEL_ENDPOINT_URL}/difficulty`
      : "";

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: selectedDocuments.map((doc) => doc.text),
      }),
    }).then((res) => res.json());
  });
  const handleCompare = () => {
    // for (const doc of selectedDocuments) {
    //   difficultyMutation.mutate({
    //     text: doc.text,
    //   });
    //   windowDifficultyMutation.mutate({
    //     text: doc.text,
    //   });
    // }
    statsMutation.mutate();

    // difficultyMutation.mutate({
    //   text
    // })
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
        {/* <div className="mt-20 w-full text-center">
          <label
            htmlFor="customRange1"
            className=" font-semibold text-gray-200"
          >
            <p className="float-left text-gray-400">Window step-size</p>
            <p className="float-right font-bold">{value}</p>
          </label>
          <input
            id="customRange1"
            step={1}
            type="range"
            min="0"
            max="50"
            value={value}
            className="
          mt-4


            w-full
            appearance-none
            rounded-md
            bg-slate-800
            accent-blue-800
            outline-none

            
            
            
            
            hover:accent-blue-700"
            onChange={(e) => setValue(parseInt(e.target.value))}
          />
        </div> */}
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
