import React, { useState } from "react";
import uuidv4 from "uuid/v4";
import produce from "immer";
import Modal from "react-responsive-modal";
import axios from "axios";

import messages from "./messages/messages";
import ConnectedInputs from "./components/molecules/connectedInputs";
import EntryInput from "./components/atoms/entryInput";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState(messages.sending);
  const [isResponseDone, setIsResponseDone] = useState(false);
  const [linkValue, setlLinkValue] = useState("");
  const [submittionValue, setSubmittionValue] = useState("7");
  const [formValue, setFormValue] = useState([
    {
      id: uuidv4(),
      entryValue: "",
      value: ""
    }
  ]);

  const onFormSubmit = e => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsResponseDone(false);
    setResponseMessage(messages.sending);

    const formData = new FormData();
    const spreadsheetUrl = `https://docs.google.com/forms/${linkValue}/formResponse`;
    const corsUrl = "https://cors-anywhere.herokuapp.com/";
    const promiseArray = [];

    formValue.forEach(({ entryValue, value }) => {
      formData.set(entryValue, value);
    });

    for (let i = 0; i < submittionValue; i++) {
      promiseArray.push(
        axios({
          method: "post",
          url: `${corsUrl}${spreadsheetUrl}`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" }
        })
          .then(response => Promise.resolve(response))
          .catch(error => Promise.reject(error.response))
      );
    }

    Promise.all(promiseArray)
      .then(() => {
        setIsResponseDone(true);
        setResponseMessage(messages.sendingCompleted);
      })
      .catch(() => {
        setIsResponseDone(true);
        setResponseMessage(messages.sendingError);
      });
  };

  const entryInputs = formValue.map((item, key) => (
    <ConnectedInputs
      key={item.id}
      item={item}
      number={key}
      onChangeEntry={e => {
        const { value } = e.target;
        setFormValue(currentFormValues =>
          produce(currentFormValues, v => {
            v[key].entryValue = value;
          })
        );
      }}
      onChangeValue={e => {
        const { value } = e.target;
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
    <>
      <Modal
        open={isModalOpen}
        center
        onClose={() => {
          if (isResponseDone) {
            setIsModalOpen(false);
          }
        }}
        closeOnEsc={isResponseDone}
        closeOnOverlayClick={isResponseDone}
      >
        <h2 className="text-2xl antialiased text-center m-10">
          {responseMessage}
        </h2>
      </Modal>
      <div className="container mx-auto px-6 mb-10">
        <div className="w-full my-6">
          <h1 className="text-5xl antialiased text-center">
            Google form submitter
          </h1>
          <h2 className="text-1xl antialiased mt-5">
            Works only with Google Forms which have multiple submisions allowed.
          </h2>
          <ol className="list-decimal mx-4 my-4">
            <li>Proceed to completing the survey</li>
            <li>Click F12</li>
            <li>Complete the survey and send answers</li>
            <li>Go to the network tab in devtools</li>
            <li>
              Find the line with the name{" "}
              <em className="text-indigo-600 font-bold">form response</em>,
              click on it and go to the bottom
            </li>
            <li>
              In the <em className="text-indigo-600 font-bold">Form Data</em>{" "}
              tab there are answers to the form
            </li>
            <li>
              Paste them into the inputs below and select the number of
              submittions
            </li>
          </ol>
        </div>
        <form className="w-full" onSubmit={e => onFormSubmit(e)}>
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
              name="submittionValue"
              value={submittionValue}
              onChange={({ target }) => {
                const pattern = /^\d*[1-9]\d*$/;
                const currentValue = target.value;

                if (currentValue === "" || pattern.test(currentValue)) {
                  setSubmittionValue(currentValue);
                }
              }}
              labelValue="Number of submittions (More than 10 might contribute to block)"
              fullWidth
              placeholder="7"
            />
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">{entryInputs}</div>
          <div className="md:flex md:items-center">
            <div className="md:w-full">
              <button
                className="shadow bg-purple-400 hover:bg-purple-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mr-4"
                type="button"
                disabled={isModalOpen}
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
                disabled={isModalOpen}
                className="shadow bg-purple-800 hover:bg-purple-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default App;
