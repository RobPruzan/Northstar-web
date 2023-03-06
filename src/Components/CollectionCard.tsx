type Props = {
  children?: React.ReactNode;
  className?: string;
};

const CollectionCard = ({ children, className }: Props) => {
  return (
    <div
<<<<<<< HEAD
      className={`${
        className ?? ""
      }  shadow-md" h-36 w-56 rounded-md border border-slate-500 bg-slate-700 p-2`}
    >
      {children}
    </div>
=======
      className="
    h-36 w-56 rounded-md border border-slate-500 bg-slate-700 p-2 shadow-md"
    ></div>
>>>>>>> a26bb37 (Make input collection reducer)
  );
};

export default CollectionCard;
