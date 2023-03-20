export const word_tokenize = (text: string | undefined) => {
  if (!text) return [];
  let temp_token = "";
  const tokens = [];
  for (const char of text) {
    if (
      char === " " ||
      char === "." ||
      char === "," ||
      char === "?" ||
      char === "!"
    ) {
      tokens.push(temp_token);
      temp_token = "";
    }
    temp_token += char;
  }
  return tokens;
};

const TextView = () => {
  // const { selectedDocuments } = useContext(SelectedDocumentsContext);
  // const text = selectedDocuments[0]?.text;
  const tempText =
    "Hello, my name is John. I am a student at the University of Washington. I am studying computer science. I am also a TA for";
  const tokens = word_tokenize(tempText);
  // you're gonna need to tokenize the text
  // flex flex wrap the tokenized text, which will be in divs
  // each word should probably be it's own component, can just be a div
  return (
    <div className="flex flex-wrap overflow-y-scroll  rounded-md">
      {tokens.map((token, index) => {
        return <TokenView key={index} token={token} />;
      })}
    </div>
  );
};

export default TextView;

export type TokenViewProps = {
  token: string;
};

export const TokenView = ({ token }: TokenViewProps) => {
  return (
    <div
      className="
  w-fit
 cursor-pointer p-1 text-gray-300 transition hover:scale-105 hover:text-gray-100"
    >
      {token}
    </div>
  );
};
