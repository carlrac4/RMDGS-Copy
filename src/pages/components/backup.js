
import React, {useState, useEffect} from 'react';
import { storage, db } from "../../firebase-config";
import { collection, addDoc,doc, setDoc, onSnapshot, getCountFromServer, getDocs} from "firebase/firestore";



import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

function getDate(){
    const date = new Date();
  
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let months = ["January","February","March","April","May","June","July","Aaugust","September","October","November","December"]
  
  let currentDate = months[month]+"_"+day+"_"+year;
  return currentDate
  }

export function BackData (){
    // const [info, setInfo] = useState();
    // const getMarkers = async() => {
    //     const querySnapshot = await getDocs(collection(db, "collection"));
    //     var items = [];
    //     querySnapshot.forEach((doc) => {
    //       // doc.data() is never undefined for query doc snapshots
    //       items.push({ key: doc.id, ...doc.data() });
    //     });
    //     setInfo(items)
    //       }
 
  async function handleClick() {
 
    const querySnapshot = await getDocs(collection(db, "collection"));
    var items = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      items.push({ key: doc.id, ...doc.data() });
    });
 

      const storageRef = ref(storage, `collection/${getDate()}.json`);
         // Create a reference to the Firebase Storage bucket
         const json  = JSON.stringify(items);
         uploadString(storageRef, json).then((snapshot) => {
           console.log('Uploaded a raw string!');
         });
    }
handleClick();

}



export default function ExportButton(filename){
   
        const pathReference = ref(storage, `collection/${filename}`);
      
        getDownloadURL(pathReference).then(url => {
          fetch(url)
            .then(response => response.json())
            .then(data => {
               
                   data.forEach( async docs => {
                    await setDoc(doc(db, "collectionss", docs.key),docs);
                    
            })
         
            })
            .catch(error => console.log(error));
        });


    
}
