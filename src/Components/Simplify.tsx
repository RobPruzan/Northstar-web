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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Please enter a medical document you would like to be simplified",
    },
  ]);
  const [prompt, setPrompt] = useState(
    "Simplify the following medical text to the best of your ability:\n\n"
  );

  const messageRef = useRef<HTMLDivElement>(null);
  const medicalWords = useRef<MedicalWord[]>([]);
  const difficultyRetries = useRef(0);
  const [topWords, setTopWords] = useState("0.02");
  const definitionsRetrieved = useRef(new Set<string>());

  const [currentUserMessage, setCurrentUserMessage] =
    useState<Message>(DEFAULT_MESSAGE);

  const [threshold, setThreshold] = useState(6.5);

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

      const difficultyResponse = z
        .object({
          difficulty: z.number(),
        })
        .parse(res);

      if (
        difficultyResponse.difficulty > threshold &&
        difficultyRetries.current < 3
      ) {
        await Promise.reject({
          error: "Document is too difficult",
          difficulty: difficultyResponse,
          text,
        });
      }

      return z
        .object({
          difficulty: z.number(),
          gptOutput: z.string(),
        })
        .parse({
          difficulty: difficultyResponse.difficulty,
          gptOutput: text,
        });
    },
    onError: (error, ctx) => {
      console.log("got too high of a difficulty, got:", error);
      llmMutation.mutate(ctx);
      difficultyRetries.current++;
    },
    onSuccess: (data) => {
      console.log(
        "evaluated difficulty, got valid difficulty of:",
        data.difficulty
      );
      const newMessage: Message = {
        role: "bot",
        text: data.gptOutput,
      };

      setMessages((messages) => [...messages, newMessage]);
    },
  });

  const lastUserMessage = [...messages].find(
    (message) => message.role === "user"
  );

  const llmMutation = useMutation({
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
      console.log("Recieving llm response, evaluating difficulty", data);
      difficultyMutation.mutate(data.response);
    },
  });

  const baseWordDifficultyMutation = useMutation({
    mutationFn: async (words: string[]) => {
      const loadingMessage: Message = {
        role: "bot",
        text: "Finding difficult words in the given document",
      };
      setMessages((messages) => [...messages, loadingMessage]);
      const res = await (
        await fetch(wordDifficultyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            words: words.filter((word) => !word.includes("\n")),
          }),
        })
      ).json();

      return z
        .array(
          z.object({
            word: z.string(),
            difficulty: z.number(),
          })
        )
        .parse(res);
    },
  });

  const wordsDifficultyMutation = useMutation({
    mutationFn: async (words: string[]) => {
      const loadingMessage: Message = {
        role: "bot",
        text: "Finding difficult words in the given document",
      };
      setMessages((messages) => [...messages, loadingMessage]);
      const res = await (
        await fetch(wordDifficultyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            words: words.filter((word) => !word.includes("\n")),
          }),
        })
      ).json();

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
      console.log("retrieved difficult words", data);
      const tokenAmount = ctxParams.length;

      const topDiffWords = getTopNWords(
        data,
        Math.ceil(tokenAmount * parseFloat(topWords))
      );
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
  type DefinitionWord = {
    word: string;
    definition: string;
    senseScore: number;
  };
  // mutation of mutations for getting definitions given array of words
  // this function recursively looks if theres any difficult words in word definitions, and if there is, we insert the definition into the array of words to be looked up
  const recursiveDefinitionSimplificationMutation = useMutation({
    //   // we will be given medical words and the validated definition, and we need to return the medical words with the definition recursively inserted into the definition array

    mutationFn: async (params: { data: DefinitionWord[]; retrys: number }) => {
      const { data, retrys } = params;

      const botMessage: Message = {
        role: "bot",
        text: "Simplifying definitions recursively",
      };
      setMessages((messages) => [...messages, botMessage]);
      const newWordData: DefinitionWord[] = [];
      let hasAddedNewToken = false;

      for (const wordData of data) {
        const { word, definition, senseScore } = wordData;
        const definitionTokens = definition.split(" ");

        const newTokens: string[] = [];
        const diffArr = await baseWordDifficultyMutation.mutateAsync(
          removeStopWordsAndPunctuation(definitionTokens)
        );

        const diffTopWords = getTopNWords(diffArr, Math.ceil(1));
        console.log("TOKENS OF A DEFINITION", definitionTokens);
        for (const word of definitionTokens) {
          if (diffTopWords.includes(word)) {
            const insertToken = await baseDefinitionMutation.mutateAsync({
              word,
            });
            if (!insertToken) {
              newTokens.push(word);
              continue;
            }

            const newDefinition = definition
              .split(" ")
              .map((w) => {
                const medWord = w.toLowerCase().includes(word.toLowerCase());

                if (medWord) {
                  return `@${w}`;
                } else {
                  return w;
                }
              })
              .join(" ");

            const validated = await baseWordSenseMutation.mutateAsync({
              words: [insertToken],
              context: newDefinition,
            });

            const takenDefinition = validated.find(
              (word) => word.senseScore > 25
            );
            newTokens.push(word);
            if (takenDefinition) {
              newTokens.push("(");
              newTokens.push(takenDefinition.definition);
              newTokens.push(")");
              hasAddedNewToken = true;
            }
          } else {
            newTokens.push(word);
          }
        }
        console.log("TOKENS AFTER ITERAWTING OVER BASE TOKENS", newTokens);

        newWordData.push({
          definition: newTokens.join(" "),
          senseScore,
          word,
        });
      }

      if (hasAddedNewToken && retrys < 3) {
        console.log("RUNNING THE RECURSSIVE THINGY", newWordData),
          "should be retry",
          retrys;
        await recursiveDefinitionSimplificationMutation.mutateAsync({
          data: newWordData,
          retrys: retrys + 1,
        });
      }
      return newWordData;
    },
    onSuccess: (data) => {
      console.log("recursive definition simplification", data);
    },

    // def recursive_definition(wordData, retrys=0):
    // new_word_data = []
    // has_added_new_token = False
    // for wordData in data:
    //   word = wordData["word"]
    //   definition = wordData["definition"]
    //   senseScore = wordData["senseScore"]

    //   definition_tokens = word_tokenize(definition)
    //   new_tokens = []
    //   for word in definition_tokens:
    //     diff = difficulty(word)
    //     if diff > 7:
    //       insert_token = get_definition(word)
    //       new_tokens.append("(")
    //       new_tokens.append(insert_token)
    //       new_tokens.append(")")
    //       has_added_new_token = True
    //     else:
    //       new_tokens.append(word)
    //   new_word_data.append(
    //           {
    //       "word":word,
    //       "definition": ' '.join(new_tokens),
    //       "senseScore": senseScore
    //   }
    //   )
    // if has_added_new_token or retrys > 5:

    //   print(new_word_data)
    //   recursive_definition(new_word_data, retrys + 1)
    // else:
    //   return new_word_data
  });

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
        if (definitionsRetrieved.current.has(word)) {
          continue;
        }
        const defMutationRes = await definitionMutation.mutateAsync({
          word,
        });
        defMutationRes && medWords.push(defMutationRes);
      }

      return medWords;
    },
    onSuccess: (data, ctxParams) => {
      ctxParams.forEach((word) => {
        definitionsRetrieved.current.add(word);
      });
      console.log("Got definitions for difficult words", data);
      const botMessage: Message = {
        role: "bot",
        text: `Completed getting definitions for difficult medical terminology, retrieved the following definitions: \n${data
          .map((d) => d.definitions.join(" | "))
          .join("\n")}`,
      };

      setMessages((messages) => [...messages, botMessage]);

      // insert @ before each word in message if its one of the medical words
      const newMessage = lastUserMessage?.text
        .split(" ")
        .map((word) => {
          const medWord = medicalWords.current.find(
            (medWord) => medWord.word.toLowerCase() === word.toLowerCase()
          );
          if (medWord) {
            return `@${word}`;
          } else {
            return word;
          }
        })
        .join(" ");

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

  const baseDefinitionMutation = useMutation({
    mutationFn: async ({ word }: { word: string }) => {
      if (definitionsRetrieved.current.has(word)) {
        return;
      }
      const res = await (
        await fetch(getMerriamUrl(word), {
          method: "POST",
          body: JSON.stringify({ word }),
        })
      ).json();

      const apiRes = res as ApiResponse;

      const filteredRes = apiRes.filter(
        (def) =>
          typeof def === "object" &&
          "shortdef" in def &&
          def.shortdef.length > 0
      );

      const definitions = filteredRes.map((def) => def.shortdef[0]);

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
    onSuccess: (data, ctx) => {
      definitionsRetrieved.current.add(ctx.word);
    },
  });

  const definitionMutation = useMutation({
    mutationFn: async ({ word }: { word: string }) => {
      if (definitionsRetrieved.current.has(word)) {
        return;
      }
      const res = await (
        await fetch(getMerriamUrl(word), {
          method: "POST",
          body: JSON.stringify({ word }),
        })
      ).json();

      const apiRes = res as ApiResponse;

      const filteredRes = apiRes.filter(
        (def) =>
          typeof def === "object" &&
          "shortdef" in def &&
          def.shortdef.length > 0
      );

      const definitions = filteredRes.map((def) => def.shortdef[0]);

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
    onSuccess: (data, ctx) => {
      if (!data) {
        return;
      }
      medicalWords.current = [...medicalWords.current, data];
      definitionsRetrieved.current.add(ctx.word);
    },
    onError: (error, ctx) => {
      console.log("error getting definition", error, ctx);
    },
  });
  // TODO copy pasta code get rid of this
  const baseWordSenseMutation = useMutation({
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

      const pls = res as Sense;

      console.log("actual response from wordsense endpoiint ", pls);

      const filteredDefinitionsSchema = z.object({
        word: z.string(),
        definition: z.string(),
        senseScore: z.number(),
      });

      type FilteredDefinition = z.infer<typeof filteredDefinitionsSchema>;
      const senseFilteredDefinitions: FilteredDefinition[] = [];

      pls.forEach((medicalWord) => {
        const newDefinitions = medicalWord.filter((def) => {
          const [definition, word] = def[0] as unknown as [string, string];
          if ((def as [unknown, number])[1] > 50) {
            senseFilteredDefinitions.push({
              word: word.trim(),
              definition,
              senseScore: (def as [unknown, number])[1],
            });
            return (def as [unknown, number])[1] > 50;
          }
        });

        return newDefinitions;
      });
      senseFilteredDefinitions.sort((a, b) => b.senseScore - a.senseScore);

      const wordsWithDefinitions = new Set();

      return senseFilteredDefinitions.filter((def) => {
        if (wordsWithDefinitions.has(def.word.trim())) {
          return false;
        }
        wordsWithDefinitions.add(def.word.trim());
        return true;
      });
    },
  });

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

      const pls = res as Sense;

      const filteredDefinitionsSchema = z.object({
        word: z.string(),
        definition: z.string(),
        senseScore: z.number(),
      });

      type FilteredDefinition = z.infer<typeof filteredDefinitionsSchema>;
      const senseFilteredDefinitions: FilteredDefinition[] = [];

      pls.forEach((medicalWord) => {
        const newDefinitions = medicalWord.filter((def) => {
          const [definition, word] = def[0] as unknown as [string, string];
          if ((def as [unknown, number])[1] > 50) {
            senseFilteredDefinitions.push({
              word: word.trim(),
              definition,
              senseScore: (def as [unknown, number])[1],
            });
            return (def as [unknown, number])[1] > 50;
          }
        });

        return newDefinitions;
      });
      senseFilteredDefinitions.sort((a, b) => b.senseScore - a.senseScore);

      const wordsWithDefinitions = new Set();

      return senseFilteredDefinitions.filter((def) => {
        if (wordsWithDefinitions.has(def.word.trim())) {
          return false;
        }
        wordsWithDefinitions.add(def.word.trim());
        return true;
      });
    },

    onSuccess: async (data) => {
      console.log("validated definitions left over:", data);
      const betterDefinitions =
        await recursiveDefinitionSimplificationMutation.mutateAsync({
          data,
          retrys: 0,
        });

      const botMessage: Message = {
        role: "bot",
        text: `Completed validating the definitions for difficult medical terminology, validated the following definitions: \n${betterDefinitions.join(
          "\n"
        )}`,
      };

      setMessages((messages) => [...messages, botMessage]);

      let newMessage = "";
      console.log("better definitions from recursivness", betterDefinitions);
      console.log(
        "last user message which we will insert definitions into",
        lastUserMessage
      );
      lastUserMessage?.text.split(" ").map((word) => {
        const found = betterDefinitions.find((d) =>
          word.trim().toLowerCase().includes(d.word.toLowerCase().trim())
        );
        if (found) {
          newMessage += `${word} (${found.definition}) `;
        } else {
          newMessage += `${word} `;
        }
      });
      // });

      const fullPrompt = prompt + newMessage;

      console.log("Prompt going to the llm", fullPrompt);

      llmMutation.mutate(fullPrompt);
    },
  });

  const loadingState = calculationTasks.map(({ completed, goal }) => {
    switch (goal) {
      // case "Getting definitions for difficult medical terminology":
      //   return {completed: }

      case "Loading Summarization":
        return { goal, completed: llmMutation.isSuccess };
      case "Validating Summarization":
        return { goal, completed: wordsDifficultyMutation.isSuccess };
      case "Getting definitions for difficult medical terminology":
        return { goal, completed: definitionMutation.isSuccess };
    }
  });

  const handleStart = () => {
    console.log("starting");
    currentUserMessage && setMessages((prev) => [...prev, currentUserMessage]);

    console.log("Extracting difficulty words", currentUserMessage.text);
    wordsDifficultyMutation.mutate(
      removeStopWordsAndPunctuation(
        word_tokenize(currentUserMessage.text).map((token) =>
          token.trim().toLowerCase()
        )
      )
    );

    setCurrentUserMessage(DEFAULT_MESSAGE);
  };

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
    <div className="fancy-content  flex h-full w-screen  items-center justify-evenly bg-zinc-900 p-4 opacity-70">
      <div className="  bg-blur flex h-[800px] w-4/6 flex-col items-center justify-evenly rounded-lg rounded-b-none shadow-2xl">
        <div
          ref={messageRef}
          className="fancy-content flex h-full w-full flex-col overflow-y-scroll rounded-sm rounded-b-none border-2 border-slate-700 bg-zinc-900 px-4 "
        >
          {messages.map((message) =>
            message.role === "user" ? (
              <div
                key={message.text}
                className="mt-5  mb-10 flex w-full justify-end"
              >
                <div className="max-w-[50%] rounded-lg bg-sky-400 bg-opacity-60 p-3 font-medium text-gray-100 shadow-lg">
                  {message.text}
                </div>
              </div>
            ) : (
              <div
                key={message.text}
                className="mt-5 ml-7 mb-10 flex w-full max-w-[50%] justify-start"
              >
                <div className="rounded-lg bg-slate-700 bg-opacity-60 p-3 font-medium text-gray-100 shadow-lg">
                  {message.text}
                </div>
              </div>
            )
          )}
        </div>
        <div className="flex h-20 w-full items-center justify-around rounded-b-md border-x-2 border-b-2  border-slate-700 bg-zinc-800 bg-opacity-5 bg-gradient-to-b p-3 px-16">
          <textarea
            value={currentUserMessage?.text}
            onChange={(e) =>
              setCurrentUserMessage((prev) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            className=" h-full w-5/6 rounded-lg border-2 border-slate-500 bg-slate-900 bg-opacity-40 p-3 text-gray-200 outline-none ring-0 "
          />
          <button
            onClick={handleStart}
            className="b flex h-full w-20 items-center justify-center rounded-md border-2 border-slate-500 bg-slate-900 bg-opacity-40 p-2 shadow-lg  transition hover:scale-105"
          >
            {loadingState.every((state) => !state?.completed) ? (
              <BsSend size={25} className="fill-white" />
            ) : (
              <BsPlay className="animate-pulse fill-white" size={50} />
            )}
          </button>
        </div>
      </div>
      <div className="flex h-[800px] w-1/6 flex-col items-center rounded-sm border-2 border-slate-700 bg-zinc-900 p-4 shadow-lg">
        <select
          defaultValue={"GPT-3.5-Turbo"}
          className="w-full rounded-md bg-slate-700 bg-opacity-50 p-3 text-gray-100 shadow-md outline-none ring-0"
        >
          <option>GPT-3.5-turbo</option>
          <option>Chat-Doctor</option>
          <option>Flan-T5</option>
        </select>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-4 h-2/5 w-full rounded-md bg-slate-700 bg-opacity-50 p-3 text-gray-100 shadow-md outline-none ring-0"
        />
        <input
          value={topWords}
          onChange={(e) => setTopWords(e.target.value)}
          className="mt-4  w-full rounded-md bg-slate-700 bg-opacity-50 p-3 text-gray-100 shadow-md outline-none ring-0"
        />
      </div>
    </div>
  );
};

export default Simplify;

type DefinitionProps = {
  definitions: {
    word: string;
    definition: string;
  };
};

const DefinitionMessage = ({ definitions }: DefinitionProps) => {
  return <div>definitions!</div>;
};
