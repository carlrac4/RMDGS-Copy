import React, {useState} from "react";
import { PrintComponent } from "../../PrintComponent.js";
import {collection, addDoc} from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { db } from "../../firebase-config";
export function getDate(){
	const date = new Date();
  
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let months = ["January","February","March","April","May","June","July","Aaugust","September","October","November","December"]
  
  let currentDate = day+"/"+months[month]+"/"+year;
  return currentDate
  }

export default function Modal(details) {
  const [showModal, setShowModal] = React.useState(false);

  const{userID} = useParams();
  const finalID = userID.substring(2);

  const [salary, setSalary] = useState("");
  const [showConfirmModal, setConfirmModal] = React.useState(false);
  const [showWarning, setWarning] = React.useState(false);
  const dateEncode = getDate().replaceAll("/","m");

  const addLogs = async () => {
    await addDoc(collection(db, "DriverLogs"), {
      'user':finalID,
      "date":dateEncode,
      'action':"Generated Certificate of Membership",
      'driver':details[0]["NO"]
 
      });
  }

  const confirmModal = () => {
    if(salary == ""){
      setWarning(true);
     
    }else {
      setConfirmModal(true);    
      setShowModal(false);
      addLogs();
    }
  
  };

  
  


  const handleSubmit = event => {
    // 👇️ prevent page refresh
    event.preventDefault();
  };
  

  return (
    <>
      <button
        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Certificate of Membership
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none md:mt-10 focus:outline-none"
          >
            <div className="relative w-auto my-6 md:ny-20 mx-auto max-w-3xl p-3">
              {/*content*/}
              
              <div className="border-0 rounded-lg mt-5 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">
            
                </div>
                {/*body*/}
                <form onSubmit={handleSubmit}>
        <div class="overflow-hidden shadow sm:rounded-md">
          <div class="bg-white px-4 py-5 sm:p-6">
            <div class="grid grid-cols-6 gap-6">
            
            <div class="col-span-6 sm:col-span-6 lg:col-span-6">
                <label for="title" class="block text-sm font-medium text-gray-700">Certificate of Membership Details</label>
            </div>
            {showWarning ? (
            <div class="col-span-6 sm:col-span-6 lg:col-span-6 bg-red-500" >
            <label for="warning" class="block text-sm font-medium text-white p-3">Please fill out salary !</label>
            </div>
            ):null }
  
                <div class="col-span-6 sm:col-span-6 lg:col-span-6">
                <label for="full-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                <input  id="full_name" name="full_name" value={details[0]["NAME"]} type="text" required disabled class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder={details[0]["NAME"]}/>
              </div>
              
              <div class="col-span-6 sm:col-span-6">
                <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                <input  id="address" name="address" type="text" value={details[0]["ADDRESS"]} required disabled class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder={details[0]["ADDRESS"]}/>
              </div>
            
              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label for="postal-code" class="block text-sm font-medium text-gray-700">Position</label>
                <input  id="position" name="position" type="text" value="Driver" disabled required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="position"/>
              </div>

              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label for="salary" class="block text-sm font-medium text-gray-700">Salary</label>
                <input  id="salary" name="salary" type="number" required onChange={(event) => {setSalary(event.target.value);}} class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Salary"/>
              </div>

              <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label for="postal-code" class="block text-sm font-medium text-gray-700">Identification Number</label>
                <input  id="id" name="id" type="number" value={details[0]["NO"]} disabled required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder={details[0]["NO"]}/>
              </div>

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
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => confirmModal()}
                  >
                    Confirm details
                  </button>
                  
                  {/* <PrintComponent detail={{name: text.details.name, id: text.details.id, position: "driver",  salary: salary}} /> */}
                 
                </div>
        </div>
      </form>
                {/*footer*/}
              
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
       {showConfirmModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none md:mt-10 focus:outline-none"
            >
              <div className="relative w-auto my-6 md:ny-20 mx-auto max-w-3xl p-3">
                {/*content*/}
                
                <div className="border-0 rounded-lg mt-5 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">
              
                  </div>
                  {/*body*/}
                  <form onSubmit={handleSubmit}>
          <div class="overflow-hidden shadow sm:rounded-md">
            <div class="bg-white px-4 py-5 sm:p-6 flex items-center justify-center">
              <div class="grid grid-cols-6 gap-6 ">
              <div class="col-span-6 sm:col-span-6 lg:col-span-2 flex  ">
                  <label for="title" class="block text-sm font-medium text-gray-700">Print Certificate of Membership</label>
                  </div>               
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setConfirmModal(false)}
                    >
                      Close
                    </button>
                    
                    <PrintComponent detail={{year:details[0]["YEAR"] ,name: details[0]["NAME"], id: details[0]["NO"], position: "driver",  salary: salary}} />

                   
                  </div>
          </div>
        </form>
                  {/*footer*/}
                
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
    </>
  );
}

