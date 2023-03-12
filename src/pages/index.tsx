import "@total-typescript/ts-reset";
import { type NextPage } from "next";
import Head from "next/head";
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
        {user.isSuccess &&
          user.data.map((user) => <div key={user.id}>{user.name}</div>)}
        <div className="h-screen w-screen bg-slate-800"></div>
        <div className="h-screen w-screen bg-slate-700">hello!</div>
      </main>
    </>
  );
};

export default Home;
