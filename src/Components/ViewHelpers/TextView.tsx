import { type Document } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import { WindowDifficultiesContext } from "~/Context/WindowDifficultyContext";
const puncs = [".", ",", "?", "!"];
export const word_tokenize = (text: string | undefined) => {
  if (!text) return [];
  let temp_token = "";
  const tokens = [];
  for (const char of text) {
    if (char in puncs || char === " ") {
      tokens.push(temp_token);
      temp_token = "";
    }
    temp_token += char;
  }
  return tokens;
};

const joinTokenizedWords = (tokens: string[]) => {
  let joined_tokens = "";
  for (const token of tokens) {
    if (!(token in puncs)) {
      joined_tokens += token;
    }
  }
  return joined_tokens;
};

export type TextViewProps = {
  document?: Document;
  analyzeDocument: Document | undefined;
};

export const TextViewTypes = [
  "raw",
  "difficulty",
  "readability",
  "diversity",
] as const;

export type TextViewType = (typeof TextViewTypes)[number];

export const TextView = ({ document, analyzeDocument }: TextViewProps) => {
  const { windowDifficulties } = useContext(WindowDifficultiesContext);
  const { selectedDocuments } = useContext(SelectedDocumentsContext);

  const [tokens, setTokens] = useState(word_tokenize(analyzeDocument?.text));
  const [selectedTextView, setSelectedTextView] = useState<TextViewType>("raw");
  useEffect(() => {
    setTokens(word_tokenize(analyzeDocument?.text));
  }, [analyzeDocument?.text]);
  return (
    <div className="flex h-80 w-full  flex-col items-center justify-center">
      <div className="flex h-16 w-full rounded-t-md bg-gray-700 text-gray-300">
        {TextViewTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              setSelectedTextView(type);
            }}
            className={`
              ${
                selectedTextView === type
                  ? "bg-sky-500 text-gray-700 ring-2 ring-slate-500"
                  : "bg-gray-600 text-gray-400"
              }
              m-2 flex-1 rounded-md p-2 font-bold`}
          >
            {type.slice(0, 1).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div
        className="
      flex h-full w-full
      flex-wrap
      overflow-y-scroll
      rounded-b-md border  border-slate-600"
      >
        {tokens.map((token, index) => (
          <TokenView key={index} token={token} heatMapValue={0} />
        ))}
        {/* <div className="w-full border-t border-gray-600"></div> */}
      </div>
    </div>
  );
};

const valueToHeatmap = (value: number) => {
  // Ensure value is between 0 and 1
  const adjustedValue = Math.min(Math.max(value, 0), 1);

  // Map the value to an index between 0 and 20
  const index = Math.floor(adjustedValue * 20);

  // Define color classes for each step
  const colorClasses = [
    "bg-green-800",
    "bg-green-700",
    "bg-green-600",
    "bg-green-500",
    "bg-green-400",
    "bg-green-300",
    "bg-yellow-700",
    "bg-yellow-600",
    "bg-yellow-500",
    "bg-yellow-400",
    "bg-yellow-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-red-300",
    "bg-red-400",
    "bg-red-500",
    "bg-red-600",
    "bg-red-700",
    "bg-red-800",
  ];

  return colorClasses[index] ?? "";
};
export type TokenViewProps = {
  token: string;
  heatMapValue: number;
};

export const TokenView = ({ token, heatMapValue }: TokenViewProps) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <motion.div
      onClick={() => {
        setShowMenu((prev) => !prev);
      }}
      // onMouseLeave={() => {
      //   setShowMenu(false);
      // }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative h-fit w-fit cursor-pointer p-1 font-semibold text-slate-400 transition hover:scale-105 hover:text-slate-500`}
    >
      {token}
      <TokenMenu showMenu={showMenu} />
    </motion.div>
  );
};
export type TokenMenuProps = {
  showMenu: boolean;
};
export function TokenMenu({ showMenu }: TokenMenuProps) {
  return (
    <AnimatePresence>
      {showMenu && (
        // <div className="fixed inset-0 z-50 h-screen w-screen bg-black opacity-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            zIndex: 100,
          }}
          className=" fixed   h-32 w-32
          -translate-y-36 translate-x-7 overflow-y-scroll rounded-md
          border border-slate-600
          bg-white will-change-auto"
        ></motion.div>
        // </div>
      )}
    </AnimatePresence>
  );
}
