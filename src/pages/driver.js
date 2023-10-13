import { async } from "@firebase/util";
import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {Navigation, Footer} from "../templates/navigation";
import {onSnapshot, snapshot, collection, query, orderBy, where, startAfter, limit, getDocs, doc, endBefore, limitToLast, addDoc} from "firebase/firestore";
import '../css/driver.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import DriverModal from './components/driverModal';
import ReactDOM from 'react-dom';
import { auth } from "../firebase-config";
import {AuthLevel} from "./auth/auth"
import { onAuthStateChanged, signOut} from "firebase/auth";
import { DriverMasterList } from "../PrintComponent";

function GetData(){
 
    const [data, setData] = useState()
    const collectionRef = collection(db,"Driver");
    const q = query(collectionRef, orderBy("NAME"));   
    const fetchData = async () => {
             onSnapshot(q,(querySnapshot) => { 
                  var items = [];
                  querySnapshot.forEach(function(doc) {
                      items.push(doc.data().NAME);
                  });
                  setData(items);
              })
      };
      fetchData();
      
      return data;
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
function Driver() {
  const{authLvl, userID} = useParams();
  const authentication = authLvl.split("~").pop()

    const location = useLocation();
  const [user, setUser] =  useState([]);
  const [page, setPage] =  useState(1);
  const collectionRef = collection(db,"Driver");
    const [LastDoc, setLastDoc] = useState();
  //loading initial data
  const memberID = userID.split("=").pop();

  
  useEffect(() => {
   
    onAuthStateChanged(auth, (currentUser) => {
        if(currentUser){
      
        }else {
         navigate("/");   
        }
     
      });
    const q = query(collectionRef, orderBy("NAME"), limit(20));   
      
    const fetchData = async () => {
             onSnapshot(q,(querySnapshot) => { 
                  var items = [];
                   setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);  
                  querySnapshot.forEach(function(doc) {
                      items.push({ key: doc.id, ...doc.data() });
                  });
                  setUser(items);
              })
      };
      fetchData();
  }, []);

  const [searchText, setSearch] = useState();
  const search = () => {
    const q = query(collectionRef, where('NAME', '>=', searchText), where('NAME', '<=', searchText+ '\uf8ff'), limit(20));   
    const fetchData = async () => {
             onSnapshot(q,(querySnapshot) => { 
                  var items = [];
                   setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);  
                  querySnapshot.forEach(function(doc) {
                      items.push({ key: doc.id, ...doc.data() });
                  });
                  setUser(items);
              })
      };
      fetchData();
  };

  const showNext = ({ item }) => {
    if(user.length === 0) {
        //use this to show hide buttons if there is no records
    } else {
        const fetchNextData = async () => {

            const q = query(collectionRef, orderBy("NAME"), limit(20), startAfter(item.NAME)); 
                onSnapshot(q,(querySnapshot) => {
                  setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);       
                    const items = [];
                    querySnapshot.forEach(function(doc) {
                        items.push({ key: doc.id, ...doc.data() });
                    });
                    setUser(items);
                    setPage(page + 1); 
                })
        };
        fetchNextData();
    }
};
const showPrevious = ({item}) => {
  const fetchPreviousData = async () => {

    const q = query(collectionRef, orderBy("NAME"), limitToLast(20), endBefore(item.NAME)); 
        
          onSnapshot(q,(querySnapshot) => {
              const items = [];
              setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);       
              querySnapshot.forEach(function(doc) {
                  items.push({ key: doc.id, ...doc.data() });
              });
              setUser(items);
              setPage(page - 1);
          })
  };
  fetchPreviousData();
};
  const navigate = useNavigate();
  const navigateToConfirmed= (user) =>{
  
    navigate(`/profile/${userID}/${user.key}/authLv~${authentication}`, { state: user, admin: userID });

    // here we will redirect user and send your data into state
 };




    
       

    return( 
     <div className="min-h-screen flex flex-row ">
     
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
      <Navigation />
    <div className="flex-1 px-2 sm:px-0 mx-4 my-4">
    <div className="bg-white  border-t-4 border-green-400 shadow rounded-md w-100 md:flex flex justify-center
         no-wrap  mb-3">       
                    <div className=" flex items-center justify-between p-3">
                    <span className=" text-2xl">DRIVER'S LIST</span>                           
                    </div>
                     <div className=" flex items-center justify-between p-3">
                        
                    </div>
                </div>
         <div className="bg-white shadow rounded-md w-100 md:flex flex justify-center
         no-wrap  mb-3">     
           
                    <div className=" flex items-center justify-between p-3">
                     <input class="py-2 px-2 bg-gray-100  font-semibold  rounded hover:bg-white  mx-3 " type="text" name="" id=""
                                    placeholder="Search" onChange={(event) => {setSearch(event.target.value);}}/>    
                      <button
                      className="py-2 px-4 bg-transparent text-indigo-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                      onClick={search}>
                                Search
                            </button>                                    
                    </div>
                     <div className=" flex items-center justify-between p-3">
                     <DriverModal authLvl={AuthLevel(authentication)} id={memberID}/>   
                        <ConfirmModal />
                                                   
                    </div>
                </div>
        <div className="md:flex no-wrap md:-mx-2 ">
                <div className="bg-white p-8 rounded-md w-full">
                    <div>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                ADDRESS
                                            </th>
                                          
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                            <th>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {user.map((user) => {
                                      return(
                                        <tr>
                                        <td className="px-5 py-1 border-b border-black-100 bg-white text-sm">
                                            <div className="flex items-center">                                              
                                              
                                                {/* Name */}
                                                <div className="ml-3">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                    {user.NAME}
                                                    </p>
                                                </div>

                                            </div>

                                        </td>
                                            {/*Address*/}
                                            <td className="px-5 py-1 border-b border-white-600 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{user.ADDRESS}</p>
                                            </td>
                                            {/* Contact No */}
                                           
                                          <td className="px-5 py-1 border-b border-white-600 bg-white text-sm">                                        
                                                <button onClick={()=>navigateToConfirmed(user)} className="text-green-400 hover:text-green-600 underline text-center">View</button>                                               
                                            </td>
                                        </tr>
                                        );
                                      })} 
                                    </tbody>
                                </table>
                                <div
                                    className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                                    <div className="inline-flex mt-2 xs:mt-0">
                                        {
                                         page === 1 ? '' : 
                                        <button
                                         onClick={() => showPrevious({ item: user[0] }) }  className="text-sm text-white transition duration-150 hover:bg-blue-400 bg-blue-500 font-semibold py-2 px-4 rounded-l">
                                            Prev
                                        </button>
                                        }
                                        &nbsp; &nbsp;
                                        {
                                           user.length < 20 ? '' :
                                        <button
                                        onClick={() => showNext({ item: user[user.length - 1] })}  className="text-sm text-white transition duration-150 hover:bg-blue-400 bg-blue-500 font-semibold py-2 px-4 rounded-r">
                                            Next
                                        </button>                                       
                                        }
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

export default Driver;




function ConfirmModal() {
    const [showModal, setShowModal] = React.useState(false);
    const{userID} = useParams();
    const memberID = userID.split("=").pop();
    const dateEncode = getDate().replaceAll("/","m");
    const addLogs = async () => {
      await addDoc(collection(db, "DriverLogs"), {
        'user':memberID,
        "date":dateEncode,
        'action':"Generated Driver's Masterlist"
        });
    }
    
  
      const  unsubscribe = async () => {
          const querySnapshot = await getDocs(collection(db,"Driver"));
    
          const document =[];
          querySnapshot.forEach((doc) => {
            document.push({
              ...doc.data(),
              id: doc.id
            });
          });
        
  
          const strObj = JSON.stringify(document);
     
          localStorage.setItem('DrvMasterList', strObj);
  
       
        }
      function beforeOpen(){
          
          if ("DrvMasterList" in localStorage) {
              addLogs();
              setShowModal(true)
            
          } else {
              unsubscribe();
              addLogs();
              setShowModal(true);
          }
       
      }
    
        
   
     
    
   
    return (
      <>
        <button
          className="bg-blue-500 text-white mx-3 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => beforeOpen() }
        >
          Print Masterlist
        </button>
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-yellow-300 w-10 h-10 mx-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
           
                    </h3>
                    <h3 className="text-3xl font-semibold text-yellow-300"> Confirm Printing of Masterlist</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      By click the confirm button opens up the printing window.
                    </p>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <DriverMasterList type="button"
                       />
                  
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