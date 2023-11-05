"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Form({ handleSummitForm, handleInputChange, inputData }: any) {
  return (
    <form
      onSubmit={handleSummitForm}
      className="fixed bottom-0 py-8 w-full container"
    >
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Say somethings"
          value={inputData}
          onChange={handleInputChange}
        />
        <Button type="submit">Send</Button>
      </div>
    </form>
  );
}

export default Form;
