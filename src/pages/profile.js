import React, { useState, useEffect } from "react";
import Modal from "./components/modal";
import {UpdateModal, ConfirmDeleteModal} from "./components/updateModal";
import { useLocation, useNavigate, useParams} from "react-router-dom";
import { auth } from "../firebase-config";
import { db } from "../firebase-config";
import { Timestamp,doc, onSnapshot} from "firebase/firestore";
import { onAuthStateChanged, signOut} from "firebase/auth";
import { Navigation } from "../templates/navigation";
import {AuthLevel} from "./auth/auth"
import {PrintComponent} from '../PrintComponent'
function convertTimestamp(fieldVal){
  
if(!fieldVal){
  const empty = "Not Specified";
  return empty;
}else{
  const timeStamp = new Timestamp(fieldVal.seconds, 
    fieldVal.nanoseconds);
    const options = {year:'numeric'};
    const date = timeStamp.toDate()
      if(date.length = 4){
        return date.toLocaleDateString('en-US',options);
      }else{
        return date.toLocaleDateString('en-US');
      }

}

}


export default function Profile() {

  const moment = require('moment');
  const {state} = useLocation();  
  const [ details, setDetails] = useState([])
  const [ data, setData] = useState([])
  const{userID} = useParams();
  const{authLvl} = useParams();
  
  const authentication = authLvl.split("~").pop()

  useEffect(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if(currentUser){

    }else {
     navigate("/");   
    }
 
  });

  const getCurrentRecords = async(id) => {
    const item = [];
    const unsub = onSnapshot(doc(db, "Driver", id), (doc) => {
     item.push({ key: state.key, ...doc.data() })
    setData(item);
    setDetails(doc.data())
    });
    }
    return () => {
     getCurrentRecords(state.key)
    }
}, []); 



const options = {year:'numeric'};
    const navigate = useNavigate();
    const back = () =>{

    navigate(`/driver/${userID}/authLv~${authentication}`); // here we will redirect user and send your data into state
 };
 
 
    return( 
        <div className="min-h-screen flex flex-row bg-gray-100">
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
      <Navigation />
      <div className="flex-1 px-2 sm:px-0 mx-4 my-4">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2 mb-2">
            <div className="bg-white mb-2 w-fit  ">
              <ul className="text-gray-600 hover:text-gray-700 hover:shadow py-1 px-3 m-0 divide-y">
                <li className="flex items-center py-1">
                  <button onClick={back} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img className="h-auto w-full mx-auto" src="./assets/SKLTODA.png" alt="" />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{details.NAME}</h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">SKLTODA Driver</h3>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              
                <li className="flex items-center py-3">
                  <span>Member since</span>
                  <span className="ml-auto">{convertTimestamp(details?.YEAR) ?? details.YEAR}
              </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-9/12 md:mx-2 h-auto">

            {/* buttons for printing */}
            <div className="bg-white p-3 shadow-sm rounded-sm mb-3">
            <div className="grid md:grid-cols-2 text-sm gap-2 ">
                  <div className="grid grid-cols-2 gap-2">
                 <Modal {...data}/>
                

                  </div>
                  <div className="grid grid-cols-2 gap-2">
                  <UpdateModal {...data} auth={AuthLevel(authentication)}/>
   
                  <ConfirmDeleteModal {...data} auth={AuthLevel(authentication)} />
                  </div>
            </div>          
            </div>

           
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span clas="text-green-500">
                  <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span className="tracking-wide">About</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Gender</div>
                    <div className="px-4 py-2">{details.GENDER}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Contact No.</div>
                    <div className="px-4 py-2">{details.CONTACT}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Full Address</div>
                    <div className="px-4 py-2">{details.ADDRESS}</div>
                  </div>
               
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">License Number</div>
                    <div className="px-4 py-2">
                    {details.LICENSE}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Birthday</div>
                    <div className="px-4 py-2">{convertTimestamp(details.BIRTHDATE) ?? details.BIRTHDATE}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4"></div>
            {/* <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="grid grid-cols-2">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span clas="text-green-500">
                      <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <span className="tracking-wide">Violations</span>
                  </div>
                  <ul className="list-inside space-y-2">
                    <li>
                      <div className="text-teal-600">xxxxxxx</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                    <li>
                      <div className="text-teal-600">rrrrrrrrrr.</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                    <li>
                      <div className="text-teal-600">vvvvvvvvv</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                    <li>
                      <div className="text-teal-600">cccccccc</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span clas="text-green-500">
                      <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path fill="#fff" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </span>
                    <span className="tracking-wide">Fees</span>
                  </div>
                  <ul className="list-inside space-y-2">
                    <li>
                      <div className="text-teal-600">(100.00)</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                    <li>
                      <div className="text-teal-600">(200.00)</div>
                      <div className="text-gray-500 text-xs">March 2020 - Now</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>


 

    </div>

     
    );
}
