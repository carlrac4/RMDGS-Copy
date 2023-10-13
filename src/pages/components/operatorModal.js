import React, { useState, useEffect } from "react";
import { db } from "../../firebase-config";
import { getDetails } from "../profile";
import Select from "react-select";
import { runTransaction, doc, deleteDoc,collection, addDoc, onSnapshot } from "firebase/firestore";
import { ReactComponent as CancelIcon } from "./assets/cancel.svg";
import { ReactComponent as AddIcon } from "./assets/add.svg";
import { ReactComponent as WarningIcon } from "./assets/warning.svg";
import { ReactComponent as CheckIcon } from "./assets/check.svg";
import { useParams } from 'react-router-dom';
import {AuthLevel} from "../auth/auth";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

function getDate(){
	const date = new Date();
  
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let months = ["January","February","March","April","May","June","July","Aaugust","September","October","November","December"]
  
  let currentDate = day+"/"+months[month]+"/"+year;
  return currentDate
  }

function flatten(obj, parentKey = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = parentKey ? `${parentKey}/${key}` : key;
    if (typeof obj[key] === "object") {
      const nestedObj = flatten(obj[key], newKey);
      acc = { ...acc, ...nestedObj };
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
}
function InputGenerator(props) {
  const { values, onChange, onFormValidChange } = props;

  const val = values;

  const [inputValues, setInputValues] = useState([...val]);
  const [inputErrors, setInputErrors] = useState([]);

  const handleChange = (event, index) => {
    const newValues = [...inputValues];
    newValues[index] = event.target.value;
    setInputValues(newValues);

    // Validate input value
    const newErrors = [...inputErrors];
    if (!/^[a-zA-Z]+$/.test(event.target.value)) {
      newErrors[index] = true;
    } else {
      newErrors[index] = false;
    }
    setInputErrors(newErrors);

    onChange(newValues);

    // Check if any errors exist
    const hasErrors = newErrors.some((error) => error);

    // Pass form validity to parent component
    onFormValidChange(!hasErrors);
  };

  const handleAddInput = () => {
    setInputValues([...inputValues, ""]);
    setInputErrors([...inputErrors, false]);
  };

  const handleRemoveInput = (index) => {
    const newValues = [...inputValues];
    newValues.splice(index, 1);
    setInputValues(newValues);

    const newErrors = [...inputErrors];
    newErrors.splice(index, 1);
    setInputErrors(newErrors);

    onChange(newValues);

    // Check if any errors exist
    const hasErrors = newErrors.some((error) => error);

    // Pass form validity to parent component
    onFormValidChange(!hasErrors);
  };

  const handleBlur = (event, index) => {
    const newErrors = [...inputErrors];
    if (!/^[A-Za-z ]+$/.test(event.target.value)) {
      newErrors[index] = true;
    } else {
      newErrors[index] = false;
    }
    setInputErrors(newErrors);

    // Check if any errors exist
    const hasErrors = newErrors.some((error) => error);

    // Pass form validity to parent component
    onFormValidChange(!hasErrors);
  };

  return (
    <div className="col-span-12 sm:col-span-12 lg:col-span-12 my-3">
      {inputValues.map((value, index) => (
        <div key={index}>
          <label
            htmlFor="full-name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <div className="flex flex-row">
            <input
              value={value}
              onChange={(event) => handleChange(event, index)}
              onBlur={(event) => handleBlur(event, index)}
              className={`relative block w-full appearance-none rounded-none rounded-t-md border ${
                inputErrors[index] ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
            />
            {inputValues.length > 1 && (
              <button onClick={() => handleRemoveInput(index)}>
                <i className="text-sm">
                  <CancelIcon className="fill-gray-500 ml-3" />
                </i>
              </button>
            )}
          </div>
        </div>
      ))}
      {inputValues.length === 1 && (
        <div className="w-full flex flex-row justify-end">
          <button onClick={handleAddInput} className="">
            <AddIcon className="fill-gray-500 ml-3 mt-3 " />
          </button>
        </div>
      )}
    </div>
  );
}

function handleSubmit(event) {
  // 👇️ prevent page refresh
  event.preventDefault();
}

export function OperatorModal(details) {
  const [data, setData] = useState([]);
 
  const [showInitial, setInitial] = React.useState(true);
  const [showLoading, setLoading] = React.useState(false);
  const [showSuccess, setSuccess] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [text, setText] = React.useState(details);
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [bodyNum, setbodyNum] = useState("");
  const [inputValues, setInputValues] = useState([]);
  const [isGood, setIsGood] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [inputErrors, setInputErrors] = useState([]);

  const{userID} = useParams();
  const memberID = userID.split("=").pop();
  const dateEncode = getDate().replaceAll("/","m");
  const addLogs = async () => {
    await addDoc(collection(db, "OperatorLogs"), {
      'user':memberID,
      "date":dateEncode,
      'action':"Edit",
      'id':data.BODY

      });
  }
  function CheckAndSplit(props) {
    const inputString = props;
  
    if (inputString.includes("/")) {
      const stringArray = inputString.split("/");
      return stringArray;
    } else {
      return [inputString];
    }
      
    
  }
  const handleInputChange = (newValues) => {
    // Validate all input values
    const newErrors = newValues.map((value) => !/^[A-Za-z]+$/.test(value));
    setInputErrors(newErrors);

    // Check if any errors exist
    const hasErrors = newErrors.some((error) => error);

    // Disable button if any errors exist
    setFormValid(!hasErrors);

    // Update input values
    setInputValues(newValues);
  };

  const exitConfirm = () => {
    setConfirmModal(false);
    setShowModal(true);
  };
  const confirmAction = () => {
    setShowModal(false);
    setConfirmModal(true);
  };

  var FinalName = "";
  var FinalAddress = "";
  var FinalBodyNum = "";

  const sfDocRef = doc(db, "Operator", text.details.key);
  try {
    inputValues.length === 0
      ? (FinalName = data.NAME)
      : (FinalName = inputValues.join(" / "));
    bodyNum.length === 0
      ? (FinalBodyNum = data.BODY)
      : (FinalBodyNum = bodyNum);
    address.length === 0
      ? (FinalAddress = data.ADDRESS)
      : (FinalAddress = address);
  } catch (e) {
    window.location.reload();
  }
  const updateOperator = async () => {
  
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        transaction.update(sfDocRef, {
          NAME: FinalName,
          ADDRESS: FinalAddress,
          BODY: FinalBodyNum,
        });
      });
      setInitial(false);
      setLoading(false);   
      setSuccess(true);
      addLogs();
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
    setTimeout(function () {
      setSuccess(false);
      setInitial(true);
      setConfirmModal(false);
    }, 900);
  };

  useEffect(() => {
    const getCurrentRecords = async (id) => {
      const unsub = onSnapshot(doc(db, "Operator", id), (doc) => {
        setData(doc.data());
      });
    };


      getCurrentRecords(text.details.key);
  }, []);

  
  const validateAddress = (event) => {
	const input = event.target;
	const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
  
	
	if (!addressRegex.test(input.value)) {
	  input.classList.add("border-red-500");
	  setFormValid(false);
	} else {
	  input.classList.remove("border-red-500");
	  setFormValid(true);
	}
  };

  const show = () => {
    setShowModal(true);
  };
  return (
    <>

      <button
        className="py-2 px-4 disabled:text-gray-700 text-green-600 font-semibold"
        type="button"
        disabled={AuthLevel(details.auth)}
        onClick={show}
      >
        {" "}
        Edit{" "}
      </button>
   
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/*content*/}
              
                {/*header*/}
              
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit}>
                    <div class="overflow-hidden shadow sm:rounded-md">
                      <div class="bg-white px-4 py-5 sm:p-6">
                      <label
                              for="title"
                              class="block text-md italic text-center text-gray-700"
                            >
                              UPDATE OPERATOR DETAILS
                            </label>
                        <div class="grid grid-cols-12 gap-6">
                     
                          <div class="col-span-12 sm:col-span-6  text-center lg:col-span-12">
                          
                          </div>

                          {/* <div > */}
                          <InputGenerator
                            values={CheckAndSplit(data?.NAME)}
                            onChange={handleInputChange}
                            onFormValidChange={setFormValid}
                          />
                          {/* <InputGenerator values={CheckAndSplit(data.NAME)} onChange={handleInputChange} /> */}
                          {/* </div> */}
                          <div class="col-span-12 sm:col-span-12 lg:col-span-12 row-span-6">
                            <label
                              for="address"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Address
                            </label>
							            <textarea
                            id="address"
                            name="address"
                            type="text"
                            defaultValue={data.ADDRESS}
                            onChange={(event) => {
                            setAddress(event.target.value);
                            }}
                            onBlur={validateAddress} // Call the function on blur
                            placeholder={data.ADDRESS}
                            required
                            className={`relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 ${
                            isGood ? "border-red-500" : "border-gray-300"
                            } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm h-full`}
							                />
                          </div>
                          <div class="col-span-12 sm:col-span-12 lg:col-span-12">
                            <label
                              for="address"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Body Number
                            </label>
                            <input
                              id="address"
                              name="address"
                              type="text"
                              defaultValue={data.BODY}
                              placeholder={data.BODY}
                              disabled
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </button>
                        <button
                          className="text-white bg-blue-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-500"
                          type="button"
                          disabled={!formValid}
                          onClick={confirmAction}
                        >
                          Update
                        </button>
                      </div>
                      </div>
                     
                    </div>
                  </form>
                </div>
                {/*footer*/}
             
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {confirmModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
              <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
                <div class="md:flex items-center">
                  <div class="rounded-full  flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                    <i class="bx bx-error text-3xl">
                      {showInitial ? (
                        <>
                          <WarningIcon className="fill-yellow-500" />
                        </>
                      ) : null}

                      {showLoading ? (
                        <>
                          <span class="loader"></span>
                        </>
                      ) : null}
                      {showSuccess ? (
                        <>
                          <CheckIcon />
                        </>
                      ) : null}
                    </i>
                  </div>
                  <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <p class="font-bold">Update information</p>
                    <p class="text-sm text-gray-700 mt-1">
                      You will update the driver's information. This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
                <div class="text-center md:text-right mt-4 md:flex md:justify-end">
                  <button
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md mx-2	:ml-2 md:order-2"
                    onClick={updateOperator}
                  >
                    Update Operator
                  </button>
                  <button
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 mx-2
          md:mt-0 md:order-1"
                    onClick={() => {
                      setConfirmModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export function ConfirmDeleteModal(details) {
  const [text, setText] = React.useState(details);
  const [showModal, setShowModal] = useState();

  const removeMember = async () => {
    await deleteDoc(doc(db, "Operator", text.details.key));
    setShowModal(false);
  };
  return (
    <>
      <button
        className="py-2 px-4 disabled:text-gray-700 text-red-600 font-semibold"
        type="button"
        data-tooltip-target="tooltip-default"
        disabled={AuthLevel(details.auth)}
        onClick={() => setShowModal(true)}
      >
        {" "}
        Delete{" "}
      </button>
    
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none md:mt-10 focus:outline-none">
            <div className="relative w-auto my-6 md:ny-20 mx-auto max-w-3xl p-3">
              {/*content*/}

              <div className="border-0 rounded-lg mt-5 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t"></div>
                {/*body*/}
                <form onSubmit={handleSubmit}>
                  <div class="overflow-hidden shadow sm:rounded-md">
                    <div class="bg-white px-4 py-5 sm:p-6 flex items-center justify-center ">
                      <div class="grid grid-cols-6 gap-6 ">
                        <div class="col-span-6 sm:col-span-6 lg:col-span-6 bg-red-500">
                          <label
                            htmlFor="warning"
                            class="block text-sm font-medium text-white p-3 text-center"
                          >
                            Confirm deletion of member
                          </label>
                        </div>
                        <div class="col-span-6 sm:col-span-6 lg:col-span-6 flex ">
                          <table className="min-w-full leading-normal ">
                            <tbody>
                              <tr>
                                <td className=" bg-gray-300 px-5 py-1 border-b border-black-100 bg-white text-sm">
                                  <div className="flex   items-center text-center">
                                    {/* Name */}
                                    <div className="ml-3">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        NAME
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className=" px-5 py-1 border-b border-black-100 bg-white text-sm">
                                  <div className="flex items-center text-center">
                                    {/* Name */}
                                    <div className="ml-3 ">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        {text.details.name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className=" bg-gray-300 px-5 py-1 border-b border-black-100 bg-white text-sm">
                                  <div className="flex items-center text-center">
                                    {/* Name */}
                                    <div className="ml-3">
                                      <p className="text-gray-900  whitespace-no-wrap">
                                        IDENTIFICATION NO.
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-1 border-b border-black-100 bg-white text-sm">
                                  <div className="flex items-center text-center">
                                    {/* Name */}
                                    <div className="ml-3">
                                      <p className="text-gray-900  whitespace-no-wrap">
                                        {text.details.id}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                        }}
                      >
                        Close
                      </button>
                      <button
                        onClick={removeMember}
                        className="text-white bg-blue-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
