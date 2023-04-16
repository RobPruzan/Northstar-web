import { useContext, useRef, useState } from "react";

import { alpha, styled } from "@mui/material";
import Menu, { type MenuProps } from "@mui/material/Menu";
import { type Document } from "@prisma/client";
import { motion } from "framer-motion";
import { BsSearch } from "react-icons/bs";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import { setSelectedDocumentsUniquely } from "./ChooseDocument/UserDocuments";
import DocumentCard from "./DocumentCard";
export type Props = { documents: Document[] };

export const DocumentsPopOver = ({ documents }: Props) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const popoverRef = useRef<HTMLDivElement>(null);

  const filteredDocuments = documents.filter((document) =>
    document.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("serach qeury", searchQuery, filteredDocuments);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  return (
    <div className=" w-full max-w-sm px-4">
      <button
        disabled={documents.length === 0}
        className={` ${open ? "" : "text-opacity-90"}   ${
          documents.length === 0
            ? "bg-slate-500"
            : " bg-slate-800 transition  hover:scale-105"
        } group float-right inline-flex min-w-fit items-center rounded-md p-3  text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        onClick={handleClick}
      >
        <BsSearch size={27} />
      </button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        style={{
          padding: 0,
        }}
        className="h-96 "
      >
        <div
          style={{
            marginTop: "-5px",
            marginBottom: "-5px",
            minWidth: "200px",
          }}
          className=": flex h-full w-full flex-col items-center bg-slate-600  p-4"
        >
          <textarea
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="h-10 w-full rounded-md bg-slate-700 p-2 font-medium text-white outline-none ring-0"
          />

          {filteredDocuments.length > 0 ? (
            filteredDocuments.map(
              (document) =>
                document.text
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) && (
                  <div key={document.id} className="flex flex-col">
                    <motion.button
                      className="my-3"
                      onClick={() => {
                        setSelectedDocumentsUniquely(
                          setSelectedDocuments,
                          document
                        );
                      }}
                      whileHover={{
                        scale: 1.02,
                      }}
                      whileTap={{ scale: 1 }}
                    >
                      <DocumentCard cursor="default" document={document} />
                    </motion.button>
                  </div>
                )
            )
          ) : (
            <p>No documents found</p>
          )}
        </div>
      </StyledMenu>
    </div>
  );
};

//

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

// export const NO_ACTIVE_POPUP = -1;

// export default function CustomizedMenus({
//   activePopUp,
//   collectionId,
//   excerptsInfo,
//   setActivePopUp,
// }: Props) {
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);

//   };
//   const handleClose = () => {
//     setAnchorEl(null);

//   };

//   return (
//     <>
//       <button
//         className=" float-left transition duration-300 ease-in-out hover:scale-125 hover:fill-slate-500 hover:shadow-2xl "
//         onClick={handleClick}
//       >
//         <FcSearch size={27} />
//       </button>
//       <div
//         className={`${
//           open ? 'block' : 'hidden'
//         }  flex h-full w-full justify-start`}
//       >
//         <StyledMenu
//           id="demo-customized-menu"
//           MenuListProps={{
//             'aria-labelledby': 'demo-customized-button',
//           }}
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//         >
//           <div className="mb-3 flex h-96 flex-col items-start justify-center">
//             {excerptsInfo.length > 0 ? (
//               excerptsInfo.map(
//                 (excerptInfo) =>
//                   collectionId === excerptInfo.excerpt.collection.id && (
//                     <>
//                       <SearchBar />
//                       <ExcerptCard
//                         difficulty={excerptInfo.difficulty}
//                         diversity={excerptInfo.diversity}
//                         text_length={excerptInfo.text_length}
//                         title={excerptInfo.excerpt.title}
//                       />
//                     </>
//                   )
//               )
//             ) : (
//               <p
//                 className="w-36 text-center text-xl  text-gray-600
//               "
//               >
//                 No excerpts found
//               </p>
//             )}
//           </div>
//         </StyledMenu>
//       </div>
//     </>
//   );
// }

// {/* <Popover
//   // style={{
//   //   position: "absolute",
//   //   top: `${top}px`,
//   //   left: `${left}px`,
//   // }}
//   className="relative"
// >
//   {({ open }) => (
//     <>
//       <Popover.Button
//         onClick={() => {
//           setOpen(!open);
//         }}
//         disabled={documents.length === 0}
//         className={`

//           ${open ? "" : "text-opacity-90"}
//           ${
//             documents.length === 0
//               ? "bg-slate-500"
//               : " bg-slate-800 transition  hover:scale-105"
//           }
//           group float-right inline-flex min-w-fit items-center rounded-md p-3  text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
//       >
//         {/* <BsChevronBarDown /> */}
//         <BsChevronBarDown
//           size={40}
//           className={`${open ? "" : "text-opacity-70"}
//             h-5 w-5 text-slate-300 transition duration-150  ease-in-out group-hover:text-opacity-80`}
//           aria-hidden="true"
//         />
//       </Popover.Button>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-200"
//         enterFrom="opacity-0 translate-y-1"
//         enterTo="opacity-100 translate-y-0"
//         leave="transition ease-in duration-150"
//         leaveFrom="opacity-100 translate-y-0"
//         leaveTo="opacity-0 translate-y-1"
//       >
//         <Popover.Panel className=" absolute left-1/2 z-10 mt-3 w-56 max-w-sm  -translate-x-1/2 transform  px-4 sm:px-0">
//           <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
//             <div
//               // style={popoverStyle}
//               style={{
//                 // position: "absolute",
//                 top: `${top}px`,
//                 left: `${left}px`,
//                 backgroundColor: "red",
//               }}
//               ref={popoverRef}
//               // style={popoverStyle}
//               className="relative z-50 grid h-96 w-fit gap-8 overflow-y-scroll border border-slate-400 bg-slate-500 p-7"
//             >
//               {documents.map((document) => (
//                 <div key={document.id} className="flex flex-col">
//                   <motion.button
//                     onClick={() => {
//                       setSelectedDocumentsUniquely(
//                         setSelectedDocuments,
//                         document
//                       );
//                     }}
//                     whileHover={{
//                       scale: 1.05,
//                     }}
//                     whileTap={{ scale: 1 }}
//                   >
//                     <DocumentCard
//                       difficulty={document.difficulty}
//                       // diversity={document.diversity}
//                       text_length={document.text.length}
//                       documentId={document.id}
//                     />
//                   </motion.button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Popover.Panel>
//       </Transition>
//     </>
//   )}
// </Popover> */}
