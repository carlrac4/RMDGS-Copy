import React, {useState, useEffect} from "react";
import { auth } from "../firebase-config";
import {db} from "../firebase-config"
import  {onSnapshot, doc} from "firebase/firestore";
import { onAuthStateChanged, signOut} from "firebase/auth";
import { useNavigate} from "react-router-dom";
import Dashboard from "../pages/dashboard";


 export function Navigation() {
    const [userDetails, setUserDetails] = useState([]);
    let id = sessionStorage.getItem("id");
    const navigate = useNavigate();
   
    const logout = async () => {
        await signOut(auth);
        navigate("/");
        window.location.reload();
       
    }
    useEffect(() => {
      
    try{
        onSnapshot(doc(db, "users", id), (doc) => {
           const data = doc.data();
           setUserDetails(data);
         
       });}catch(e){
           navigate('/');
       }
       
    
      return () => {
       
      }
    }, [])
    
    const dashboard = () => {
        navigate(`/dashboard/${id}`, { state: id});
    }
    const driver = () => {
        navigate(`/driver/id${userDetails.AuthID}/authLv~${userDetails.AuthLvl}`);
    }
    const operator = () => {
        navigate(`/operator/id=${userDetails.AuthID}/authLv~${userDetails.AuthLvl}`);
    }
    const profile = () => {
        navigate(`/admin/${id}`, { state: id});
    }
    const collection = () => {
        navigate(`/collections/id=${userDetails.AuthID}/authLv~${userDetails.AuthLvl}/collector=${userDetails.COLLECTOR}`);
    }
    return(
    
      <div class="min-h-screen bg-gray-100">
            <div class="sidebar min-h-screen w-[3.40rem] overflow-hidden border-r hover:w-56 hover:bg-gray-200 hover:shadow-lg">
                <div class="flex h-screen flex-col justify-between pt-8 pb-6">
                    <div>
                        <div class="w-max p-5.5">  
                        <img src={require("../assets/SKLTODA.png")}  span class="w-30 h-20 font-bold text-black-300 text-50px] ml-16" alt="" /> 
                        
                        </div>
                        <ul class="mt-5 space-y-5 tracking-wide">
                            <li class="min-w-max" onClick={dashboard}>
                                <a href="#" aria-label="Home"
                                    class="relative flex items-center space-x-5 flex items-center rounded py-3 pl-3 pr-4 text-black-300 hover:bg-gray-300 relative flex items-center space-x-4 px-4 py-3 text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                    <path
                                        d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                    <path
                                        d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                                        <path class="fill-current text-black-500 group-hover:text-red-600"
                                            d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                                </svg>

                                    
                                    <span class="-mr-1 font-semibold">Dashboard</span>
                                    
                                </a>
                            </li>
                            <li class="min-w-max" onClick={profile}>
                                <a href="#" class="relative flex items-center space-x-5 flex items-center rounded py-3 pl-3 pr-4 text-black-300 hover:bg-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                    <path
                                        d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                                </svg>

                                 
                                    <span class="-mr-1 font-semibold">Profile</span>
                                </a>
                            </li>
                            <li class="min-w-max" onClick={driver}>
                                <a href="#" class="relative flex items-center space-x-5 flex items-center rounded py-3 pl-3 pr-4 text-black-300 hover:bg-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
  <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
</svg>

                                 
                                    <span class="-mr-1 font-semibold">Driver's Record</span>
                                </a>
                            </li>
                            <li class="min-w-max" onClick={operator}>
                                <a href="#" class="relative flex items-center space-x-5 flex items-center rounded py-3 pl-3 pr-4 text-black-300 hover:bg-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                    <path fill-rule="evenodd"
                                        d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                                        clip-rule="evenodd" />
                                    <path
                                        d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                                </svg>


                                    <span class="-mr-1 font-semibold">Operator's Record</span>
                                </a>
                            </li>
                            <li class="min-w-max" onClick={collection}>
                                <a href="#"
                                    class="relative flex items-center space-x-5 flex items-center rounded py-3 pl-3 pr-4 text-black-300 hover:bg-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                                    <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                                    </svg>

                                    <span class="-mr-1 font-semibold">Collection</span>
                                </a>
                            </li>
                            
                        </ul>
                    </div>
                    <div class="min-w-max">
                    <a href="#"
                        class="relative flex items-center space-x-5 flex items-center rounded py-3 pl-3 pr-4 text-black-300 hover:bg-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path fill-rule="evenodd"
                                    d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
                                    clip-rule="evenodd" />
                            </svg>

                            <span class="-mr-1 font-semibold" onClick={logout}>Logout</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>


);
}

export function Footer(){
    return(

    <footer class="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">404™</a>. All Rights Reserved.
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <a href="#" class="mr-4 hover:underline md:mr-6 ">About</a>
            </li>
           
            <li>
                <a href="#" class="hover:underline">Contact</a>
            </li>
        </ul>
    </footer>

    );
}


export function DashboardHeader (){

    const CheckScreen = () => {
        if (window.matchMedia("(max-width: 767px)").matches)
    {
    // The viewport is less than 768 pixels wide
    return false
    
    }else{
      return true
    }
      }
    return (		<div class="relative left-0 text-center flex flex-row justify-center p-4">
        
    
        {CheckScreen() ? (
			<>
        <div className="flex justify-center ">
			<img src={require("../pages/document/style/SKLTODA.png")} className="w-36 h-36 m-2" />
		</div>
      </>
        ) : null} 

        <div class="flex flex-col mx-5 items-center justify-center h-full">
    <p class="text-6xl officers-header">SKLTODA INC</p>
    <p class="text-xs">Sitio Kubuhan Langgam & Rustan St. Joseph 9&10 Toda Inc.</p>
    <p class="text-xs font-bold">SEC Reg. No.: CN200809756</p>
    </div>

    {CheckScreen() ? (
        <>
    <div className="flex justify-center ">
			<img src={require("../assets/CityOfSanPedro.png")} className="w-36 h-36 m-2" />
		</div>
           </>
        ) : null} 
 </div>
 );
}
