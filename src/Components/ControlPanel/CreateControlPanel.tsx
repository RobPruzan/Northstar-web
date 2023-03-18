import Link from "next/link";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import CollectionComboBox from "../ChooseDocument/CollectionComboBox";
import CollectionTypeTabs from "../ChooseDocument/CollectionTypeTabs";
import { useGetDifficultyScore } from "../hooks/useGetDifficultyScore";
import { useGetWindowScores } from "../hooks/useGetWindowScores";
export type CollectionType = "user" | "library";
export type CreateControlPanelProps = {
  setCollectionTypeToView: Dispatch<
    SetStateAction<"user" | "library" | undefined>
  >;
  collectionTypeToView: "user" | "library" | undefined;
  setDifficulties: Dispatch<SetStateAction<number[]>>;
  difficulties: number[];
};
const CreateControlPanel = ({
  collectionTypeToView,
  setCollectionTypeToView,
}: CreateControlPanelProps) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );

  const difficultyMutation = useGetDifficultyScore();
  const windowDifficultyMutation = useGetWindowScores();
  const handleCompare = () => {
    for (const doc of selectedDocuments) {
      difficultyMutation.mutate({
        text: doc.text,
      });
      windowDifficultyMutation.mutate({
        text: doc.text,
      });
    }

    // difficultyMutation.mutate({
    //   text
    // })
  };
  return (
    <div className="flex h-full w-full flex-col">
      <div className=" flex h-full w-full flex-col items-center p-2 ">
        <CollectionTypeTabs
          collectionTypeToView={collectionTypeToView}
          setCollectionTypeToView={setCollectionTypeToView}
        />
        <CollectionComboBox />
      </div>
      <Link
        onClick={() => {
          void handleCompare();
        }}
        href={"/view"}
        className="m-auto mb-5"
      >
        <button className=" mt-64 h-fit w-fit rounded border border-slate-400 bg-slate-700 py-2 px-4 font-bold text-white transition ease-out hover:scale-105 hover:bg-slate-800">
          Compare
        </button>
      </Link>
    </div>
  );
};

export default CreateControlPanel;
