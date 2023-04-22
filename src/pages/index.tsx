import "@total-typescript/ts-reset";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import NavBar from "~/components/NavBar";
import SignIn from "./signin";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  return (
    <>
      <NavBar />
      <Head>
        <title>Northstar</title>
        <meta name="description" content="Algorithm visualization " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-slate-800 ">
        <div className="h-screen w-screen">
          <main className="fancy-content bg-slate-900 ">
            <div className="mx-auto flex h-screen  flex-col p-8">
              <div className="m-24 h-2/5 w-3/5">
                <h1 className="bg-gradient-to-r from-slate-700 via-blue-900 to-slate-600 bg-clip-text text-9xl font-extrabold text-transparent">
                  Northstar
                </h1>
                <p className="mb-4 text-lg text-gray-300">
                  Automatic literacy assessments with state of the art machine
                  learning models
                </p>
                <Link href={{ pathname: "/create" }}>
                  <button className="rounded-md border border-slate-400 bg-slate-900 px-6 py-2 text-lg text-slate-500 shadow-xl  transition hover:scale-105 hover:bg-slate-800 ">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </main>
    </>
  );
};

export default Home;
