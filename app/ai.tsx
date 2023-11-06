"use client";

import {
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
  memo,
  useRef,
} from "react";
import Form from "./form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const inputInitValue = "";

const Chat = memo(({ data }: any) => {
  return (
    <>
      {data?.map((d, index) => (
        <div
          key={`chat-${index}`}
          className="tracking-tight mt-6 flex items-start ring-1 ring-slate-700/10 p-4 shadow-sm bg-white rounded-lg"
        >
          <div className="text-blue-500 flex flex-shrink-0 items-center justify-center mr-4 w-9 h-9 ring-1 ring-slate-700/10 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <Markdown
              children={d.message.content}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <SyntaxHighlighter
                      {...rest}
                      children={String(children).replace(/\n$/, "")}
                      style={coldarkDark}
                      language={match[1]}
                      PreTag="div"
                      wrapLongLines
                    />
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
});

function AI() {
  const [data, setData] = useState<any[]>([]);
  const inputEl = useRef(null);

  const handleSummitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const inputValue = inputEl?.current?.value;
      e.target.reset();

      setData((prevData) => [
        ...prevData,
        { message: { role: "user", content: inputValue } },
      ]);

      const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const stream = response.body;
      const reader = stream!.getReader();

      let result = "";

      while (true) {
        const { done, value } = await reader!.read();

        if (done) {
          break;
        }

        // Process the streamed data, e.g., concatenate to result
        result += new TextDecoder().decode(value);

        // You can also update state or perform other actions with the data
        // setData([...data, ...JSON.parse(result)]);
      }

      // Once the stream ends, you can set the final data in the state
      setData((prevData) => [...prevData, ...JSON.parse(result)]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className="container pb-[140px]">
        <Chat data={data} />
      </div>

      {/* <Form
        handleSummitForm={handleSummitForm}
        handleInputChange={handleInputChange}
        formData={inputData}
      /> */}

      <div className="fixed w-full bottom-4">
        <form
          onSubmit={handleSummitForm}
          className="p-8 w-full container ring-1 ring-slate-700/10 rounded-3xl shadow-md bg-white"
        >
          <div className="flex w-full items-center space-x-2">
            <div className="relative w-full flex items-center">
              <input
                ref={inputEl}
                className="ring-1 w-full ring-slate-700/10 shadow-md pr-16 pl-3 py-2 rounded-lg"
                type="text"
                placeholder="Send a message"
              />
              <div className="absolute flex items-center right-0 pt-2 pr-2 pb-2">
                <kbd className="ring-1 ring-slate-700/10 text-sm leading-6 px-2 rounded text-slate-400">
                  Enter
                </kbd>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AI;
