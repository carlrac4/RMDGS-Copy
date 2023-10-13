import React, { useState, useEffect } from 'react';
import '../App.css';
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { useNavigate, useParams} from "react-router-dom";
import { collection, addDoc,doc, getDoc, onSnapshot} from "firebase/firestore";
import { db } from "../firebase-config";
import {Footer} from "../templates/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import {ReactComponent as WarningIcon} from "./components/assets/warning.svg"
import {ReactComponent as CheckIcon} from "./components/assets/check.svg"

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
  
function LoginButton() {
  // var input = document.getElementById("login");

  // input.addEventListener("keypress", function(event) {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
   
  //     document.getElementById("myBtn").click();
  //   }
  // });
}

function ForgotPage() {
  const [showChangeConfirm, setShowConfirmChange] = React.useState(false);
	const [showInitial, setInitial] = React.useState(true);
	const [showLoading, setLoading] = React.useState(false);
	const [showSucess, setSuccess] = React.useState(false);
  const [stat, setStat] = useState(" Are you sure you want to change password?")
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);

  const handleBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setValidEmail(isValid);
    setButtonDisabled(isValid);
 
  };
  const navigate = useNavigate();

 const login = () => {
  navigate("/")
 }


  function handleSubmit(e) {
    e.preventDefault();
  
  
  }
  const sendChange = (email) => {
    setInitial(false);
    setLoading(true);
    setTimeout(() => {
      
      ResetPassword(email)
      setLoading(false)
      setSuccess(true)
      setStat('suc')
      setTimeout(function() {
    
        setSuccess(false);
    
        setShowConfirmChange(false)
        
        }, 900);
    }, 300);
    
 
}
  return (
    <div className="App">
    <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <img class="mx-auto w-3/12 h-1/6" src={require("../assets/SKLTODA.png")} alt="Your Company"/>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Forgot Password</h2>
        
        </div>
      
        <form onSubmit={handleSubmit} >
        {!validEmail && <span className=" mt-5 mb-0 text-sm text-red-700 italic">Please enter a valid email address.</span>}
          <div class="-space-y-px mt-3 rounded-md shadow-sm">
            <div>
        
         
              <input  id="email-address" name="email" value={email}   onChange={(e) => setEmail(e.target.value)}
        onBlur={handleBlur} type="email" autoComplete="email" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Email address"/>
            </div>
            <div class="my-3 flex items-center justify-end">
         
            <div class="text-sm pt-1">
              <a onClick={login} class=" pt-1 font-medium text-indigo-600 hover:text-indigo-500">Login Now</a>
            </div>
          </div>
          </div>

         

          <div class="my-3">
            <button id="login" type="submit" class="group disabled:bg-gray-700 relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={()=>{setShowConfirmChange(true)}} disabled={!buttonDisabled}>
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            
                <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                </svg>
              </span>
             Send Code
            </button>
          </div>
          </form>
       
      </div>
    </div>

    {showChangeConfirm? (
			  <>
			   
				<div
				  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
				>
					<div class="relative px-4 min-h-screen flex items-center justify-center lg:flex lg:items-center lg:justify-center">
    
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0  z-50 mb-4 mx-4 md:relative">
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
         
         <p class="text-sm text-gray-700 mt-1"> Are you sure you want to change password?
         Check Email after click confirm.  
          </p>
        </div>
      </div>
      <div class="text-center md:text-right mt-4 md:flex md:justify-end">
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md mx-2	:ml-2 md:order-2" onClick={()=>{sendChange(email)
        
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
  );
}

export default ForgotPage;
