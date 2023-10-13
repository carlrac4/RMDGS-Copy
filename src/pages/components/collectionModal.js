import Select from "react-select";

import Modal from "react-modal";
import React, { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  query,
  deleteDoc,
  where,
  docs,
  getDocs,
} from "firebase/firestore";
import { ReactComponent as CancelIcon } from "./assets/cancel.svg";
import { ReactComponent as AddIcon } from "./assets/add.svg";
import { ReactComponent as WarningIcon } from "./assets/warning.svg";
import { ReactComponent as CheckIcon } from "./assets/check.svg";
import {
  onSnapshot,
  setDoc,
  doc,
  runTransaction,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { useParams, useNavigate } from "react-router-dom";
import { AuthLvlCollection } from "../auth/auth";
import DatePicker from "react-datepicker";
import Calendar from "react-calendar";
import { Navigation } from "../../templates/navigation";
import "tailwindcss/tailwind.css";

import { MemberReport } from "../../PrintComponent.js";
import "./styles/calendar.css";
import { current } from "@reduxjs/toolkit";
const InsertDriverLogs = async (collectionName,userID,driverID, action) => {
  const memberID = userID.split("=").pop();
  const dateEncode = getDate().replaceAll("/", "m");

  await addDoc(collection(db, collectionName), {
    user: memberID,
    date: dateEncode,
    action: action,
    id: driverID, // Make sure to define the 'data' object or replace it with the appropriate value
  });
};

const InsertLogs = async (collectionName,userID, modified, driverID, action) => {
  const memberID = userID.split("=").pop();
  const dateEncode = getDate().replaceAll("/", "m");

  await addDoc(collection(db, collectionName), {
    user: memberID,
    date: dateEncode,
    dateModified: modified,
    action: action,
    id: driverID, // Make sure to define the 'data' object or replace it with the appropriate value
  });
};

function SplitName(name) {
  if (name) {
    var dotPosition = name.indexOf(",");

    var miPosition = name.includes(".");

    if (miPosition) {
      miPosition = name.indexOf(".");
    } else {
      miPosition = name.length + 2;
    }

    var lastname = name.substring(0, dotPosition);
    var firstname = name.substring(dotPosition + 2, miPosition - 2);

    var middleinitial = name.substring(miPosition - 1, miPosition);

    var suffix = name.substring(miPosition + 2);
  }

  return {
    firstname: firstname,
    lastname: lastname,
    middleinitial: middleinitial,
    suffix: suffix,
  };
}

function handleSubmit(event) {
  // 👇️ prevent page refresh
  event.preventDefault();
}
function ConvertDateTime(data) {
  const moment = require("moment");
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const converted = moment(data).format("DD-MM-YYYY");
  let day = converted.substring(0, 2);
  let getMonth = Number(converted.substring(3, 5)) - 1;
  let year = converted.substring(6);
  let result = day + "m" + months[getMonth] + "m" + year;

  return result;
}

function getDate() {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aaugust",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentDate = day + "/" + months[month] + "/" + year;
  return currentDate;
}

function formattedDateToday() {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aaugust",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentDate = day + "m" + months[month] + "m" + year;
  return currentDate;
}

function CalendarComponent(props) {
  const { paid, pass } = props;

  const [date, setDate] = useState(new Date());

  const tileClassName = ({ date, view }) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateString = `${day}/${month}/${year}`;

    const now = new Date();
    const currentDate = now.getDate();
    const currentDay = `${currentDate}/${month}/${year}`;

    if (view === "month") {
      if (paid.includes(dateString)) {
        return "bg-green text-white";
      }

      if (pass.includes(dateString)) {
        return "bg-red text-white";
      }
    }
  };

  return (
    <div className="h-auto mb-2 flex justify-center items-center">
      <Calendar value={date} onChange={setDate} tileClassName={tileClassName} />
    </div>
  );
}

function formatDateArray(dateArray) {
  const monthMap = {
    January: "1",
    February: "2",
    March: "3",
    April: "4",
    May: "5",
    June: "6",
    July: "7",
    August: "8",
    September: "9",
    October: "10",
    November: "11",
    December: "12",
  };

  const formattedDates = dateArray.map((date) => {
    let formattedDate = date.replace(/m/g, "/"); // replace "m" with "/"
    for (let monthName in monthMap) {
      // loop over monthMap
      if (formattedDate.includes(monthName)) {
        // if monthName is in the string
        formattedDate = formattedDate.replace(monthName, monthMap[monthName]); // replace with the corresponding number from monthMap
      }
    }

    // remove leading zeros from day and month
    formattedDate = formattedDate.replace(/\/0+(\d)/g, "/$1");
    formattedDate = formattedDate.replace(/^(0+)/g, "");

    return formattedDate;
  });

  return formattedDates;
}
function segregateObject(obj) {
  const paidItems = [];
  const passItems = [];

  for (const key in obj) {
    if (obj[key] === "paid") {
      paidItems.push(key);
    } else if (obj[key] === "pass") {
      passItems.push(key);
    }
  }

  return [paidItems, passItems];
}

function segregateKeys(object, searchString) {
  const matchingKeys = {};
  const otherKeys = {};

  for (const key in object) {
    if (key.includes(searchString)) {
      matchingKeys[key] = object[key];
    } else {
      otherKeys[key] = object[key];
    }
  }

  return matchingKeys;
}

export default function CollectionModal(auth) {
  const moment = require("moment");
  const { userID, memberid, authLvl, Collect } = useParams();
  const [filter, setFilter] = useState();
  const [user, setUser] = useState({});
  const [tempor, setTempor] = useState({});
  const [details, setDetails] = useState({});
  const [startDate, setStartDate] = useState();
  const [check, setCheck] = useState([]);
  const [paid, setPaid] = useState([]);
  const [pass, setPass] = useState([]);

  const AuthLvl = authLvl.split("~").pop();
  const Collector = Collect.split("=").pop();

  function isCollector(Collector) {
    if (Collector == "true") {
      return true;
    } else {
      return false;
    }
  }

  const options = [
    { value: "m", label: "All" },
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const classes =
    "relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

  const getCurrentRecords = async (id) => {
    const unsub = onSnapshot(doc(db, "collection", id), (doc) => {
      setDetails(doc.data());
      const data = doc.data()["TRANSACTION"];
      const [paidItems, passItems] = segregateObject(data);
      setUser(doc.data()["TRANSACTION"]);
      setCheck(paidItems);

      setTempor(paidItems);

      setPaid(formatDateArray(paidItems));
      setPass(formatDateArray(passItems));
    });
  };

  // const dateToday = getDate().replaceAll("/","m");
  // let checklang;
  // user == undefined ? checklang = {[dateToday]: ""} : checklang = user;

  useEffect(() => {
    getCurrentRecords(memberid);
    localStorage.setItem("authLevel", AuthLvl);
  }, []);

  const update = async () => {
    await setDoc(
      doc(db, "collection", memberid),
      {
        TRANSACTION: { [ConvertDateTime(time)]: "paid" },
      },
      { merge: true }
    );

    await setDoc(
      doc(db, "Records", "collectionRecord"),
      {
        [`${ConvertDateTime(time)}`]: { [memberid]: "paid" },
      },
      { merge: true }
    );

    InsertLogs("CollectionLogs",userID, ConvertDateTime(time), details.ID, "paid");
  };

  const cancel = async (key, data) => {
    const listRef = doc(db, "collection", key);
    await updateDoc(listRef, {
      [`TRANSACTION.${data}`]: deleteField(),
    });
    const recordsRef = doc(db, "Records", "collectionRecord");
    await updateDoc(recordsRef, {
      [`${data}.${key}`]: deleteField(),
    });

    InsertLogs("CollectionLogs",userID, data, details.ID, "cancelled");
  };
  const navigate = useNavigate();
  const back = () => {
    navigate(`/collections/${userID}/authLv~${AuthLvl}/collector=${Collector}`);
  };
  const [time, setTime] = useState(new Date());

  return (
    <div className="min-h-screen flex flex-row bg-gray-100">
      <script
        src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"
        defer
      ></script>
      <Navigation />

      <div className="flex-1 px-2 sm:px-0 mx-4 my-4">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2 mb-2">
            <div className="bg-white mb-2 w-fit  ">
              <ul className="text-gray-600 hover:text-gray-700 hover:shadow py-1 px-3 m-0 divide-y">
                <li className="flex items-center py-1">
                  <button onClick={back}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
            <div className="bg-white p-3  mb-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-auto w-full mx-auto"
                  src="./assets/SKLTODA.png"
                  alt=""
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1"></h1>
              <h3 className=" font-lg text-center text-semibold leading-6 italic">
                {details.NAME}
              </h3>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <DatePicker
                    className="relative block place-self-end w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholderText="MM-DD-YYYY"
                    dateFormat="d-M-yyyy"
                    disabledKeyboardNavigation
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={70}
                    dropdownMode="select"
                    selected={time}
                    required
                    minDate={moment().startOf("month")._d}
                    maxDate={moment()._d}
                    onChange={(date) => {
                      setTime(date);
                    }}
                  />
                </li>
                <li className="flex items-center py-3">
                  <button
                    disabled={AuthLvlCollection(AuthLvl, Collector)}
                    className="disabled:bg-gray-300 disabled:border-gray-700 disabled:text-gray-700 w-full bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      update();
                    }}
                  >
                    Add payment
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-9/12 md:mx-2 h-auto">
            {/* buttons for printing */}
            <div className="bg-white p-3 shadow-sm rounded-sm mb-3 ">
              <div className="grid md:grid-cols-2 text-sm gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    options={options}
                    className={{ classes }}
                    defaultValue={{ label: "All", value: "m" }}
                    onChange={(e) => {
                      setFilter(e.label);
                      setTempor(check.filter((name) => name.includes(e.value)));
                    }}
                  />

                  <MemberReport
                    data={{ data: tempor }}
                    details={{ key: details, month: filter }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <DriverDetails
                    details={{ key: memberid, name: details?.NAME, id: details?.NO }}
                    auth={AuthLvlCollection(AuthLvl, Collector)}
                  />

                  <ConfirmDeleteModal 
                    details={{ key: memberid, name: details?.NAME, id: details?.NO  }}
                    auth={AuthLvlCollection(AuthLvl, Collector)}
                    collector={Collector}
                    authlvl={AuthLvl}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white text-center p-3 shadow-sm rounded-sm">
              <div className="text-center flex flex-row items-center justify-center mb-3 border-b">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>{" "}
                <p className="p-3 text-2xl ">All payments</p>
              </div>
              <div className="flex items-center space-x-2 border-b mb-5 py-3 font-semibold text-gray-900 leading-8">
                <div className="container mx-auto  ">
                  <CalendarComponent paid={paid} pass={pass} />
                </div>
              </div>
              <div className="text-gray-700 w-full">
                <div className=" text-sm h-full border-black flex flex-row w-full ">
                  <div className=" leading-normal w-full">
                    <div>
                      <div className="flex flex-row w-full">
                        <div className=" w-2/12 px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {" "}
                          No.{" "}
                        </div>
                        <div className="w-4/12 px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {" "}
                          Date{" "}
                        </div>
                        <div className="w-3/12 px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {" "}
                          Amount{" "}
                        </div>
                        <div className=" w-3/12 px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      {Object.values(tempor).map((tempor, key) => {
                        return (
                          <div className="flex flex-row w-full">
                            <div className="w-2/12 px-5 py-1 border-b border-white-600 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {key + 1}{" "}
                              </p>
                            </div>
                            <div className="w-4/12 px-5 py-1 border-b border-white-600 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {tempor.replaceAll("m", "-")}{" "}
                              </p>
                            </div>
                            <div className="px-5 w-3/12 py-1 border-b border-white-600 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                10{" "}
                              </p>
                            </div>
                            <div className="w-3/12 px-5 py-1 border-b border-white-600 bg-white text-sm">
                              <button
                                disabled={AuthLvlCollection(AuthLvl, Collector)}
                                className="bg-red-500 text-white active:bg-red-600 font-bold  text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => {
                                  cancel(memberid, tempor);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {tempor.length == 0 ? (
                        <div className="w-full text-center text-gray-300 italic ">
                          {" "}
                          <span>No data</span>{" "}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

function validateInput(input) {
  const regex = /^[a-zA-Z]+([.-]?[a-zA-Z]+)*$/;
  return regex.test(input);
}

export function DriverDetails(detail) {
 
  const [details, setDetails] = useState(detail);
  const [showInitial, setInitial] = React.useState(true);
  const [showLoading, setLoading] = React.useState(false);
  const [showSuccess, setSuccess] = React.useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [valid, setValid] = useState(false);
  const [disable, setDisable] = useState(false);
  const [exist, setExist] = useState(false);
  const classes = `relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`;
  const { userID, memberid, authLvl, Collect } = useParams();
	
  const handleLastNameBlur = (event) => {
    if (!validateInput(event.target.value)) {
      event.target.className += " border-2 border-rose-600";
    } else {
      event.target.className -= " border-2 border-rose-600";
      event.target.className +=
        "relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";
    }
  };

  const handleFirstNameBlur = (event) => {
    if (!validateInput(event.target.value)) {
      event.target.className += " border-2 border-rose-600";
    } else {
      event.target.className -= " border-2 border-rose-600";
      event.target.className +=
        "relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";
    }
  };

  const handleMiddleNameBlur = (event) => {
    if (!validateInput(event.target.value) || event.target.value > 1) {
      event.target.className += " border-2 border-rose-600";
    } else {
      event.target.className -= " border-2 border-rose-600";
      event.target.className +=
        "relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // do something with the form data
  };

  const checkValue = () => {

    if (firstname.length == 0) {
      setFirstname(SplitName(detail.details['name']).firstname);
    }
    if (lastname.length == 0) {
      setLastname(SplitName(detail.details['name']).lastname);
    }
    if (middlename.length == 0) {
      if (!SplitName(detail.details['name']).middleinitial.length == 0) {
        setMiddlename(SplitName(detail.details['name']).middleinitial);
      }
    } else {
      setConfirmModal(true);
      setIsOpen(false);
      setInitial(true);
    }
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
    setDisable(false);
    setExist(false);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
    setFirstname("");
    setLastname("");
    setMiddlename("");
  }

  const month = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const addMember = async () => {
    setInitial(false);
    setLoading(true);
    const fullname =
      capitalize(lastname) +
      ", " +
      capitalize(firstname) +
      " " +
      capitalize(middlename) +
      (middlename ? "." : " ");

    const sfDocRef = doc(db, "collection", detail.details.key);
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        transaction.update(sfDocRef, {
          NAME: fullname,
        });
      });

      InsertDriverLogs("CollectionMemberLogs",userID, detail.details['id'], "Edited");
  
      setLoading(false);
      setSuccess(true); 
    } catch (e) {
      console.log("error occured", e);
    }
    setTimeout(function () {
      setConfirmModal(false);
      setSuccess(false);
    }, 900);
  };

  var classl = `.${classes} + .${valid ? " " : " border-2 border-rose-600"}`;
  return (
    <div>
      <button
        onClick={openModal}
        disabled={details.auth}
        type="button"
        class="disabled:bg-gray-300 disabled:border-gray-700 disabled:text-gray-700 w-full py-2 px-4 bg-transparent text-indigo-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
      >
        EDIT DETAILS
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div class="px-3 py-3 mb-4 text-center ">
          <span>Update Driver's Information </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            {disable ? (
              <div className="bg-red-500 w-full">
                <label
                  htmlFor="warning"
                  class="block text-sm font-medium text-white p-3"
                >
                  Please fill out first name and last name
                </label>
              </div>
            ) : null}
            {exist ? (
              <div className="bg-red-500 w-full">
                <label
                  htmlFor="warning"
                  class="block text-sm font-medium text-white p-3"
                >
                  Driver already in records
                </label>
              </div>
            ) : null}
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              onBlur={handleLastNameBlur}
              id="last_name"
              name="last_name"
              onChange={(event) => {
                setLastname(event.target.value);
              }}
              required
              type="text"
              className={classes}
            />
          </div>
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>

            <input
              onBlur={handleFirstNameBlur}
              id="first_name"
              name="first_name"
              onChange={(event) => {
                setFirstname(event.target.value);
              }}
              required
              type="text"
              className={classes}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              M.I.
            </label>

            <input
              id="middle_name"
              onBlur={handleMiddleNameBlur}
              name="middle_name"
              max="1"
              onChange={(event) => {
                setMiddlename(event.target.value);
              }}
              type="text"
              className={classes}
            />
          </div>
        </form>

        <div class="px-3 py-2 justify-end m-3 ">
          {" "}
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="text-white bg-blue-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => {
              checkValue();
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>

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
                    <p class="font-bold">Update Driver Details</p>
                    <p class="text-sm text-gray-700 mt-1">
                      Are you sure you want to upadte{" "}
                      <span className="text-red-700 italic">
                        {capitalize(lastname) +
                          ", " +
                          capitalize(firstname) +
                          " " +
                          capitalize(middlename) +
                          (middlename ? "." : " ")}
                      </span>{" "}
                      ?
                    </p>
                  </div>
                </div>
                <div class="text-center md:text-right mt-4 md:flex md:justify-end">
                  <button
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md mx-2	:ml-2 md:order-2"
                    onClick={addMember}
                  >
                    Add Driver
                  </button>
                  <button
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 mx-2
          md:mt-0 md:order-1"
                    onClick={() => {
                      setConfirmModal(false);
                      setIsOpen(true);
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
    </div>
  );
}

export function ConfirmDeleteModal(detail) {
  const [showInitial, setInitial] = React.useState(true);
  const [showLoading, setLoading] = React.useState(false);
  const [showSucess, setSuccess] = React.useState(false);
  //   const [text, setText] = React.useState(details);
  const [showModal, setShowModal] = useState();
  const navigate = useNavigate();
  const { userID, memberid, authLvl, Collect } = useParams();
  const currentAuth = localStorage.getItem("authLevel");
  const removeMember = async () => {
    await deleteDoc(doc(db, "collection", detail.details.key));
    setShowModal(false);
  
    InsertDriverLogs("CollectionMemberLogs", userID, detail.details['id'],"Deleted")
    navigate(`/collections/${userID}/authLv~${currentAuth}/collector=${detail.collector}`);
    window.location.reload();
  };

  return (
    <>
      <button
        disabled={detail.auth}
        className="disabled:bg-gray-300 disabled:border-gray-700 disabled:text-gray-700 bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Delete member record
      </button>
      {showModal ? (
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
                      {showSucess ? (
                        <>
                          <CheckIcon />
                        </>
                      ) : null}
                    </i>
                  </div>
                  <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <p class="font-bold">Delete your account</p>
                    <p class="text-sm text-gray-700 mt-1">
                      You will lose all of your data by deleting your account.
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div class="text-center md:text-right mt-4 md:flex md:justify-end">
                  <button
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md mx-2	:ml-2 md:order-2"
                    onClick={removeMember}
                  >
                    Delete Member
                  </button>
                  <button
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 mx-2
        md:mt-0 md:order-1"
                    onClick={() => {
                      setShowModal(false);
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
