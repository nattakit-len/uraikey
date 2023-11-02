"use client";

function Form({ handleSummitForm, handleInputChange, inputData }: any) {
  const handleKeyDown = (e: any) => {
    if (e.code === "Enter") {
      e.preventDefault();
      handleSummitForm();
    }
  };
  return (
    <form onSubmit={handleSummitForm}>
      <input
        type="text"
        name="dataField"
        value={inputData}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button>Send</button>
    </form>
  );
}

export default Form;
