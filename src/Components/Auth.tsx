import { signIn, signOut, useSession } from "next-auth/react";

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4 ">
      {/* <p className="text-center text-2xl text-slate-800">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p> */}
      <button
        className=" rounded-full bg-slate-400 px-10 py-3 font-semibold text-slate-800 no-underline transition duration-200 ease-in-out hover:bg-slate-500"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
export default AuthShowcase;
