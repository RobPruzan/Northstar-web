// type Props = {}

import Simplify from "~/components/MedGPT/Simplify";

import NavBar from "~/components/NavBar";
const index = () => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavBar />
      <div className="flex flex-col">
        <Simplify />{" "}
      </div>
    </div>
  );
};

export default index;
