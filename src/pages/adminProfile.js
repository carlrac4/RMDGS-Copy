import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, doc, setDoc, onSnapshot,Timestamp} from "firebase/firestore";
import { useNavigate, useParams} from "react-router-dom";
import { Navigation} from "../templates/navigation";
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import { onAuthStateChanged} from "firebase/auth";
import { UpdateModal } from "./components/adminUpdate";
import { storage } from "../firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import ExportButton from "./components/backup";
import {ReactComponent as WarningIcon} from "./components/assets/warning.svg"
import {ReactComponent as CheckIcon} from "./components/assets/check.svg"

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
function GetAuthLevel(authLvl){
  
  let authAccess;
  authLvl === 1 ? authAccess = true : authAccess = false;

  
  return authAccess

}

function ResetPassword(email){
 try{
  sendPasswordResetEmail(auth, email)
     .then((a) => {
    
       
     })
     .catch((error) => {
       const errorCode = error.code;
       const errorMessage = error.message;
       console.log(errorCode);
       console.log(errorMessage);
       // ..
     });
}catch(e){
  console.log(e);
}
 


}


export default function AdminProfile() {
  const [userDetails, setuserDetails] = useState([]);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const [files, setFiles] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const collectionRef = collection(db,"users");
  const [filename, setFileName] = useState("");
	const [showConfirm, setShowConfirm] = React.useState(false);
  const [showChangeConfirm, setShowConfirmChange] = React.useState(false);
	const [showInitial, setInitial] = React.useState(true);
	const [showLoading, setLoading] = React.useState(false);
	const [showSucess, setSuccess] = React.useState(false);
  const [email, setEmail] = useState("");
  const fetchFiles = async () => {
    const listRef = ref(storage, 'collection/');
    const listResult = await listAll(listRef);
    return Promise.all(listResult.items.map(async (itemRef) => {
      const downloadURL = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        url: downloadURL
      };
    }));
  };
  function Timer() {
    // const cron = require('node-cron');

    // cron.schedule('0 14 * * *', () => {
    // BackData(); 
    // });
    
  }

  Timer();
  useEffect(() => {


    fetchFiles().then((files) => setFiles(files));

    const getLast = async() => {
      const unsub = onSnapshot(doc(db, "users",id ), (doc) => {
        setuserDetails(doc.data());
 
        if(GetAuthLevel(doc.data()["AuthLvl"])){
      
          const fetchData = async () => {
            onSnapshot(collectionRef,(querySnapshot) => { 
                 var items = [];            
                 querySnapshot.forEach(function(doc) {
                     items.push(doc.data());
                 });
                 setAllUser(items);
                 setEmail(doc.data()["EMAIL"])
             })
          };
    
          fetchData();
        }

      });
    }
   
    const getData = async() => {
    onAuthStateChanged(auth, (currentUser) => {
      
    
        if(currentUser){
         setUser(currentUser);
          
          
         
        }else {
         navigate("/");   
        }
      });
}
      getData();
      getLast();
 
      return () => {
        
      }
  }, [navigate, setuserDetails, setUser]); 
  
  const dashboard = () => {
    navigate(`/dashboard/${id}`, { state: id});
}



const setCollector = async(key, bool) => {

  let isCollector = bool;

  if(isCollector){
  await setDoc(doc(db, "users", key), {
   "COLLECTOR": false
  }, { merge: true });} else {
    await setDoc(doc(db, "users", key), {
      "COLLECTOR": true
     }, { merge: true });
  }

}
const CheckScreen = () => {
  if (window.matchMedia("(max-width: 767px)").matches)
{
// The viewport is less than 768 pixels wide
return false

}else{
return true
}
}

const restore = (filename) => {
  setInitial(false);
  setLoading(true);
  setTimeout(() => {
    
    ExportButton(filename);
    setLoading(false)
    setSuccess(true)
    setTimeout(function() {
	
      setSuccess(false);
  
      setShowConfirm(false)
      
      }, 900);
  }, 300);
}
  const sendChange = (email) => {
    setInitial(false);
    setLoading(true);
    setTimeout(() => {
      
      ResetPassword(email)
      setLoading(false)
      setSuccess(true)
      setTimeout(function() {
    
        setSuccess(false);
    
        setShowConfirmChange(false)
        
        }, 900);
    }, 300);
    
 
}
const driver = async() => {
  navigate(`/driver/${id}/logs`);
}
const operator = async() => {
  navigate(`/operator/${id}/logs`);
}
const collections = ()=>{
  navigate(`/collections/${id}/logs`);
}
 
    return( 
        <div className="min-h-screen flex flex-row bg-gray-100">
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
      <Navigation/>
      <div className="flex-1 px-2 sm:px-0 mx-4 my-4">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2 mb-2">
         
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img className="h-auto w-full mx-auto" src="./assets/SKLTODA.png" alt="" />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{userDetails?.NAME}</h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">SKLTODA Driver</h3>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                
                <li className="flex items-center py-3">
                  <span>Member since</span>
                  <span className="ml-auto"> {convertTimestamp(userDetails?.YEAR) }</span>
                </li>
              </ul>
            </div>
            {GetAuthLevel(userDetails?.AuthLvl) ? (
			     <>
                <div className="bg-white p-3 mt-3">
              <div className="image overflow-hidden">
                <img className="h-auto w-full mx-auto" src="./assets/SKLTODA.png" alt="" />
              </div>
           
              <h3 className="text-gray-600 font-lg text-semibold leading-6">User Logs</h3>
              <div className="grid grid-row-3 mt-4 gap-4">
  <button className="px-2 py-2 bg-blue-500 text-white rounded-lg" onClick={driver}>Driver</button>
  <button className="px-2 py-2 bg-blue-500 text-white rounded-lg" onClick={operator}>Operator</button>
  <button className="px-2 py-2 bg-blue-500 text-white rounded-lg" onClick={collections}>Collection</button>
 
</div>

            </div>
           			</>
                 ) : null}
       
          </div>
          <div className="w-full md:w-9/12 md:mx-2 h-auto">

            {/* buttons for printing */}
            <div className="bg-white p-3 shadow-sm rounded-sm ">
            <div className="grid md:grid-cols-2 text-sm gap-2">
                  <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 px-4  text-green-600 font-semibold" type="button" 
                  onClick={() => {setShowConfirmChange(true);
               
                  }} > Change Password </button>
                  <UpdateModal {...userDetails}/>
                  

                    
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                  
                  
                    
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
                    <div className="px-4 py-2">{userDetails?.GENDER}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Contact No.</div>
                    <div className="px-4 py-2">{userDetails?.CONTACT}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Full Address</div>
                    <div className="px-4 py-2">{userDetails?.ADDRESS}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Precint No.</div>
                    <div className="px-4 py-2">{userDetails?.PRECINT}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">License Number</div>
                    <div className="px-4 py-2">
                    {userDetails?.LICENSE}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Birthday</div>
                    <div className="px-4 py-2">{convertTimestamp(userDetails.BIRTHDATE)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4"></div>

            {GetAuthLevel(userDetails?.AuthLvl) ? (
			          <>
            <div className="bg-white p-3 mt-3 shadow-sm rounded-sm">
              <div className="grid grid-cols-1">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span clas="text-green-500">
                      <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <span className="tracking-wide">Collector</span>
                  </div>
                  <ul className="list-inside space-y-2">
                  <div className="min-w-auto leading-normal">
                        <div className="w-full">
                           <div className="flex flex-row w-full">
                              <div className="w-2/12 sm:w-2/12 px-2 px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> NO. </div>
                              <div className="w-7/12 sm:w-6/12 px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> NAME </div>
                      
                              <div className="w-4/12 sm:w-5/12 px-3 sm:w-full text-center px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> ACTION  </div>
                              
                           </div>
                        </div>
                        <div className="flex flex-col"> {allUser.map((user, index) => {
                           return(
                           <div className="flex flex-row w-full">
                              <div className="w-2/12 sm:w-2/12 px-2 py-1 border-b border-black-100 bg-white text-sm">
                                 <div className="flex items-center"> {/* Name */} <div className="ml-3">
                                      {index+1}
                                    </div>
                                 </div>
                              </div> {/* Name */}
                              <div className="w-7/12 sm:w-6/12 px-3 py-1 border-b border-white-600 bg-white text-xs md:text-base">
                                 <p className="text-gray-900 whitespace-no-wrap"> {user.NAME} </p>
                              </div> {/* Name */}
                           
                            
                              <div className="w-4/12 sm:w-5/12 px-3 py-1 border-b border-white-600 bg-white text-sm flex sm:flex-col lg:flex-row justify-center ">
                                <button className={`${user.COLLECTOR ? `bg-green-500` : `bg-red-500`} disabled:bg-gray-300 disabled:border-gray-700 disabled:text-gray-700   text-xs  text-white font-bold  px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} type="button" 
                                onClick={() => {setCollector(user.AuthID, user.COLLECTOR)}}
                                >
                              COLLECTOR
                              </button>
                            </div>
                           </div> 
                           ); })}
                        </div>
                     </div>
                  </ul>
                </div>
                
              </div>
            </div>

            <div className="bg-white p-3 mt-3 shadow-sm rounded-sm">
              <div className="grid grid-cols-1">
                <div>
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                    <span clas="text-green-500">
                      <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <span className="tracking-wide">Back up</span>
                  </div>
            
                  <ul className="list-inside space-y-2">
                  <div class=" p-4">
              <div class="border-b-2 border-gray-300 mb-2">
                <div class="grid grid-cols-2 gap-4">
                  <div class="font-bold text-center">Date</div>
                  <div class="font-bold text-center">Action</div>
                </div>
              </div>
              <div>
                {files.map((file) => (
                  <div class="grid grid-cols-2 gap-4" key={file.name}>
                    <div className=" border-r-1 text-center "><span>{(file.name.replace(".json", "")).replaceAll("_", " ")}</span></div>
                    <div className="flex justify-center">
                    <button className={`w-3/4 disabled:bg-gray-300 disabled:border-gray-700 disabled:text-gray-700 bg-blue-400 text-white font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} type="button" onClick={() =>{
                      setShowConfirm(true)
                      setFileName(file.name)
                    }}
                             
                                >
                       Restore
                              </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                  </ul>
                </div>
                
              </div>
            </div>
           			</>
                 ) : null}
                 {showConfirm ? (
			  <>
			   
				<div
				  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
				>
					<div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
    
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
      <div class="md:flex items-center">
        <div class="rounded-full  flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
          <i class="bx bx-error text-3xl">
			
			{showInitial? (
				<>	
				<WarningIcon className="fill-yellow-500"/>
				</>
			) : null}

			{showLoading? (
				<>	
				<span class="loader"></span>
				</>
			) : null}
			{showSucess? (
				<>	
				<CheckIcon />
				</>
			) : null}
			
		  </i>
        </div>
        <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
          <p class="font-bold">Restore</p>
          <p class="text-sm text-gray-700 mt-1">You will restore the data of collection record. This action cannot be undone.
          </p>
        </div>
      </div>
      <div class="text-center md:text-right mt-4 md:flex md:justify-end">
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md mx-2	:ml-2 md:order-2" onClick={()=>{
          restore(filename)
        }} >Restore</button>
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 mx-2
          md:mt-0 md:order-1" onClick={() => {
			setShowConfirm(false);
		  }}>Cancel</button>
      </div>
    </div>
  </div>
				</div>
				<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
			  </>
			) : null}

{showChangeConfirm? (
			  <>
			   
				<div
				  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
				>
					<div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
    
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
      <div class="md:flex items-center">
        <div class="rounded-full  flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
          <i class="bx bx-error text-3xl">
			
			{showInitial? (
				<>	
				<WarningIcon className="fill-yellow-500"/>
				</>
			) : null}

			{showLoading? (
				<>	
				<span class="loader"></span>
				</>
			) : null}
			{showSucess? (
				<>	
				<CheckIcon />
				</>
			) : null}
			
		  </i>
        </div>
        <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
          <p class="font-bold">Change password</p>
          <p class="text-sm text-gray-700 mt-1">Are you sure you want to change password?
          Check email after clicking confirm
          </p>
        </div>
      </div>
      <div class="text-center md:text-right mt-4 md:flex md:justify-end">
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md mx-2	:ml-2 md:order-2" onClick={()=>{
         sendChange(email)
        }} >Confirm</button>
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 mx-2
          md:mt-0 md:order-1" onClick={() => {
			setShowConfirmChange(false);
		  }}>Cancel</button>
      </div>
    </div>
  </div>
				</div>
				<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
			  </>
			) : null}
            
          </div>
        </div>
      </div>
      
    </div> 
    );
}
