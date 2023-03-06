import "@total-typescript/ts-reset";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Algo Viz</title>
        <meta name="description" content="Algorithm visualization " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-slate-800 ">
        <div className="h-screen w-screen bg-slate-800"></div>
        <div className="h-screen w-screen bg-slate-700">hello!</div>
      </main>
    </>
  );
};

export default Home;
