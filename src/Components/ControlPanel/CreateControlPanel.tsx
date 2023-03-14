import { type Document } from "@prisma/client";
import Link from "next/link";
import { useContext, useState } from "react";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import CollectionComboBox from "../ChooseDocument/CollectionComboBox";
import CollectionTypeTabs from "../ChooseDocument/CollectionTypeTabs";
import { useGetDifficultyScore } from "../modelConnection";
export type CreateControlPanelProps = {
  selectedDocuments: Document[];
};
const CreateControlPanel = () => {
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
            console.log("The incoming data");
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
    <div className="flex h-full w-full flex-col items-center p-2 ">
      <CollectionTypeTabs />
      <CollectionComboBox />
      {difficulties.map((difficulty) => (
        <p key={difficulty} className="text-xl font-bold text-gray-300">
          {difficulty}
        </p>
      ))}
      <Link href={"/view"}>
        <button
          onClick={handleCompare}
          className=" m-auto  mr-auto mb-3 h-fit w-fit rounded bg-blue-900 py-2 px-4 font-bold text-white transition ease-out hover:scale-105 hover:bg-blue-800"
        >
          Compare
        </button>
      </Link>
    </div>
  );
};

export default CreateControlPanel;
