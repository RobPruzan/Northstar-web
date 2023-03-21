import { type Document } from "@prisma/client";
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
  document: Document;
};

export const TextView = ({ document }: TextViewProps) => {
  const { windowDifficulties } = useContext(WindowDifficultiesContext);
  const { selectedDocuments } = useContext(SelectedDocumentsContext);

  // const { selectedDocuments } = useContext(SelectedDocumentsContext);
  // const text = selectedDocuments[0]?.text;
  // const []
  // const tempText =
  //   "Hello, my name is John. I am a student at the University of Washington. I am studying computer science. I am also a TA for";
  // const tokens = word_tokenize(tempText);
  const [tokens, setTokens] = useState(word_tokenize(document.text));

  const [currentWord, setCurrentWord] = useState("");
  // you're gonna need to tokenize the text
  // flex flex wrap the tokenized text, which will be in divs
  // each word should probably be it's own component, can just be a div
  console.log("selected doc!!!", document);
  console.log("tokens", tokens);
  useEffect(() => {
    setTokens(word_tokenize(document.text));
  }, [document.text]);
  return (
    <div
      // onBlur={(e) => {
      //   const newString = joinTokenizedWords([...tokens, currentWord]);
      //   e.target.innerText = newString;
      //   setTokens(word_tokenize(newString));
      // }}
      // onInput={(e) => {
      //   e.preventDefault();
      //   console.log(
      //     tokens

      //     // setTokens(word_tokenize((e.target as HTMLDivElement).innerText))
      //   );
      //   if ((e.nativeEvent as InputEvent | null)?.data === " ") {
      //     // setTokens((prev) => [...prev, currentWord]);
      //     setCurrentWord("");
      //   } else {
      //     setCurrentWord((prevWord) => {
      //       // setTokens((prevTokens) => [
      //       //   ...prevTokens,
      //       //   ...word_tokenize(prevWord),
      //       // ]);
      //       return (
      //         prevWord + ((e.nativeEvent as InputEvent | null)?.data ?? "")
      //       );
      //     });
      //   }
      //   // cancel event

      //   // setTokens(word_tokenize(e,target.innerText));
      // }}

      className="flex 
      flex-wrap overflow-y-scroll
      rounded-md
      border border-slate-600  bg-slate-800"
    >
      {/* INSTEAD, split up everything into their own letters
          letters will be joined locally by spaces/punctuation
          we can have some util function create a map of words in the form of
          {index: word} e.g {0: "Hello", 1: "Hello", 2: "Hello", 3: "my", 4: "my" ...}
          we can also store meta data form the word it's mapped to 
          e.g {0: {word: "Hello", diff
          iculty: 0.5, ...}}
          then we can make 
      */}
      {/* {windowDifficulties[0]
        ? windowDifficulties[0].interpretation.map(
            (token, index) =>
              index != tokens.length - 1 && (
                <TokenView
                  key={index}
                  token={token[0]}
                  heatMapValue={token[1]}
                />
              )
          )
        : tokens.map((token, index) => (
            <TokenView key={index} token={token} heatMapValue={0} />
          ))} */}
      {tokens.map((token, index) => (
        <TokenView key={index} token={token} heatMapValue={0} />
      ))}
      <div className="w-full border-t border-gray-600"></div>
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
  return (
    <div
      className={`
      ${valueToHeatmap(heatMapValue)}
  w-fit
 cursor-pointer p-1 font-semibold text-slate-400 transition hover:scale-105 hover:text-slate-500`}
    >
      {token}
    </div>
  );
};
