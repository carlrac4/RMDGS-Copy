import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useLocation, useNavigate, useParams} from "react-router-dom";
import { db } from "../firebase-config";
import { UpdateSharp } from "@mui/icons-material";
import {onSnapshot, snapshot,addDoc, collection,setDoc, query, orderBy, where, startAfter, limit, getDocs, doc, endBefore, limitToLast, updateDoc,getCountFromServer, deleteField, Transaction} from "firebase/firestore";
import CollectionModal from "./components/collectionModal"
import AddNewMember from "./components/addMember";
import { auth } from "../firebase-config";
import {AuthLvlCollection} from "./auth/auth"
import { onAuthStateChanged, signOut} from "firebase/auth";
import { Navigation, Footer } from "../templates/navigation";
import { MonthlyReport } from "../PrintComponent";
import {AuthLevel} from "./auth/auth"

function segregateObjectByValue(obj) {
   const paidObj = {};
   const passObj = {};

   Object.entries(obj).forEach(([key, value]) => {
     if (value === "paid") {
       paidObj[key] = value;
     } else if (value === "pass") {
       passObj[key] = value;
     }
   });
 
   return {
     paidList: paidObj,
     passList: passObj
   };
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

function getMonth(){
  const date = new Date();
  let month = date.getMonth();
  let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  let currentMonth = months[month];
  return currentMonth;

}

function checkNestedValue(obj, level, ...rest) {
   if (obj === undefined) return undefined;
   if (rest.length === 0 && obj.hasOwnProperty(level) && obj[level] === "paid") {
     return obj[level];
   }
   return checkNestedValue(obj[level], ...rest);
 }
 function checkpass(obj, level, ...rest) {
   if (obj === undefined) return undefined;
   if (rest.length === 0 && obj.hasOwnProperty(level) && obj[level] === "pass") {
     return obj[level];
   }
   return checkpass(obj[level], ...rest);
 }
function checkNested(obj, level,  ...rest) {
  if (obj === undefined) return true
  if (rest.length == 0 && obj.hasOwnProperty(level)) return false
  return checkNested(obj[level], ...rest)
}

export default function CollectionDetails() {
  const [filter, setFilter] = useState();
  const [user, setUser] =  useState([]);
  const [page, setPage] =  useState(1);
  const collectionRef = collection(db,"collection");
  const [LastDoc, setLastDoc] = useState();
  const [pageNumber, setPageNumber] = useState();
  const [monthly, setMonthly] = useState([]);
  const fetchData = async (q) => {
    onSnapshot(q,(querySnapshot) => { 
         var items = [];
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);                 
         querySnapshot.forEach(function(doc) {
             items.push({ key: doc.id, ...doc.data() });
         });
         setUser(items);
     })
  };

    const {collectorID, authLvl, Collect} = useParams();
    
    const userId = collectorID;
    const AuthLvl =  authLvl.split("~").pop();
    const Collector = Collect.split("=").pop();

    function isCollector (Collector){
        if(Collector == 'true'){
          return true;
        }else{
          return false;
        }
    } 
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
  

    useEffect(() => {
      const getDailyRecord = async (id) => {
        const unsub = onSnapshot(doc(db, "Records", `collectionRecord`), (doc) => {
          setMonthly(doc.data());
        });
        return unsub;
      };    
    
  
      const q = query(collectionRef, orderBy("NAME"), limit(20));   
      fetchData(q);
      onAuthStateChanged(auth, (currentUser) => {
         if(currentUser){
     
         }else {
          navigate("/");   
         }
      
       });
      return () => {
        getDailyRecord();
       
      }
    }, [])
    const showNext = ({ item }) => {
    if(user.length === 0) {
        //use this to show hide buttons if there is no records
    } else {
      const q = query(collectionRef, orderBy("NAME"), limit(20), startAfter(item.NAME)); 
        fetchData(q);
        setPage(page + 1); 
     
    }
};
    const showPrevious = ({item}) => {
      const q = query(collectionRef, orderBy("NAME"), limitToLast(20), endBefore(item.NAME)); 
      setPage(page - 1);
      fetchData(q);
    };

    const dateEncode = getDate().replaceAll("/","m");

    const update = async(key,id) =>{
 
      await setDoc(doc(db, "collection", key), {
        "TRANSACTION": {[dateEncode]:"paid"}
      }, { merge: true });

      await setDoc(doc(db,"Records","collectionRecord"), {
         [`${dateEncode}`]:{[key]:"paid"}
       }, { merge: true });
      
      await addDoc(collection(db, "CollectionLogs"), {
        'user':userId,
        "date":dateEncode,
        'action':'paid',
        'memberID': id
      });
       
    
      }
   const lvl = AuthLvlCollection(AuthLvl, isCollector);

    const cancel = async(key, id ) =>{
      const listRef = doc(db, "collection", key);
      await updateDoc(listRef, {
          [`TRANSACTION.${dateEncode}`]: deleteField(),
      });
      const recordsRef = doc(db, "Records", "collectionRecord");
      await updateDoc(recordsRef, {
         [`${dateEncode}.${key}`]: deleteField(),
     });
     await addDoc(collection(db, "CollectionLogs"), {
      'user':userId,
      "date":dateEncode,
      'action':'cancelled',
      'memberID': id
    });

    }
   
    const pass = async(key, id ) =>{
      await setDoc(doc(db, "collection", key), {
         "TRANSACTION": {[dateEncode]:"pass"}
       }, { merge: true });
 
       await setDoc(doc(db,"Records","collectionRecord"), {
          [`${dateEncode}`]:{[key]:"pass"}
        }, { merge: true });
        await addDoc(collection(db, "CollectionLogs"), {
          'user':userId,
          "date":dateEncode,
          'action':'pass',
          'memberID': id
        });

    }

    const navigate = useNavigate();
    const navigateToConfirmed= (user) =>{
      navigate(`/collection/${userId}/${user.key}/authLv~${AuthLvl}/collector=${Collector}`, {state: user});
   
  
   };
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
  const monthlyRecord = GetMonthly(filter) ?? GetMonthly("m") ;
  const classes =
    "relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";
  return (
    <div className="min-h-screen flex min-w-screen w-full flex-row  ">
   <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
   <Navigation />
   <div className="flex-1 px-2 sm:px-4 sm:w-fit mx-1 my-4">
      <div className="rounded-md w-full md:flex flex justify-center
               no-wrap  mb-3">
         {/* <div className=" flex items-center justify-between p-3">
            <input class="bg-gray-50 md:outline-black ml-1 block " type="text" name="" id="" placeholder="Search" onChange={(event)=> {setSearch(event.target.value);}}/>
            <button className="py-2 px-4 bg-transparent text-indigo-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0" onClick={search}> Search </button>
         </div> */}
       
    
      
      </div>
      <div className="md:flex no-wrap md:-mx-2 mb-2 w-full">
        <div className="flex flex-col w-full">
        <div className="bg-white  border-t-4 border-green-400 shadow rounded-md w-100 md:flex flex justify-center
         no-wrap  mb-3">       
                    <div className=" flex items-center justify-between p-3">
                    <span className=" text-2xl">COLLECTION </span>                           
                    </div>
                     <div className=" flex items-center justify-between p-3">
                        
                    </div>
                </div>
      <div className="bg-white w-full p-3 h-auto shadow rounded-sm mb-3">
            <div className="grid md:grid-cols-2 text-sm gap-2  ">
                  <div className="grid grid-cols-2 gap-2">
                  <input class=" text-center bg-gray-50 md:outline-black ml-1 block " type="text" name="" id=""
                                    placeholder="Search" onChange={(event) => {setSearch(event.target.value);}}/>    
                      <button
                      className="py-2 px-4 bg-transparent text-center text-indigo-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                      onClick={search}>
                                Search
                            </button>          
                
                         
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                  <AddNewMember auth={AuthLvlCollection(AuthLvl,Collector)}/>
                 
                  </div>
            </div> 
           
            </div>
            <div className="bg-white w-full p-3  shadow rounded-sm mb-3">

            <div className="grid md:grid-cols-2 text-sm my-5 gap-2 ">
                  <div className="grid grid-cols-2 gap-2">
                  
                  <Select
                    options={options}
                    className={{ classes }}
                    placeholder="Select Option"
                    onChange={(e) => {
                    setFilter(e.value)
                    }}
                  />
                  <MonthlyReport {...monthlyRecord}/>
                         
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                  <DailyReport />
                  </div>
            
       </div>
       </div>
       </div>
      </div>
      <div className="md:flex no-wrap md:-mx-2 ">
         <div className="bg-white p-3 rounded-md w-full">
            <div>
               <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-flex min-w-full justify-center shadow rounded-lg overflow-hidden">
                     <table className="min-w-auto leading-normal">
                        <thead>
                           <tr>
                              <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> NO. </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> NAME </th>
                              <th className="text-center px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> Today <br /> </th>
                              
                           </tr>
                        </thead>
                        <tbody> {user.map((user, index) => {
                           return(
                           <tr>
                              <td className="px-3 py-1 border-b border-black-100 bg-white text-sm">
                                 <div className="flex items-center"> {/* Name */} <div className="ml-3">
                                       <p className="text-gray-900 whitespace-no-wrap">{
                                          page >= 2 ? ((page - 1) * 20) + 1 + index :index +1

                                          } </p>
                                    </div>
                                 </div>
                              </td> {/* Name */} <td className="px-5 py-1 border-b border-white-600 bg-white text-sm">
                                 <p className="text-gray-900 whitespace-no-wrap"> {user.NAME} </p>
                              </td> {/* Name */}
                                     
                              <td className="px-5 py-1 border-b border-white-600 bg-white text-sm flex sm:flex-col lg:flex-row justify-center ">
                              <div class="flex flex-col md:flex-row">
                              <button type="button" class="focus:outline-none text-white md:w-full bg-green-700 mx-2 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 w-full dark:hover:bg-green-700 disabled:bg-gray-700 dark:focus:ring-green-800"
                              disabled={lvl || checkNestedValue(user,"TRANSACTION",dateEncode) == "paid"}              
                              onClick={() =>{update(user.key, user.ID)}} > Pay </button>
                              <button type="button" class="focus:outline-none text-white md:w-full bg-blue-700 mx-2 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 w-full dark:hover:bg-blue-700 dark:focus:ring-green-800 disabled:bg-gray-700" 
                               disabled={lvl || checkpass(user,"TRANSACTION",dateEncode) == "pass" || checkNestedValue(user,"TRANSACTION",dateEncode) == "paid" }    
                              onClick={() =>{pass(user.key, user.ID)}} > Pass </button>
                              <button type="button" class="focus:outline-none text-white md:w-full bg-red-700 mx-2 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 w-full disabled:bg-gray-700 dark:hover:bg-red-700 dark:focus:ring-red-800" disabled={lvl || checkNested(user,'TRANSACTION',[dateEncode])}  id="cancel"
                              onClick={() => {cancel(user.key, user.ID)}}> Cancel </button>
                              <button type="button" class="focus:outline-none text-white md:w-full bg-yellow-700 mx-2 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-yellow-600 w-full dark:hover:bg-yellow-700 dark:focus:ring-green-800"  onClick={()=>navigateToConfirmed(user)}> View </button>
                              
                              </div>
                              </td>
                           </tr> 
                           ); })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div className="bg-white rounded-md w-100 md:flex flex justify-center
               no-wrap  mb-3">
         <div className=" flex items-center justify-between p-3">
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
               <div className="inline-flex mt-2 xs:mt-0">
                  { page === 1 ? '' : <button onClick={()=> showPrevious({ item: user[0] }) } className="text-sm text-white transition duration-150 hover:bg-blue-400 bg-blue-500 font-semibold py-2 px-4 rounded-l" id="prev"> Prev </button> } &nbsp; &nbsp;
                  {/* <input onChange={(event)=> {setPageNumber(event.target.value)}}></input>
                  <button onClick={jumpto}> jump</button> */}
                  { user.length < 20 ? '' : <button onClick={()=> showNext({ item: user[user.length - 1] })} className="text-sm text-white transition duration-150 hover:bg-blue-400 bg-blue-500 font-semibold py-2 px-4 rounded-r" id="next"> Next </button> }
               </div>
            </div>
         </div>
         <div className=" flex items-center justify-between p-3">
         </div>
      </div>
   </div>

</div>

 );
}



export function DailyReport() {
   const [showModal, setShowModal] = React.useState(false);
   const [confirmModal, setConfirmModal] = useState(false);
   const [daily, setDaily]= useState("");

   const [monthly, setMonthly] = useState([]);
   const currentDate = getDate().replaceAll("/","m");
    let checklang;
    const dateToday = getDate().replaceAll("/","m");
    daily == undefined ? checklang = {[dateToday]: ""} : checklang = daily;
   const { paidList, passList } = segregateObjectByValue(checklang, currentDate);
   const [total, setTotal] = useState();
  
   let totalNumber;
   total == undefined ? totalNumber = 0 : totalNumber = total.total;
  // Function to extract date from key

   
   useEffect(() => {
      const getDailyRecord = async (id) => {
         const unsub = onSnapshot(doc(db, "Records", `collectionRecord`), (doc) => {
          
           setDaily(doc.data()[currentDate]);
           setMonthly(doc.data());
         });
         return unsub;
       };
       
    

   
   }, [setTotal,setDaily, setMonthly])
   return (
     <>
           <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=> setShowModal(true)}
			>
			Daily report
		</button>
		{showModal ? (
		<>
		<div
				  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
				>
					<div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
    
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0  z-50 mb-4 mx-4 md:relative">
      <div class="md:flex items-center">
       
        <div class="mt-4 md:mt-0  text-center md:text-left">
          <p class="font-bold text-center">Daily Report</p>
          <p class="text-sm text-gray-700 mt-1 p-3">Total Collection Today - {getDate().replaceAll("/"," ")}
          </p>
          
        </div>
        
      </div>
      <div class="p-4 bg-gray-100">
      <div class="bg-gray-100 p-4">
  <div class="w-full table-auto">
    <div>
      <div class="text-gray-700">
        <th class="font-bold text-left"></th>
        <th class="font-bold text-right"></th>
      </div>
    </div>
    <div>
      <div class="bg-gray-200  flex flex-row">
        <div class="p-2 w-full">Total Paid:</div>
        <div class="p-2 text-right font-bold  w-full">{ Object.values(paidList).length }</div>
      </div>
      <div class="  flex flex-row">
        <div class="p-2 w-full">Total Amount:</div>
        <div class="p-2 text-right font-bold justify-self-end">{ Object.keys(paidList).length * 10 }</div>
      </div>
      <div class="bg-gray-200  flex flex-row">
        <div class="p-2 w-full">Total Pass:</div>
        <div class="p-2 text-right font-bold w-full">{ Object.keys(passList).length  }</div>
      </div>
    </div>
  </div>
</div>
      </div>
      <div class="text-center md:text-right mt-4 md:flex md:justify-end">
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1" onClick={() => {setShowModal(false)}}>Close</button>
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
 

 export function GetMonthly(month) {
 
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
     const getDailyRecord = async (id) => {
        const unsub = onSnapshot(doc(db, "Records", `collectionRecord`), (doc) => {
          setMonthly(doc.data());
        });
        return unsub;
      };    
  
    
     getDailyRecord();
    
  }, [ setMonthly])


  function filterObject(obj, filterString) {
   const filteredObj = {};
   for (const key in obj) {
     if (key.includes(filterString)) {
       filteredObj[key] = obj[key];
     }
   }
   return filteredObj;
 }
   
  const getCurrentMonth = () => {
  
   const filteredObj = filterObject(monthly, month);

const result = {};

for (const key in filteredObj) {
  const values = filteredObj[key];
  let passCount = 0;
  let paidCount = 0;
  for (const value in values) {
    if (values[value] === 'pass') {
      passCount++;
    } else if (values[value] === 'paid') {
      paidCount++;
    }
  }
  result[key] = {};
  result[key]['pass'] = passCount;
  result[key]['paid'] = paidCount;
}

const data = {};

for (const key in result) {
  filteredObj[key] = {
    paid: result[key].paid,
    pass: result[key].pass
  };
}

return result
  }

  const result = getCurrentMonth();
return {...result};

  
}
