// type Props = {
//   states: any
// }

import { useState } from "react";

const InfoTable = () => {
  return (
    <div className="">
      <ReplacementWords />
    </div>
  );
};

export default InfoTable;

export const ReplacementWords = () => {
  const [replacementWords, setReplacementWords] = useState<string[]>([]);
  return (
    <div
      className="
    rounded-lg border  border-gray-100 p-3 transition ease-in-out "
    ></div>
  );
};
