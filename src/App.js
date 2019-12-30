import React, { useState } from "react";
import uuidv4 from "uuid/v4";
import produce from "immer";
import queryString from "query-string";

import ConnectedInputs from "./components/molecules/connectedInputs";
import EntryInput from "./components/atoms/entryInput";

const App = () => {
  const [linkValue, setlLinkValue] = useState("");
  const [submittionValue, setSubmittionValue] = useState("6");
  const [formValue, setFormValue] = useState([
    {
      id: uuidv4(),
      entryValue: "",
      value: ""
    }
  ]);

  const entryInputs = formValue.map((item, key) => (
    <ConnectedInputs
      key={item.id}
      item={item}
      number={key}
      onChangeEntry={e => {
        const value = e.target.value;
        setFormValue(currentFormValues =>
          produce(currentFormValues, v => {
            v[key].entryValue = value;
          })
        );
      }}
      onChangeValue={e => {
        const value = e.target.value;
        setFormValue(currentFormValues =>
          produce(currentFormValues, v => {
            v[key].value = value;
          })
        );
      }}
      isDisabled={formValue.length === 1}
      onRemove={() => {
        if (formValue.length > 1) {
          setFormValue(currentForm =>
            currentForm.filter(({ id }) => id !== item.id)
          );
        }
      }}
    />
  ));

  return (
    <div className="container mx-auto px-6 mb-10">
      <div className="w-full my-6">
        <h1 className="text-5xl antialiased text-center">
          Google form submitter
        </h1>
        <h2 className="text-1xl antialiased my-5">
          Works only with Google Forms which have multiple submisions allowed.
        </h2>
      </div>
      <form
        className="w-full"
        onSubmit={e => {
          e.preventDefault();
          let objectWithValues = {};

          formValue.forEach(({ entryValue, value }) => {
            objectWithValues = {
              ...objectWithValues,
              [entryValue]: value
            };
          });

          const query = queryString.stringify(objectWithValues);
          const spreadsheetUrl = `https://docs.google.com/forms/${linkValue}/formResponse?${query}&submit=Submit`;

          fetch(spreadsheetUrl)
            .then(response => response.json())
            .then(data => {
              console.log("Success:", data);
            })
            .catch(error => {
              console.error("Error:", error);
            });
        }}
      >
        <div className="flex flex-wrap -mx-3 mb-5">
          <EntryInput
            name="Link"
            value={linkValue}
            onChange={e => setlLinkValue(e.target.value)}
            labelValue="Link <URL>"
            fullWidth
            placeholder="https://docs.google.com/forms/<URL>/viewform?usp=sf_link"
          />
        </div>
        <div className="flex flex-wrap -mx-3 mb-5">
          <EntryInput
            name="Link"
            value={submittionValue}
            onChange={({ target }) => {
              const pattern = /^[1-9]$/;
              const currentValue = target.value;

              if (currentValue === "" || pattern.test(currentValue)) {
                setSubmittionValue(currentValue);
              }
            }}
            labelValue="Number of submittions from range (1-10)"
            fullWidth
            placeholder="4"
          />
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">{entryInputs}</div>
        <div className="md:flex md:items-center">
          <div className="md:w-full">
            <button
              className="shadow bg-purple-400 hover:bg-purple-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mr-4"
              type="button"
              onClick={() => {
                setFormValue(currentForm => [
                  ...currentForm,
                  {
                    id: uuidv4(),
                    entryValue: "",
                    value: ""
                  }
                ]);
              }}
            >
              Add input fields
            </button>
            <button
              className="shadow bg-purple-800 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default App;
