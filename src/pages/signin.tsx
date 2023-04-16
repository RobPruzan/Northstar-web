import { type GetServerSideProps } from "next";
import { NextAuthOptions } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import { AppProps } from "next/app";
import React from "react";
import { BsGoogle } from "react-icons/bs";

const providerNameMap = {
  google: "Google",
  github: "GitHub",
  facebook: "Facebook",
  twitter: "Twitter",
};

const SignIn = ({ providers }: { providers: NextAuthOptions["providers"] }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-md flex h-64 w-96 flex-col items-center justify-center rounded-md bg-slate-800 font-semibold text-slate-400 shadow-lg">
        <div className="flex">
          <p className="mb-3 text-2xl">Sign in</p>
        </div>
        <div className="flex h-5/6 flex-col items-center justify-start ">
          {Object.values(providers).map((provider) => (
            <div
              onClick={() =>
                void signIn(provider.id, {
                  callbackUrl: window.location.origin,
                })
              }
              className="flex h-12 w-64 cursor-pointer items-center  justify-center  rounded-md bg-slate-400 font-semibold text-slate-800 shadow-lg transition hover:bg-slate-500 hover:shadow-lg"
              key={provider.name}
            >
              <div className="flex w-full items-center justify-evenly">
                {provider.name.toLowerCase() === "google" && (
                  <BsGoogle className="mr-2" color="white" size={20} />
                )}
                Sign in with {provider.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
