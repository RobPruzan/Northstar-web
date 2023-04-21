import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { BsPlay, BsSend } from "react-icons/bs";
import { z } from "zod";
import { word_tokenize } from "./ViewHelpers/TextView";
import { ApiResponse, ApiResponseSchema } from "lib/merriamUtils";

type Roles = "user" | "bot";

type Message = {
  role: Roles;

  text: string;
};

type MedicalWord = {
  word: string;

  definitions: string[];
};

interface WordDifficulty {
  word: string;
  difficulty: number;
}

[[]];

// its an array containing arrays

// The inner array contains a tuple of size 2, call it A

// A has a tuple of size 2, call it B, and a number

// B has a tuple of size 2, call it C, and a number

// C is a tuple of 2 strings

const innerArraySchema = z.union([z.array(z.number()), z.number()]);

const senseSchema = z.array(z.array(z.array(innerArraySchema)));

type Sense = z.infer<typeof senseSchema>;

let l: Sense;

function removeStopWordsAndPunctuation(tokens: string[]): string[] {
  const stopWords = [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "of",
    "with",
    "is",
    "then",
    "each",
    "every",
    "for",
    "nor",
    "on",
    "at",
    "to",
    "from",
    "by",
    "in",
    "out",
    "up",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "down",
    "off",
    "over",
    "under",
    "be",
    "am",
    "is",
    "are",
    "was",
    "were",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "shall",
    "should",
    "can",
    "could",
    "may",
    "might",
    "must",
    "need",
    "ought",
    "dare",
    "used",
    "let",
    "any",
    "some",
    "every",
    "no",
    "none",
    "neither",
    "either",
    "much",
    "many",
    "more",
    "most",
    "such",
    "what",
    "whatever",
    "which",
    "whichever",
    "who",
    "whoever",
    "whom",
    "whomever",
    "this",
    "that",
    "these",
    "those",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "same",
    "other",
    "another",
    "suchlike",
    "so",
    "as",
    "like",
    "unlike",
    "than",
    "whether",
    "although",
    "though",
    "even",
    "if",
    "unless",
    "until",
    "while",
    "only",
    "just",
    "mainly",
    "mostly",
    "either",
    "neither",
    "both",
    "and/or",
    "not",
    "but",
    "rather",
    "instead",
    "yet",
    "so",
    "too",
    "also",
    "indeed",
    "further",
    "moreover",
    "besides",
    "however",
    "nevertheless",
    "nonetheless",
    "therefore",
    "thus",
    "hence",
    "accordingly",
    "consequently",
    "otherwise",
    "meanwhile",
    "still",
    "anyway",
    "anyhow",
    "anywhere",
    "everywhere",
    "somewhere",
    "nowhere",
    "here",
    "there",
    "why",
    "when",
    "where",
    "how",
    "what",
    "who",
    "which",
    "whence",
    "whereby",
    "wherein",
    "whereas",
    "howsoever",
    "wheresoever",
    "whensoever",
    "whatsoever",
    "whosoever",
    "whomsoever",
    "thence",
    "therefore",
    "hereby",
    "herein",
    "hereto",
    "hereupon",
    "forthwith",
    "hitherto",
    "thither",
    "whereupon",
    "whereunto",
    "whereafter",
    "whereby",
    "wherein",
    "whereas",
    "whereof",
  ];

  const punctuation = [
    ".",
    ",",
    ";",
    ":",
    "!",
    "?",
    "-",
    "--",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "'",
    '"',
    "/",
    "\\",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "_",
    "+",
    "=",
    "`",
    "~",
    "<",
    ">",
    "|",
  ];

  const stopWordsAndPunctuation = tokens.filter((token) => {
    return !(
      stopWords.includes(token.toLowerCase()) ||
      punctuation.includes(token) ||
      token.length <= 2
    );
  });

  return stopWordsAndPunctuation;
}

function getTopNWords(words: WordDifficulty[], n: number): string[] {
  // Sort the list of words by difficulty score in descending order
  const sortedWords = words.sort((a, b) => b.difficulty - a.difficulty);

  // Take the first N words from the sorted list
  const topNWords = sortedWords.slice(0, n);

  // Return an array of the top N words
  return topNWords.map((word) => word.word);
}

const DEFAULT_MESSAGE: Message = {
  role: "user",
  text: "",
};

const goals = [
  "Identifying difficult medical terminology",
  "Getting definitions for difficult medical terminology",
  "Simplifying definitions",
  "Validating Summarization",
  "Loading Summarization",
] as const;
type Goals = (typeof goals)[number];

type Task = {
  completed: false;
  goal: Goals;
};

const calculationTasks: Task[] = goals.map((goal) => ({
  goal,
  completed: false,
}));

const MERRIAM_WEBSTER_API_KEY = z
  .string()
  .parse(process.env["NEXT_PUBLIC_MERRIAM_WEBSTER_API_KEY"]);
export function getMerriamUrl(searchTerm: string) {
  return `https://www.dictionaryapi.com/api/v3/references/medical/json/${searchTerm}?key=${MERRIAM_WEBSTER_API_KEY}`;
}

const baseUrl = z.string().parse(process.env["NEXT_PUBLIC_MODEL_ENDPOINT_URL"]);

const difficultyUrl = `${baseUrl}/difficulty`;
const gptUrl = `${baseUrl}/gpt`;
const wordDifficultyUrl = `${baseUrl}/word_difficulty`;
const wordSenseUrl = `${baseUrl}/word_sense`;
const getTokensUrl = `${baseUrl}/get_tokens`;

const Simplify = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);
  const medicalWords = useRef<MedicalWord[]>([]);

  const [currentUserMessage, setCurrentUserMessage] =
    useState<Message>(DEFAULT_MESSAGE);

  const difficultyMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await (
        await fetch(difficultyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        })
      ).json();

      return z.number().parse(res);
    },
  });

  const lsatUserMessage = [...messages].find(
    (message) => message.role === "user"
  );

  const gptMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const botMessage: Message = {
        role: "bot",
        text: "Generating simplification from Language Model",
      };

      setMessages((messages) => [...messages, botMessage]);

      const res = await (
        await fetch(gptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        })
      ).json();
      return z
        .object({
          response: z.string(),
        })
        .parse(res);
    },
    onSuccess: (data) => {
      const newMessage: Message = {
        role: "bot",
        text: data.response,
      };
      setMessages((messages) => [...messages, newMessage]);
    },
  });

  const wordsDifficultyMutation = useMutation({
    mutationFn: async (words: string[]) => {
      const loadingMessage: Message = {
        role: "bot",
        text: "Getting definitions for difficult medical terminology",
      };
      setMessages((messages) => [...messages, loadingMessage]);
      const res = await (
        await fetch(wordDifficultyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ words }),
        })
      ).json();
      console.log("the res of diff words", res);
      return z
        .array(
          z.object({
            word: z.string(),
            difficulty: z.number(),
          })
        )
        .parse(res);
    },
    onSuccess: (data, ctxParams) => {
      const tokenAmount = ctxParams.length;

      const topDiffWords = getTopNWords(data, Math.ceil(tokenAmount / 100));
      const completedMessgage: Message = {
        role: "bot",
        text: `Completed getting definitions for difficult medical terminology, found the following words to be difficult: \n${topDiffWords.join(
          "\n"
        )}`,
      };
      setMessages((messages) => [...messages, completedMessgage]);

      // insert @ before the top n words

      // partialMedWords.forEach(({ location, word }) => {
      //   definitionMutation.mutate({ word, location });
      // });
      definitionsMutation.mutate(topDiffWords);
    },
  });

  // mutation of mutations for getting definitions given array of words

  const definitionsMutation = useMutation({
    mutationFn: async (words: string[]) => {
      // words.forEach((word) => {
      //   definitionMutation.mutate({ word, location: 0 });
      // });

      const message: Message = {
        role: "bot",
        text: "Getting definitions for difficult medical terminology",
      };
      setMessages((messages) => [...messages, message]);

      const medWords: MedicalWord[] = [];

      for (const word of words) {
        const defMutationRes = await definitionMutation.mutateAsync({
          word,
        });
        medWords.push(defMutationRes);
      }

      return medWords;
    },
    onSuccess: (data, ctxParams) => {
      const botMessage: Message = {
        role: "bot",
        text: `Completed getting definitions for difficult medical terminology, retrieved the following definitions: \n${data
          .map((d) => d.definitions.join(" | "))
          .join("\n")}`,
      };

      setMessages((messages) => [...messages, botMessage]);

      // insert @ before each word in message if its one of the medical words
      const newMessage = lsatUserMessage?.text
        .split(" ")
        .map((word) => {
          const medWord = medicalWords.current.find(
            (medWord) => medWord.word.toLowerCase() === word.toLowerCase()
          );
          if (medWord) {
            return `@${word}`;
          }
          return word;
        })
        .join(" ");

      console.log("new message being sent out", newMessage);

      newMessage &&
        wordSenseMutation.mutate({
          context: newMessage,
          words: medicalWords.current,
        });
    },

    onError: (error) => {
      console.log("error getting definitions", error);
    },
  });

  const definitionMutation = useMutation({
    mutationFn: async ({ word }: { word: string }) => {
      const res = await (
        await fetch(getMerriamUrl(word), {
          method: "POST",
          body: JSON.stringify({ word }),
        })
      ).json();
      // definitely the wrong type
      // return z.string().parse(res);
      console.log("logging res", res, word);
      const apiRes = res as ApiResponse;

      const filteredRes = apiRes.filter(
        (def) =>
          typeof def === "object" &&
          "shortdef" in def &&
          def.shortdef.length > 0
      );

      const definitions = filteredRes.map((def) => def.shortdef[0]);
      console.log("merriam api response", apiRes);
      return z
        .object({
          word: z.string(),
          definitions: z.array(z.string()),
        })
        .parse({
          word,

          definitions: definitions,
        });
    },
    onSuccess: (data) => {
      console.log("la data!", data);
      console.log("Medical words after la data!", medicalWords);
      medicalWords.current = [...medicalWords.current, data];
    },
    onError: (error, ctx) => {
      console.log("error getting definition", error, ctx);
    },
  });

  // const dummyData = {
  //   context:
  //     "what a wonderful day today is. I will play so much baseball which is an awesome sport, which i will play with my friends. It's a very fun and happy sport",
  //   words: [
  //     // word: string;
  //     // location: number;
  //     // definitions: string[];
  //     {
  //       word: "baseball",
  //       location: 12,
  //       definitions: [
  //         "to be inlove with an alien species. It has been outlawed since the 1950s, and is punishable by death. It is an act of hatred",
  //         "A sport you play with a bat, gloves and a ball",
  //       ],
  //     },
  //   ],
  // };

  const wordSenseMutation = useMutation({
    mutationFn: async ({
      context,
      words,
    }: {
      context: string;
      words: MedicalWord[];
    }) => {
      const botMessage: Message = {
        role: "bot",
        text: "Validating the definitions for difficult medical terminology (this may take a while)",
      };

      setMessages((messages) => [...messages, botMessage]);

      const res = await (
        await fetch(wordSenseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context,
            words,
          }),
        })
      ).json();
      console.log(res);

      const pls = res as Sense;

      console.log("FOR THE LOVE OF GOD", pls);
      // i hate this so much
      // type FilteredDefinition = {
      //   word: string;
      //   definition: string;
      //   senseScore: number;
      // };
      const filteredDefinitionsSchema = z.object({
        word: z.string(),
        definition: z.string(),
        senseScore: z.number(),
      });

      type FilteredDefinition = z.infer<typeof filteredDefinitionsSchema>;
      const senseFilteredDefinitions: FilteredDefinition[] = [];
      const filtered = pls.map((medicalWord) => {
        console.log("inside the map", medicalWord);
        const newDefinitions = medicalWord.filter((def) => {
          console.log("whats beibg compared", def[1], def);
          const [definition, word] = def[0] as unknown as [string, string];
          if ((def as [any, number])[1] > 50) {
            senseFilteredDefinitions.push({
              word,
              definition,
              senseScore: (def as [any, number])[1],
            });
            return (def as [any, number])[1] > 50;
          }
        });
        // return z.array(filteredDefinitionsSchema).parse(newDefinitions);
        return newDefinitions;
      });
      console.log("filtered", senseFilteredDefinitions);

      return senseFilteredDefinitions;
    },

    onSuccess: (data) => {
      // insert definitions at the locations in the text
      const botMessage: Message = {
        role: "bot",
        text: `Completed validating the definitions for difficult medical terminology, validated the following definitions: \n${data.join(
          "\n"
        )}`,
      };

      setMessages((messages) => [...messages, botMessage]);

      console.log("the message", lsatUserMessage);
      let newMessage = "";
      data.map((def) => {
        lsatUserMessage?.text.split(" ").map((word) => {
          if (word === def.word) {
            newMessage += `${word} (${def.definition})`;
          } else {
            newMessage += `${word} `;
          }
        });
      });

      const prompt =
        "Simplify the following medical text to the best of your ability: \n\n" +
        newMessage;
      console.log("REQUESTING GPT", prompt);
      gptMutation.mutate(prompt);
    },
  });

  const loadingState = calculationTasks.map(({ completed, goal }) => {
    switch (goal) {
      // case "Getting definitions for difficult medical terminology":
      //   return {completed: }

      case "Loading Summarization":
        return { goal, completed: gptMutation.isSuccess };
      case "Validating Summarization":
        return { goal, completed: wordsDifficultyMutation.isSuccess };
      case "Getting definitions for difficult medical terminology":
        return { goal, completed: definitionMutation.isSuccess };
    }
  });

  const handleStart = () => {
    currentUserMessage && setMessages((prev) => [...prev, currentUserMessage]);

    // getTokensMutation.mutate(currentUserMessage.text);
    wordsDifficultyMutation.mutate(
      removeStopWordsAndPunctuation(
        word_tokenize(currentUserMessage.text).map((token) =>
          token.trim().toLowerCase()
        )
      )
    );

    setCurrentUserMessage(DEFAULT_MESSAGE);
  };

  // const getTokensMutation = useMutation({
  //   mutationFn: async (text: string) => {
  //     const res = await (
  //       await fetch(getTokensUrl, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           text,
  //         }),
  //       })
  //     ).json();

  //     console.log("res ahh", res);

  //     return z.array(z.string()).parse(res);
  //   },
  //   onSuccess: (data) => {
  //     wordsDifficultyMutation.mutate(
  //       removeStopWordsAndPunctuation(
  //         data.map((token) => token.trim().toLowerCase())
  //       )
  //     );
  //   },
  // });

  useEffect(() => {
    if (messageRef.current) {
      const lastChild = messageRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [messages, setMessages]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-evenly p-4">
      <div className="flex h-[600px] w-5/6 flex-col rounded-lg border-2 border-slate-500 bg-slate-700 px-6 py-2 shadow-xl">
        <div
          ref={messageRef}
          className="flex h-5/6 w-full flex-col overflow-y-scroll px-10"
        >
          {messages.map((message) =>
            message.role === "user" ? (
              <div
                key={message.text}
                className="mt-5  mb-10 flex w-full justify-end"
              >
                <div className="max-w-[50%] rounded-lg bg-slate-300 p-3 shadow-lg">
                  {message.text}
                </div>
              </div>
            ) : (
              <div
                key={message.text}
                className="mt-5 ml-7 mb-10 flex w-full max-w-[50%] justify-start"
              >
                <div className="rounded-lg bg-slate-400 p-3 shadow-lg">
                  {message.text}
                </div>
              </div>
            )
          )}
        </div>
        <div className="flex h-1/6 w-full justify-evenly">
          <textarea
            value={currentUserMessage?.text}
            onChange={(e) =>
              setCurrentUserMessage((prev) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            className=" h-4/5 w-5/6 rounded-lg bg-slate-900 p-3 text-gray-200 outline-none ring-0 ring-slate-500 focus:ring-1 "
          />
          {/* {loadingState.map((a) => a?.completed).join("| ")} */}
          <button
            onClick={
              handleStart
              // () =>
              // void (async () => {
              //   // wordSenseMutation.mutate();
              //   // definitionMutation.mutate({
              //   //   word: "headache",
              //   //   location: 12,
              //   // });
              //   const res = await wordsDifficultyMutation.mutateAsync([
              //     "headache",
              //     "baseball",
              //     "hello",
              //     "science",
              //   ]);

              //   console.log("diff words", res);
              //   console.log("func", getTopNWords(res, 2));
              // })()
            }
            className="flex h-4/5 w-20 items-center justify-center rounded-md bg-slate-900 p-2 shadow-lg  transition hover:scale-105"
          >
            {loadingState.every((state) => !state?.completed) ? (
              <BsSend size={25} className="fill-white" />
            ) : (
              <BsPlay className="animate-pulse fill-white" size={50} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simplify;
