import Link from "next/link";
import {
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import CollectionTypeTabs from "../ChooseDocument/CollectionTypeTabs";
import { useGetDifficultyScore } from "../hooks/useGetDifficultyScore";
export type CollectionType = "user" | "library";
export type CreateControlPanelProps = {
  setCollectionTypeToView: Dispatch<
    SetStateAction<"user" | "library" | undefined>
  >;
  collectionTypeToView: "user" | "library" | undefined;
};
const CreateControlPanel = ({
  collectionTypeToView,
  setCollectionTypeToView,
}: CreateControlPanelProps) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );
  const [difficulties, setDifficulties] = useState<number[]>([]);
  const difficultyMutation = useGetDifficultyScore();
  const handleCompare = () => {
    selectedDocuments.forEach((doc) => {
      difficultyMutation.mutate(
        {
          text: doc.text,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              setDifficulties((prev) => [...prev, data.data.difficulty]);
            }
          },
        }
      );
    });
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
        {/* <CollectionComboBox /> */}
        {difficulties.map((difficulty) => (
          <p key={difficulty} className="text-xl font-bold text-gray-300">
            {difficulty}
          </p>
        ))}
      </div>
      <Link href={"/view"} className="m-auto mb-5">
        <button
          onClick={handleCompare}
          className=" mt-64 h-fit w-fit rounded border border-slate-400 bg-slate-700 py-2 px-4 font-bold text-white transition ease-out hover:scale-105 hover:bg-slate-800"
        >
          Compare
        </button>
      </Link>
    </div>
  );
};

export default CreateControlPanel;
