import { useContext, useRef, useState } from "react";

import { alpha, styled } from "@mui/material";
import Menu, { type MenuProps } from "@mui/material/Menu";
import { type Document } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { BsSearch } from "react-icons/bs";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import { setSelectedDocumentsUniquely } from "./ChooseDocument/UserDocuments";
import DocumentCard from "./DocumentCard";
import EditableDocument from "./ChooseDocument/EditableDocument";
import DocumentEdit from "./ChooseDocument/DocumentEdit";
import { useEditableDocState } from "~/hooks/useEditableDocState";
export type Props = { documents: Document[] };

export const DocumentsPopOver = ({ documents }: Props) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { currentEditDocument, isOpen, setCurrentEditDocument, setIsOpen } =
    useEditableDocState();

  const filteredDocuments = documents.filter((document) =>
    document.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            minWidth: "310px",
          }}
          className=": flex h-full w-full flex-col items-center bg-slate-600  p-4"
        >
          <input
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="h-10 w-full rounded-md bg-slate-700 p-2 font-medium text-white outline-none ring-0"
          />
          <AnimatePresence
            onExitComplete={() => {
              setCurrentEditDocument(null);
            }}
          >
            {isOpen && currentEditDocument && (
              // <>
              <DocumentEdit
                // key={"modal: " + document.id}
                document={currentEditDocument}
                setIsOpen={setIsOpen}
              />
              // </>
            )}
          </AnimatePresence>

          {filteredDocuments.length > 0 ? (
            filteredDocuments.map(
              (document) =>
                document.title && (
                  <EditableDocument
                    currentEditDocument={currentEditDocument}
                    document={document}
                    isOpen={isOpen}
                    setCurrentEditDocument={setCurrentEditDocument}
                    setIsOpen={setIsOpen}
                    setSelectedDocuments={setSelectedDocuments}
                    key={document.id}
                  />
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
    accessKey=""
    tabIndex={-1}
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
