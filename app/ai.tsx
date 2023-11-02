"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Form from "./form";

const initInputValue = "";

function AI() {
  const [data, setData] = useState<any>(null);
  const [inputData, setInputData] = useState<string>(initInputValue);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  const handleSummitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputData }),
      });
      setInputData(initInputValue);
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
        setData(JSON.parse(result));
      }

      // Once the stream ends, you can set the final data in the state
      setData(JSON.parse(result));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {};

    fetchData();
  }, []);

  return (
    <div>
      <div className="w-[980px] bg-black text-white ring-1 mb-4">
        {data ? data[0]?.message.content : "Waiting..."}
      </div>

      <Form
        handleSummitForm={handleSummitForm}
        handleInputChange={handleInputChange}
        formData={inputData}
      />
    </div>
  );
}

export default AI;
