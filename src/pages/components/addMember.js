
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import React, {useState, useEffect} from "react";
import { db } from "../../firebase-config";
import { collection, addDoc,doc, setDoc, onSnapshot,query, where,docs, getDocs} from "firebase/firestore";
import { ReactComponent as CancelIcon } from "./assets/cancel.svg";
import { ReactComponent as AddIcon } from "./assets/add.svg";
import { ReactComponent as WarningIcon } from "./assets/warning.svg";
import { ReactComponent as CheckIcon } from "./assets/check.svg";
import { async } from '@firebase/util';
import { useNavigate, useLocation, useParams, Link} from "react-router-dom";

// function emptyRecord(name){
//     let nyeam = {};

//     const pop = () => {
//         let nyeas = {}
//         for(let i = 1; i <= 31; i++){
//             let day = "Day"+i;
            
//             nyeas = {...nyeas,[day]:0};
//         }
//         return nyeas;
//     }
//     const month = ["january","february","march","april","may","june","july","august","september","october","november","december"];
   
//     month.map((key, value) => { 
//         nyeam = {...nyeam,"NAME":name,[key]:pop()}
//     }); 
//     return nyeam;

    
// }
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); 
}
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    
  },
};



// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');


function validateInput(input) {
  const regex = /^[a-zA-Z]+([.-]?[a-zA-Z]+)*$/;
  return regex.test(input);
}
function getDate(){
	const date = new Date();
  
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let months = ["January","February","March","April","May","June","July","Aaugust","September","October","November","December"]
  
  let currentDate = day+"/"+months[month]+"/"+year;
  return currentDate
  }

export default function AddNewMember(auth) {


  const [showInitial, setInitial] = React.useState(true);
  const [showLoading, setLoading] = React.useState(false);
  const [showSuccess, setSuccess] = React.useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [valid, setValid] = useState(false)
  const [ disable, setDisable] = useState(false)
  const [ exist, setExist] = useState(false);
  const [details, setDetails] = useState();
  const classes = `relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`;
  
   
  const getLast = async() => {

    const unsub = onSnapshot(doc(db, "Records", "collection"), (doc) => {
    setDetails(doc.data())
    });
  }
   
    useEffect(() => {
    
    getLast();
    
    }, []);
  
 
  const handleLastNameBlur = (event) => {
    if (!validateInput(event.target.value)) {
      event.target.className += ' border-2 border-rose-600';
    } else {
      event.target.className -= ' border-2 border-rose-600';
      event.target.className += 'relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm';
    
    }
  };

  const handleFirstNameBlur = (event) => {
    if (!validateInput(event.target.value)) {
      event.target.className += ' border-2 border-rose-600';
    } else {
      event.target.className -= ' border-2 border-rose-600';
      event.target.className += 'relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm';
    
    }
  };

  const handleMiddleNameBlur = (event) => {
    if (event.target.value.length !== 1) {
      event.target.className += ' border-2 border-rose-600';
    } else {
      event.target.className -= ' border-2 border-rose-600';
      event.target.className += 'relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm';
    
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // do something with the form data
  };
  
  

  const checkValue = async() => {
    if(firstname.length == 0 || lastname.length == 0){
   
    setDisable(true)

    }else{
 
     const fullname = capitalize(lastname)+", "+ capitalize(firstname) +" "+ capitalize(middlename) + (middlename ? "." : " ");

     const result = await checkNameExists(fullname);

      if(result) {
        setExist(true)
     }else{
      setExist(false)
      setConfirmModal(true)
      setIsOpen(false)
      setInitial(true);
     }
   
  
    }
  }

  const checkNameExists = async (name) => {
    const collectionRef = collection(db, 'collection');
    const q1 = query(collectionRef, where('NAME', '==', name));
    
    try {
      const querySnapshot = await getDocs(q1);
      return querySnapshot.size > 0;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);
  
  function openModal() {
    
    setIsOpen(true);
    setDisable(false)
    setExist(false)

  
  }

  function afterOpenModal() {
     
  
    
  }
  
  function closeModal() {
    setIsOpen(false);
    setFirstname("");
    setLastname("");
    setMiddlename("")
  }

       
  const{collectorID} = useParams();
  const Collector = collectorID.split("=").pop();

        const month = ["january","february","march","april","may","june","july","august","september","october","november","december"];
 const addMember = async() =>{
  setInitial(false)
  setLoading(true)
    const fullname = capitalize(lastname)+", "+ capitalize(firstname) +" "+ capitalize(middlename) + (middlename ? "." : " ");


   const docRef = await addDoc(collection(db, "collection"), {
  'NO': details.lastID +1,
  'NAME': fullname,
  'TRANSACTION': "" 
});

await setDoc(doc(db, "Records", 'collection'), {
  'lastID': details.lastID + 1
 },  { merge: true }
 
 
 );
 const dateEncode = getDate().replaceAll("/","m");
 await addDoc(collection(db, "CollectionMemberLogs"), {
  'user':Collector,
  "date":dateEncode,
  'action':'Add User',
  'memberID': details.lastID + 1
  });


setTimeout(function () {
  setLoading(false)
  setSuccess(true);
  
  setConfirmModal(false);
  setSuccess(false)
}, 900);
 }

 var classl = `.${classes} + .${valid ? " " : " border-2 border-rose-600"}`;
  return (
    <div>
      <button onClick={openModal} disabled={auth.auth} type="button" class="disabled:bg-gray-300 disabled:border-gray-700 disabled:text-gray-700 w-full py-2 px-4 bg-transparent text-indigo-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0">Add new member</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
       
      >
      
        
        <div class="px-3 py-3 mb-4 text-center "><span>Member Record</span></div>
     
        <form onSubmit={handleSubmit}>

        <div className="col-span-2 sm:col-span-2 lg:col-span-2">

          {disable ? (
											<div className="bg-red-500 w-full">
												<label htmlFor="warning" class="block text-sm font-medium text-white p-3">Please fill out first name and last name</label>
												</div>
											):null }
                       {exist ? (
											<div className="bg-red-500 w-full">
												<label htmlFor="warning" class="block text-sm font-medium text-white p-3">Driver already in records</label>
												</div>
											):null }
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Last Name</label>
												<input 
                        onBlur={handleLastNameBlur}
											 id="last_name" name="last_name" onChange={(event)=> {setLastname(event.target.value);}} required type="text" className={classes} />
											</div>
											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">First Name</label>

												<input 
                        onBlur={handleFirstNameBlur}
												 id="first_name" name="first_name" 
												 onChange={(event)=> { setFirstname(event.target.value); }} required type="text" className={classes} />
											</div>

											<div className="col-span-1 sm:col-span-1 lg:col-span-1">

												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">M.I.</label>

												<input id="middle_name" 
                        onBlur={handleMiddleNameBlur} name="middle_name"  max="1" onChange={(event)=> {setMiddlename(event.target.value);}} type="text" className={classes} />
											</div>
         </form>   
                       
       
        <div class="px-3 py-2 justify-end m-3 ">         <button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={closeModal}>
											Close
										</button>
										<button className="text-white bg-blue-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"  onClick={checkValue
                    
                    } >
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
                    <p class="font-bold">Add New Driver</p>
                    <p class="text-sm text-gray-700 mt-1">
                     Are you sure you want to add <span className="text-red-700 italic">{capitalize(lastname)+", "+ capitalize(firstname) +" "+ capitalize(middlename) + (middlename ? "." : " ")}</span> ?
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
                      setIsOpen(true)
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
