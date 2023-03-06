import { motion } from "framer-motion";
import { BsX } from "react-icons/bs";

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
};
const DocumentCard = ({
  text_length,
  difficulty,
  diversity,
}: DocumentCardProps) => {
  return (
    <motion.div
      // drag
      // dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      // dragElastic={0.1}
      // dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}

      layout
      className=" relative mx-2 flex min-h-min w-80 items-center justify-center rounded-md bg-slate-800 py-1 px-3  font-semibold shadow-lg hover:shadow-lg"
    >
      <div className="flex h-fit w-full flex-col items-center">
        <div className="text-md m-1  flex justify-center">
          <div className="m-auto text-gray-500">
            <p className="text-xl font-bold text-slate-400">Dummy Title</p>
          </div>
          <div>
            <BsX
              color="red"
              size={30}
              className="absolute top-0 right-0  cursor-pointer fill-red-500 hover:scale-110  hover:fill-red-700 "
              fontSize="medium"
              // onClick={() =>
              //   dispatch({
              //     type: SelectedExcerptsActions.RemoveExcerpt,
              //     payload: { excerptInfo: excerptInfo },
              //   })
              // }
            />
          </div>
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
        {/*  */}
      </div>
    </motion.div>
  );
};

export default DocumentCard;
