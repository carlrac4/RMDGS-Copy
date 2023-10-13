import React, { useState, useEffect } from "react";
import { auth } from "../firebase-config";
import { db } from "../firebase-config";
import { Timestamp,onSnapshot} from "firebase/firestore";
import { onAuthStateChanged} from "firebase/auth";
import { Navigation } from "../templates/navigation";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { collection, query, orderBy, where, startAfter, limit, doc, endBefore, limitToLast, getDocs} from "firebase/firestore";
import '../css/driver.css';
import { useLocation, useNavigate, useParams} from "react-router-dom";

function joinArrays(primaryArray, secondaryArray, primaryIdKey, secondaryIdKey) {
  return primaryArray.map((item) => {
    const matchingItem = secondaryArray.find((secondaryItem) => secondaryItem[secondaryIdKey] === item[primaryIdKey]);
    return {
      ...item,
      ...matchingItem
    };
  });
}

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
export default function ActivityLogs() {
  const [final, setFinal] = useState();
  const [allUser, setAllUser] = useState();
  const [user, setUser] =  useState([]);
  const [page, setPage] =  useState(1);
  const collectionRef = collection(db,"DriverLogs");
    const [LastDoc, setLastDoc] = useState();

    const getUserName = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ key: doc.id, ...doc.data() });
      });
      setAllUser(items);
    };
    
    useEffect(() => {
      const fetchData = async () => {
        const q = query(collectionRef, orderBy("date"), limit(10));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const items = [];
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
          querySnapshot.forEach((doc) => {
            items.push({ key: doc.id, ...doc.data() });
          });
          setUser(items);
        });
      };
    
      fetchData();
      getUserName();
    }, []); // Empty dependency array to ensure the effect runs only once
    
    useEffect(() => {
      setFinal(joinArrays(user, allUser, "user", "AuthID"));
    }, [user, allUser]); // Only run when user or allUser changes
    
    // Rest of your component code...

    
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
  
              const q = query(collectionRef, orderBy("NAME"), limit(10), startAfter(item.NAME)); 
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
  
      const q = query(collectionRef, orderBy("NAME"), limitToLast(10), endBefore(item.NAME)); 
          
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
  const {userID} = useParams();
  const back = () =>{

    navigate(`/admin/${userID}`); // here we will redirect user and send your data into state
 };
    return( 
        <div className="min-h-screen flex flex-row bg-gray-100">
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
      <Navigation />
      <div className="flex-1 px-2 sm:px-0 mx-4 my-4">
        <div className="md:flex no-wrap md:-mx-2 h-full">
       
          <div className="w-full md:w-12/12 md:mx-2 h-full">

            {/* buttons for printing */}
            <div className="bg-white p-3 shadow-sm rounded-sm mb-3">
            <div className="grid md:grid-cols-2 text-sm gap-2 ">
                  <div className="grid grid-cols-2 gap-2">
                  <button onClick={back} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  </button>
                  <input class="py-2 px-2 bg-gray-100  font-semibold  rounded hover:bg-white  mx-3 " type="text" name="" id=""
                                    placeholder="Search" onChange={(event) => {setSearch(event.target.value);}}/>    
                    
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                  <button
                      className="py-2 px-4 bg-transparent text-indigo-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                      onClick={search}>
                                Search
                            </button>     
                  </div>
            </div>          
            </div>

           
            <div className="bg-white p-3 shadow-sm rounded-sm h-full">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span clas="text-green-500">
                  <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span className="tracking-wide">User Logs for Driver Module</span>
              </div>
              <div className="text-gray-700 mt-3">
              
    <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                 Name
                                            </th>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Action
                                            </th>
                                          
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Member ID
                                            </th>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {final && Object.entries(final).map(([key, value]) => {
  return (
    <tr key={key}>
      <td className="px-5 py-1 border-b border-black-100 bg-white text-sm">
        <div className="flex items-center">
          {/* Name */}
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">{value.NAME}</p>
          </div>
        </div>
      </td>
      {/* Address */}
      <td className="px-5 py-1 border-b border-white-600 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{value.action}</p>
      </td>
      {/* Contact No */}
      <td className="px-5 py-1 border-b border-white-600 bg-white text-sm">{value?.driver}</td>
      <td className="px-5 py-1 border-b border-white-600 bg-white text-sm">{value.date.replaceAll('m',"/")}</td>
    </tr>
  );
})}

                                    </tbody>
                                </table>
                           
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
            <div className="my-4"></div>
           
          </div>
        </div>
      </div>


 

    </div>

     
    );
}
