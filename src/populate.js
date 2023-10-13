// const admin = require("firebase-admin")
// const serviceFile = require("./serviceAccountKey.json"); //name of file downloaded from firebase
// const data = require("./users.json"); // name of file that contains data to be uploaded
// const collectionKey = "users"; //name of the collection

// admin.initializeApp({
//   credential: admin.credential.cert(serviceFile),
//   databaseURL: "" //find it from your firebase account
// });

// const firestore = admin.firestore();
// const settings = {timestampsInSnapshots: true};

// firestore.settings(settings);

// const id = [
//   "uqQ3PHyea6ZzLXlxhDPBVKvht9F3",
//   "AUM26D5smBXLSaYcl8SMA75Yc5B3",
//   "jdAvH8KXryZJqGPRfTBMUjpedyM2",
//   "VV02ldloumNizNaQBauQLn98xvG2",
//   "QwqW3UaOHHSBzCP2DklxDXzE9Km2",
//   "czSItC9LAkWUWyPVl4RSXrLh77H3",
//   "cpaJZH0g27XrjZjdFPtRndj92Un2",
//   "3ZLtCoggZjYE6Fujajvum1g73h53",
//   "QvACpQBuVmcbAShGBKClhf4wr0u2",
//   "1UXBf40McAXmC6IMurqNtcTUh3s1",
//   "TSxbTOOPrfYa9wlFpL0nJnZTSu13",
//   "ik8kHHOIFYaDsUiA7PjiyOVyVfb2",
//   "btW0qSqg5xYQ9V5jCqJgqMK1MZI2",
//   "ByaYDoHjb6goWLtc6kUDVGAgRwB2",
//   "8EvYUZOE6vP8lyxt57S4XyLeH693",
//   "iJkfOtUP1aXyIiHbkkF8cCndu5c2",
//   "JvBRz2sM0WNgfbkwTpEjzH8KDRm1",
//   "yuHqOwyhUZW4bBhgjffKWhrLra92"
  

// ]

// if (data && (typeof data === "object")) {

//   Object.keys(data).forEach(docKey => {
//     firestore.collection(collectionKey).doc(id[docKey]).set(data[docKey]).then((res) => {
//       console.log("Document " + docKey + " written!");
//     }).catch((error) => {
//       console.error("Error: ", error);
//     });
//   });
// }
//javascript

// Required for side-effects
require("firebase/firestore");
const fs = require('fs');

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rmdgs-94f5e-default-rtdb.asia-southeast1.firebasedatabase.app"
});


const { resolve } = require('path');

// Initialize Firebase
// Get your firebase credentials from 
// the firebase console for your 

/**
 * Tutorial on how to upload json data to firestore
 * Using JavaScript
 * RUN: node json-to-firestore/populateJsonFirestore.js [RELATIVE PATH TO FILE] [FIRESTORE METHOD] [COLLECTION NAME]
 */ 
class PopulateJsonFireStore {
  // class constructor
  constructor() {
    console.time("Time taken");
    this.db = admin.firestore();
    // Obtain the relative path, method type, collection name arguments provided through
    const [, , filepath, type, collectionname] = process.argv;

    // Obtain the absolute path for the given relative
    this.absolutepath = resolve(process.cwd(), filepath);

    // Obtain the firestore method type
    this.type = type;

    // Obtain the firestore method type
    this.collectionname = collectionname;

    // Lets make sure the right firestore method is used.
    if (this.type !== 'set' && this.type !== 'add') {
      console.error(`Wrong method type ${this.type}`)
      console.log('Accepted methods are: set or add');
      this.exit(1);
    }

    // If file path is missing
    if (this.absolutepath == null || this.absolutepath.length < 1){
      console.error(`Make sure you have file path assigned ${this.absolutepath}`)
      this.exit(1);
    }

    // If collection name not set
    if (this.collectionname == null || this.collectionname.length < 1){
      console.error(`Make sure to specify firestore collection ${this.collectionname}`)
      this.exit(1);
    }


    console.log(`ABS: FILE PATH ${this.absolutepath}`);
    console.log(`Type: method is ${this.type}`);
  }



  // The populate function
  // uploads the json data to firestore
  async populate() {
    // initialize our data array
    let data = [];

    // Get data from json file using fs
    try {
      data = JSON.parse(fs.readFileSync(this.absolutepath, {}), 'utf8');
    } catch (e) {
      console.error(e.message);
    }

    //data.forEach((item) => console.log(item));
    // loop through the data
    // Populate Firestore on each run
    // Make sure file has atleast one item.
    if (data.length < 1) {
      console.error('Make sure file contains items.');
    }
    var i = 0;
    for (var item of data) {
      console.log(item);
      try {
        this.type === 'set' ? await this.set(item) : await this.add(item);
      } catch (e) {
        console.log(e.message)
        this.exit(1);
      }
      // Successfully got to end of data;
      // print success message
      if (data.length - 1 === i) {
        console.log(`**************************\n****SUCCESS UPLOAD*****\n**************************`);
        console.timeEnd("Time taken");
        this.exit(0);
      }

      i++;
    }

  }

  // Sets data to firestore database
  // Firestore auto generated IDS
  add(item) {
    console.log(`Adding item with id ${item.id}`);
    return this.db.collection(this.collectionname).add(Object.assign({}, item))
    .then(() => true)
    .catch((e) => console.error(e.message));
  }

  

  // Exit nodejs console
  exit(code) {
    return process.exit(code);
  }

}

// create instance of class
// Run populate function
const populateFireStore = new PopulateJsonFireStore();
populateFireStore.populate();