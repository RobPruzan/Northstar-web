import Link from "next/link";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { DifficultiesContext } from "~/Context/DifficultiesContext";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import CollectionTypeTabs from "../ChooseDocument/CollectionTypeTabs";
import {
  difficultSchema,
  useGetDifficultyScore,
} from "../hooks/useGetDifficultyScore";
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
  const { difficulties, setDifficulties } = useContext(DifficultiesContext);

  const difficultyMutation = useGetDifficultyScore();
  const handleCompare = () => {
    // selectedDocuments.forEach(async (doc) => {
    //   console.log("the doc", doc);
    //   const data = await difficultyMutation.mutateAsync(
    //   {
    //     text: doc.text,
    //   }
    //   );
    // });
    for (const doc of selectedDocuments) {
      console.log("hello??s");
      difficultyMutation
        .mutateAsync({
          text: doc.text,
        })
        .then((data) => {
          console.log("fodsaif");
          const validatedData = difficultSchema.safeParse(data);
          if (validatedData.success) {
            setDifficulties((prev) => [...prev, validatedData.data.difficulty]);
          }
          console.log("the data", data);
        })
        .catch((err) => console.log("err", err));
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
        {/* <CollectionComboBox /> */}
        {difficulties.map((difficulty) => (
          <p key={difficulty} className="text-xl font-bold text-gray-300">
            {difficulty}
          </p>
        ))}
      </div>
      <Link
        onClick={() => {
          handleCompare();
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
