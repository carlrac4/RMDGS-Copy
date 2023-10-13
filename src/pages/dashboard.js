import React from "react";
import { useState, useEffect } from 'react';
import { auth } from "../firebase-config";
import { db } from "../firebase-config";
import { onAuthStateChanged, signOut} from "firebase/auth";
import { useNavigate, useLocation, useParams, Link} from "react-router-dom";
import { collection, addDoc,doc, getDoc, onSnapshot, getCountFromServer, getDocs} from "firebase/firestore";
import { DashboardHeader, Footer, Navigation } from "../templates/navigation";
import { saveAs } from 'file-saver';
import file from './document/application_form.docx';
import fileone from './document/endorsement_letter.docx';
import filetwo from './document/fee_collection.xlsx';
import Backup from "./components/backup";
import ExportButton from "./components/backup";

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
  
function Dashboard() {
    const navigate = useNavigate();
    const {state} = useLocation();
    const [user, setUser] = useState([]);
    const [daily, setDaily]= useState("");
    const [userDetails, setUserDetails] = useState([]);
    const{id} = useParams();  
    const [operatorCount, setOperatorCount] = useState();
    const [driverCount, setDriverCount] = useState();
    const currentDate = getDate().replaceAll("/","m");
    let checklang;
    const dateToday = getDate().replaceAll("/","m");
    daily == undefined ? checklang = {[dateToday]: ""} : checklang = daily;
   const { paidList, passList } = segregateObjectByValue(checklang, currentDate);
    
    
    const download = (a,link, name) =>{
      
        saveAs(a, link); fetch(a).then((response) => {
            response.blob().then((blob) => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement("a");
              a.href = url;
              a.download = name;
              a.click();
            });
          });
    }
   
 
   
  useEffect(() => {
    const getDailyRecord = async () => {
        const unsub = onSnapshot(doc(db, "Records", `collectionRecord`), (doc) => {
         
          setDaily(doc.data()[currentDate]);
            
        });
        
      };    
  
     getDailyRecord();
    try{
     onSnapshot(doc(db, "users", state), (doc) => {
        const data = doc.data();
        setUserDetails(data);
      
    });
    onSnapshot(doc(db, "Records", "driver"), (doc) => {
        const data = doc.data();
        setDriverCount(data.totalID);
      
    });
    onSnapshot(doc(db, "Records", "operator"), (doc) => {
        const data = doc.data();
        setOperatorCount(data.total);
      
    });
}catch(e){
        navigate('/');
    }
    
   
    onAuthStateChanged(auth, (currentUser) => {
        if(currentUser){
     
        }else {
         navigate("/");   
        }
     
      });
      
   
      return () => {
       
      }
        
        
  }, [setUserDetails]); 
  const AuthLvl = userDetails.AuthLvl;
  const Collect = userDetails.COLLECTOR;

 
   
    const driver = async() => {
        navigate(`/driver/id${id}/authLv~${AuthLvl}`);
    }
    const operator = async() => {
        navigate(`/operator/id=${id}/authLv~${AuthLvl}`);
    }
    const collection = ()=>{
        navigate(`/collections/id=${id}/authLv~${AuthLvl}/collector=${Collect}`);
    }
    const logout = async () => {
        await signOut(auth);
        navigate("/");
    }
    const printAnnounce = async() => {
        navigate("/announcement");
    }
const classes =  " transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-105  duration-300 relative group bg-white lg:h-3/5 sm:h-auto py-10  px-4 flex flex-col space-y-2 items-center lg:h-full   rounded-md  text-xl flex flex-col justify-center "
    return( 
    <div>
        <link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" />

        <div class="min-h-screen flex flex-row bg-gray-100">
        <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
      <Navigation />
        <div class="flex-1 px-2 sm:px-0 mx-4 ">
            <div class="flex justify-between items-center">
                <h3 class="text-3xl font-extralight text-white/50">Groups</h3>
                <div class="inline-flex items-center space-x-2">
                </div>
            </div>
            <div class="mb-5 sm:mb-0 mt-5 grid gap-4 grid-cols-1  ">
            <DashboardHeader />
        
            </div>
            <div  class="mb-10 sm:mb-0 mt-5  grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            <div  class={classes}>
            <span class="text-black text-2l italic capitalize text-center">Total Operator:</span>  

                <span class="text-white text-2l bg-blue-700 py-1 px-3 rounded capitalize text-center">{operatorCount}</span>  

             
                </div>

                <div  class={classes}>
            <span class="text-black text-2l italic capitalize text-center">Total Driver:</span>  

                <span class="text-white text-2l bg-green-700 py-1 px-3 rounded capitalize text-center">{driverCount?.toString()}</span>  

             
                </div>
                <div  class={classes}>
            <span class="text-black text-2l italic capitalize text-center">Total Paid:</span>  

                <span class="text-white text-2l bg-red-700 py-1 px-3 rounded capitalize text-center">{Object.values(paidList).length ?? "0 "}</span>  

             
                </div>
               
            <div onClick={driver}
           class={classes}>
                
            <div className="h-auto flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            

            <span class=" text-md capitalize text-center" > Driver's Record</span>
            </div>
            </div>

            <div onClick={operator}
            class={classes}>

            <div className="h-auto flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
</svg>
            

            <span class=" text-2l capitalize text-center" > Operator's record</span>
            </div>
            </div> 
            <div onClick={printAnnounce}
            class={classes}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            

            <span class=" text-2l capitalize text-center" > Create Announcements</span>
            
            </div>


          

                <div onClick={collection} class={classes}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
</svg>


                <span class="text-black text-2l capitalize text-center">Collection</span>  
                </div>

                <div class="relative group  h-3/5 py-2 lg:h-3/5 sm:h-auto  px-4 flex flex-col items-center space-y-2 items-center cursor-pointer rounded-md  hover:smooth-hover">
                <button onClick={() => {download(filetwo,"./pages/documents/fee_collection.xlsx","fee collection")}} class="w-full bg-yellow-300 hover:bg-yellow-400 text-yellow-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                    <span class="text-black">Fee Collection</span>
                </button>
                <button onClick={() => {download(fileone,"./pages/documents/endorsement_letter.docx","endoresment form")}} class="w-full bg-yellow-300 hover:bg-yellow-400 text-yellow-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                    <span class="text-black">Endorsement Letter</span>
                </button>
                <button onClick={() => {download(file,"./pages/documents/application_form.docx","application form")}} class="w-full bg-yellow-300 hover:bg-yellow-400 text-yellow-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                    <span class="text-black">Application Form</span>
                </button>
                
                </div>  
              



            </div>
            </div>
        </div>
        <Footer />
    </div>
    );
}

export default Dashboard;