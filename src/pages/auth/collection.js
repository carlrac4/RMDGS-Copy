
import { auth } from "../../firebase-config";

import { onAuthStateChanged, signOut} from "firebase/auth";

const DoSomething = function() {
  
   onAuthStateChanged(auth, (currentUser) => {
      if(currentUser){
         return true
      }else {
         return false
       
      }

})

   }
   
   export default DoSomething;

