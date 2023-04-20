// type Props = {}

import NavBar from "~/components/NavBar";
import Simplify from "~/components/Simplify";
const index = () => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavBar />
      <div className="flex h-full w-full flex-col">
        <Simplify />
      </div>
    </div>
  );
};

export default index;
