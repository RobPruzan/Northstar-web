import { RadioGroup } from "@headlessui/react";
import { useState } from "react";

const modelCalculationType = [
  {
    name: "Max Power",

    description:
      "This will give the highest precision, but will take the longest to calculate.",
  },
  {
    name: "Average",

    description: "This will give a good balance between precision and speed.",
  },
  {
    name: "Chill",

    description:
      "This will give the lowest precision, but will be the fastest to calculate.",
  },
];

export default function SpeedRadioGroups() {
  const [selected, setSelected] = useState(modelCalculationType[0]);

  return (
    <div className=" w-full  py-12">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={setSelected}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
            {modelCalculationType.map((type) => (
              <RadioGroup.Option
                key={type.name}
                value={type}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                      : ""
                  }
                  ${
                    checked
                      ? "bg-slate-600 bg-opacity-75 text-gray-300"
                      : "bg-slate-800"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-gray-300"
                            }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-sky-100" : "text-gray-200"
                            }`}
                          >
                            <p className="text-sm">{type.description}</p>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
