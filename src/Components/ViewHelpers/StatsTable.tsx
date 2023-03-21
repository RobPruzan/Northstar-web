// type Props = {}

const StatsTable = () => {
  return (
    <table className="table-auto rounded-md  text-gray-100">
      <thead className=" ">
        <tr className=" border border-slate-500">
          <th className="p-3">Song</th>
          <th className="p-3">Artist</th>
          <th className="p-3">Year</th>
        </tr>
      </thead>
      <tbody className=" border border-slate-500">
        <tr className=" border border-slate-500 ">
          <td className=" border border-slate-500 p-3">
            The Sliding Mr. Bones (Next Stop, Pottersville)
          </td>
          <td className=" border border-slate-500 ">Malcolm Lockyer</td>
          <td className=" border border-slate-500 ">1961</td>
        </tr>
        <tr className=" border border-slate-500 ">
          <td className=" border border-slate-500 p-3">Witchy Woman</td>
          <td className=" border border-slate-500">The Eagles</td>
          <td className=" border border-slate-500">1972</td>
        </tr>
        <tr className=" border border-slate-500 ">
          <td className=" border border-slate-500 p-3">Shining Star</td>
          <td className=" border border-slate-500">Earth, Wind, and Fire</td>
          <td className=" border border-slate-500">1975</td>
        </tr>
      </tbody>
    </table>
  );
};

export default StatsTable;
