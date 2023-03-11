type Props = {
  children?: React.ReactNode;
  className?: string;
};

const CollectionCard = ({ children, className }: Props) => {
  return (
    <div
      className={`${
        className ?? ""
      }  shadow-md" h-36 w-56 rounded-md border border-slate-500 bg-slate-700 p-2`}
    >
      {children}
    </div>
  );
};

export default CollectionCard;
