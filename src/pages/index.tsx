import "@total-typescript/ts-reset";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import NavBar from "~/components/NavBar";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user = api.user.getAll.useQuery();

  return (
    <>
      <NavBar />
      <Head>
        <title>Northstar</title>
        <meta name="description" content="Algorithm visualization " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-slate-800 ">
        <div className="h-screen w-screen bg-slate-800">
          <main className="bg-slate-800 ">
            {/* {user.isSuccess &&
          user.data.map((user) => <div key={user.id}>{user.name}</div>)}
        <div className="h-screen w-screen bg-slate-800"></div>
        <div className="h-screen w-screen bg-slate-700">hello!</div> */}
            {/* <div className="h-screen bg-slate-800"> */}
            <section className="mx-auto  h-screen p-8">
              <div className="m-24 h-full w-2/5">
                <p
                  style={{
                    fontSize: "6rem",
                  }}
                  className=" font-extrabold text-gray-400"
                >
                  Northstar
                </p>
                <p className="mb-4 text-lg text-gray-500">
                  Northstar generates automatic literacy assessments with state
                  of the art machine learning models
                </p>
                <button className="rounded-md border border-slate-400 bg-slate-900 px-6 py-2 text-lg text-slate-500 shadow-xl  transition hover:scale-105 hover:bg-slate-800 ">
                  <Link href={{ pathname: "/create" }}>Get Started</Link>
                </button>
              </div>
            </section>

            <footer className="mt-atuo mt-12 bg-slate-700 p-4">
              <div className="container mx-auto">
                <p className="text-center text-white">
                  &copy; {new Date().getFullYear()} Northstar. All rights
                  reserved.
                </p>
              </div>
            </footer>
            {/* </div> */}
          </main>
        </div>
      </main>
    </>
  );
};

export default Home;
