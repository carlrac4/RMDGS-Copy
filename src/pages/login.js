import { useState, useEffect } from 'react';
import '../App.css';
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { useNavigate, useParams} from "react-router-dom";
import { collection, addDoc,doc, getDoc, onSnapshot} from "firebase/firestore";
import { db } from "../firebase-config";
import {Footer} from "../templates/navigation";

function LoginButton() {
  var input = document.getElementById("login");

  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
   
      document.getElementById("myBtn").click();
    }
  });
}

function Loginpage() {
  
  const [loginEmail, setloginEmail] = useState("");
  const [details, setDetails] = useState([]);
  const [loginPassword, setloginPassword] = useState("");
  const navigate = useNavigate();

 

  const FetchID = (user) => {
    sessionStorage.setItem("id", user);
    
    navigate(`/dashboard/${user}` , { state: user});
}
  
  const login =  async () => {
    
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => { 
       
        
        FetchID(userCredential.user.uid);
        console.log(userCredential.user.uid)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorMessage);
      });



  }
  useEffect(() => {
    LoginButton();
    
    
    onAuthStateChanged(auth, (currentUser) => {
      if(currentUser){
    
        FetchID(currentUser.uid);
      }else {
       navigate("/");   
      }
   
    });



    
    
  }, []); 
 
  const forgot = () =>{
    navigate("/forgotPass");
  }

  function handleSubmit(e) {
    e.preventDefault();
    login();
   
  }
  return (
    <div className="App">
    <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <img class="mx-auto w-3/12 h-1/6" src={require("../assets/SKLTODA.png")} alt="Your Company"/>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Login to your account</h2>
        
        </div>
        <form onSubmit={handleSubmit} >
          <input type="hidden" name="remember" value="true"/>
          <div class="-space-y-px rounded-md shadow-sm">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input onChange={(event) => {setloginEmail(event.target.value);}} id="email-address" name="email" type="email" autoComplete="email" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Email address"/>
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input onChange={(event) => {setloginPassword(event.target.value);}} id="password" name="password" type="password" autoComplete="current-password" required class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password"/>
            </div>
          </div>

          <div class="my-3 flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div class="text-sm">
              <a onClick={forgot} class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
            </div>
          </div>

          <div class="my-3">
            <button id="login" type="submit" class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            
                <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
          </form>
       
      </div>
    </div>
    </div>
  );
}

export default Loginpage;
