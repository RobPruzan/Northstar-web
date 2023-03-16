type Props = {
  children?: React.ReactNode;
  className?: string;
};

const CollectionCard = ({ children, className }: Props) => {
  return (
    <div
      className={`${
        className ?? ""
      }  flex h-36 w-56 items-center justify-center rounded-md border border-slate-500 bg-slate-700 p-2 shadow-md`}
    >
      {children}
    </div>
  );
};

export default CollectionCard;
