import { type Document } from "@prisma/client";
import { motion } from "framer-motion";
import { type Dispatch } from "react";
import { BsX } from "react-icons/bs";
import useDeleteDocument from "./hooks/useDeleteDocument";
export const COLOR_MAP = (difficulty: number) => {
  if (difficulty <= 30) {
    return "lime";
  } else if (difficulty <= 60) {
    return "orange";
  } else {
    return "red";
  }
};
export type DocumentCardProps = {
  difficulty: number;
  diversity: number;
  text_length: number;
  documentId: string;
  isSelection?: boolean;
  setSelectedDocuments?: Dispatch<React.SetStateAction<Document[]>>;
};
const DocumentCard = ({
  text_length,
  difficulty,
  diversity,
  documentId,
  isSelection,
  setSelectedDocuments,
}: DocumentCardProps) => {
  // const queryClient = useQueryClient();
  // const documentMutation = api.document.deleteOne.useMutation({
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries(
  //       getQueryKey(api.document.getAllUserDocuments)
  //     );
  //   },
  // });
  const documentMutation = useDeleteDocument();
  return (
    <motion.div
      layout
      className="relative  mx-2 flex min-h-min w-80 items-center justify-center rounded-md  border border-slate-500  bg-slate-800 py-1 px-3 font-semibold shadow-lg hover:shadow-lg"
    >
      <div className="flex h-fit w-full flex-col items-center">
        <div className="text-md m-1  flex justify-center">
          <div className="m-auto text-gray-500">
            <p className="text-xl font-bold text-slate-400">Dummy Title</p>
          </div>

          <BsX
            onClick={() =>
              isSelection
                ? setSelectedDocuments &&
                  setSelectedDocuments((prev) =>
                    prev.filter((doc) => doc.id !== documentId)
                  )
                : documentId &&
                  documentMutation.mutate({
                    documentId,
                  })
            }
            color="red"
            size={30}
            className="absolute top-0 right-0  cursor-pointer fill-red-500 hover:scale-110  hover:fill-red-700 "
            fontSize="medium"
          />
        </div>

        {/*  */}

        <div className="m-2 h-max w-full min-w-min rounded-md bg-slate-700 p-1 text-center text-sm">
          <div className=" flex w-full  justify-evenly text-center text-xs">
            <div className="mx-3">
              <p className="text-slate-400">Difficulty</p>
              <p className="text-yellow-300">{difficulty}%</p>
            </div>
            <div className="mx-3">
              <p className="inline text-slate-400">Diversity</p>
              <p className="text-red-500">{diversity}%</p>
            </div>
            <div className="mx-3">
              <p className="text-slate-400">Length</p>
              <p className="inline text-green-500">{text_length}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;
