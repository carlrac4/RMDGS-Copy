import React, {useState} from "react";
import { db } from "../../firebase-config";
import Select from 'react-select'
import { runTransaction, doc, deleteDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import {ReactComponent as WarningIcon} from "./assets/warning.svg"
import {ReactComponent as CheckIcon} from "./assets/check.svg"


import "react-datepicker/dist/react-datepicker.css";

function highlightError(element, bool){
	const d = document.getElementById(element);
	if(bool){
		d.className += ' border-2 border-rose-600';
	console.log(d)

}else{
	// d.className -= ' border-2 border-rose-600';
	// d.className += 'relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm';
}


}
function SplitName(name){
	if(name){var dotPosition = name.indexOf(",");
	var miPosition = name.includes(".");
	if(miPosition) {miPosition = name.indexOf(".") }else{  miPosition = name.length + 2;}
	var lastname = name.substring(0, dotPosition);
	var firstname = name.substring(dotPosition + 2, miPosition -2 );
	  var middleinitial = name.substring(miPosition - 1, miPosition);
	  var suffix = name.substring(miPosition + 2);
  }
	return {firstname: firstname, lastname:lastname, middleinitial:middleinitial, suffix: suffix}
  }
  

function handleSubmit (event){
	// 👇️ prevent page refresh
	event.preventDefault();
	};

	
	const flattenObject = (obj, prefix = '') => {
		return Object.keys(obj).reduce((acc, key) => {
		  const fullPath = prefix ? `${key}` : key;
		  if (typeof obj[key] === 'object' && obj[key] !== null) {
			Object.assign(acc, flattenObject(obj[key], fullPath));
		  } else {
			acc[fullPath] = obj[key];
		  }
		  return acc;
		}, {});
	  };

export function UpdateModal(detail) {
	const moment = require('moment');
	const [showModal, setShowModal] = React.useState(false);
	const [showConfirm, setShowConfirm] = React.useState(false);
	const [showInitial, setInitial] = React.useState(true);
	const [showLoading, setLoading] = React.useState(false);
	const [showSucess, setSuccess] = React.useState(false);
	
	const [startDate, setStartDate] = useState(moment().subtract(18, "years")._d);
	const [year, setYear] = useState(new Date());
	const [fname, setFirstname] = useState("");
	const [lname, setLastname] = useState("");
	const [mname, setMiddlename] = useState("");
	const [suffix, setSuffix] = useState("");
	const [address, setAddress] = useState("");
	const [contact, setContact] = useState("");
	const [gender, setGender] = useState("");

	const [license, setLicense] = useState("");
	
	const [fullname, setFullname] = useState("");
	const [error, setError] = useState("");
	const [showWarning, setWarning] = React.useState(false);

	  const details = flattenObject(detail);
	  const {id} = useParams();

	const suffixes = [
	{ value: "Sr.", label: "Sr." },
	{ value: "Jr.", label: "Jr." },
	{ value: "I", label: "I" },
	{ value: "II", label: "II" },
	{ value: "III", label: "III" }
	];

const genders = [
{value:"MALE", label:"MALE"},
{value:"FEMALE", label:"FEMALE"},
{value:"OTHER", label:"OTHER"}

];
const classes = "relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-200";
const inputError = [
	"Please fill out all the fields!", "Please enter valid informations"
	];
const displayError = () => {
	setError(inputError[1]);
	setWarning(true);
}
const options = {year:'numeric'};

	var FinalName = "",
	FinalContact = "",
	FinalAddress = "",
	FinalYear = "",
	FinalLicense = "",
	FinalBirthdate = "",
	FinalGender = "";
	var first = "",
	last = "",
	middle = "",
	suf = "";
 
 const executeQuery = async() => {
	setInitial(false);
	setLoading(true);
	const {
		NAME,
		CONTACT,
		ADDRESS,
		LICENSE,
		YEAR,
		GENDER,
		BIRTHDATE
	 } = details;
	 
	 last = lname.length === 0 ? SplitName(NAME).lastname : lname;
	 first = fname.length === 0 ? SplitName(NAME).firstname : fname;
	 middle = mname === "" ? SplitName(NAME).middleinitial : mname;
	 suf = suffix === "" ? SplitName(NAME).suffix : suffix;
	 FinalContact = contact.length === 0 ? CONTACT : contact;
	 FinalAddress = address.length === 0 ? ADDRESS : address;
	 FinalLicense = license.length === 0 ? LICENSE : license;
	 FinalYear = year.length === 0 ? YEAR : year;
	 FinalBirthdate = startDate.length === 0 ? BIRTHDATE : startDate;
	 FinalName = last + ", " + first + " "+ middle+ ". " ;
	 const sfDocRef = doc(db, 'users', id);
	 try {
		 await runTransaction(db, async (transaction) => {
			 const sfDoc = await transaction.get(sfDocRef);
			 if (!sfDoc.exists()) {
			 throw "Document does not exist!";
			 }
	 
			 transaction.update(sfDocRef, {
				 NAME: FinalName,
				 ADDRESS: FinalAddress,
				 CONTACT: FinalContact,
				 YEAR: FinalYear,
				 BIRTHDATE: FinalBirthdate,
				 LICENSE: FinalLicense
				 });
				 });	
	 setLoading(false);
	 setSuccess(true);
	
 }catch(e){
 console.log("error occured", e);
 }
 setTimeout(function() {
	
	setSuccess(false);
	
	setShowConfirm(false)
	
  }, 900);
 
		
 }
 const close = () =>{
	setShowConfirm(false);
 }
 
 const update = async () => {
	
	var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?0123456789]/;
	var check = /[!@#$%^&*()_+\-=\[\]{};:"\\|<>\/?]/;

 
 if (fname.match(format) || lname.match(format) || mname.match(format)) {
	displayError();
	highlightError("fname", fname.match(format));
	highlightError("lname", lname.match(format));
	highlightError("mname", mname.match(format));
	return;
 }
 
 if (mname.length === 0) {
	setFullname(last + ", " + first + " " + suf);
 } else {
	setFullname(last + ", " + first + " " + middle + ". " + suf);
 }
 
 if (contact.length > 11) {
	highlightError("contact", true);
	displayError();
	return;
 }
 
 if (address.match(check)) {
	highlightError("address", true);
	displayError();
	return;
 }
 
 if (license.match(check)) {
	highlightError("license", true);
	displayError();
	return;
 }
 setShowModal(false)
 setShowConfirm(true);
 
 };


  
	return (
	<>
		<button className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=> setShowModal(true)}
			>
			Edit driver details
		</button>
		{showModal ? (
		<>
			<div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 sm:mt-10	 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
						{/*header*/}
						<div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t text-center">
                    <h3 className="text-3xl font-semibold">
                  
           
                    </h3>
                    <h3 className="text-3xl font-semibold ">Driver Details</h3>
                    {/* <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button> */}
                  </div>
						{/*body*/}
						<div className="relative p-2 flex-auto">
					
								<div className="	 shadow sm:rounded-md">
									<div className="bg-white max-h-screen overflow-y-scroll 	 px-4 py-5 sm:p-6">
									<form onSubmit={handleSubmit} className="h-fit">
										<div className="grid grid-cols-6 gap-6 	">
										<div class="col-span-6 sm:col-span-6 lg:col-span-6 ">
											{showWarning ? (
											<div className="bg-red-500 w-full">
												<label htmlFor="warning" class="block text-sm font-medium text-white p-3">{error}</label>
												</div>
											):null }
												</div>
											<div className="col-span-6 sm:col-span-6 lg:col-span-2">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Last Name</label>
												<input style={{textTransform: "uppercase"}} value={lname} id="lname" name="last_name" placeholder={SplitName(details?.NAME).lastname} onChange={(event)=> {setLastname(event.target.value.toUpperCase());}} required type="text" className={classes} />
											</div>	
											<div className="col-span-6 sm:col-span-6 lg:col-span-2">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">First Name</label>

												<input style={{textTransform: "uppercase"}} value={fname} id="fname" name="fname" placeholder={SplitName(details?.NAME).firstname} onChange={(event)=> { setFirstname(event.target.value.toUpperCase()); }} required type="text" className={classes} />
											</div>

											<div className="col-span-3 sm:col-span-6 lg:col-span-1">

												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">M.I.</label>

												<input style={{textTransform: "uppercase"}} value={mname} id="mname" name="mname" placeholder={(SplitName(details?.NAME).middleinitial) ?? "M.I"} max="1" onChange={(event)=> {setMiddlename(event.target.value.toUpperCase());}} type="text" className={classes} />
											</div>

											<div className="col-span-3 sm:col-span-6 lg:col-span-1">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Suffix</label>

												<Select id="suffix" options={suffixes} value={suffix} onChange={setSuffix} placeholder={(SplitName(details?.NAME).suffix) ?? "suffix"} name="Suffix" required className="relative block w-full appearance-none rounded-none rounded-t-md   text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm  bg-gray-200" />
											</div>


											<div className="col-span-6 sm:col-span-6">
												<label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
												<input style={{textTransform: "uppercase"}} value={address} id="address" name="address" type="text" onChange={(event)=> {setAddress(event.target.value.toUpperCase());}} placeholder={details.ADDRESS} required className={classes} />
											</div>
											<div className="col-span-3 sm:col-span-3 lg:col-span-2">
												<label htmlfor="postal-code" className="block text-sm font-medium text-gray-700">Contact No.</label>
												<input style={{textTransform: "uppercase"}} value={contact} id="contact" name="contact" type="number" onChange={(event)=> {setContact(event.target.value);}}placeholder={details.CONTACT} required className={classes}/>
											</div>
											<div className="col-span-3 sm:col-span-3 lg:col-span-2">
												<label htmlFor="License" className="block text-sm font-medium text-gray-700">License No.</label>
												<input style={{textTransform: "uppercase"}} value={license} id="license" name="license" type="text" onChange={(event)=> {setLicense(event.target.value.toUpperCase());}}
												placeholder={details.LICENSE}
												max="11"
												required className={classes} />
											</div>
											
											
								


											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Year started</label>

												<DatePicker id="year" selected={year} onChange={(date)=> setYear(date)}
													showYearPicker
													required
													dateFormat="yyyy"
													yearItemNumber={9}

													disabledKeyboardNavigation

													className={classes}
													/>
											</div>

											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Birthdate</label>
												<DatePicker id="birth" className={classes} placeholderText="MM-DD-YYYY" dateFormat="MM-dd-yyyy" disabledKeyboardNavigation showYearDropdown showMonthDropdown scrollableYearDropdown yearDropdownItemNumber={70} dropdownMode="select" selected={startDate} required minDate={moment().subtract(100, "years" )._d} maxDate={moment().subtract(18, "years" )._d} onChange={(date)=> {

													setStartDate(date)
													}} />

											</div>

										</div>
										</form>
									</div>
									<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
										<button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=>{
											setShowModal(false);
											setWarning(false);
										}}>
											Close
										</button>
										<button className="text-white bg-blue-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={update} >
											Confirm
										</button>

										{/*
										<PrintComponent detail={{name: text.details.name, id: text.details.id, position: "driver",  salary: salary}} /> */}

									</div>
								</div>
							
						{/*footer*/}
</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
		</>
		) : null}


{showConfirm ? (
			  <>
			   
				<div
				  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
				>
					<div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
    
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
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
          <p class="font-bold">Update user's record</p>
          <p class="text-sm text-gray-700 mt-1">You will update the user's information. This action cannot be undone.
          </p>
        </div>
      </div>
      <div class="text-center md:text-right mt-4 md:flex md:justify-end">
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md mx-2	:ml-2 md:order-2" onClick={executeQuery}>Update
            Account</button>
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 mx-2
          md:mt-0 md:order-1" onClick={() => {
			setShowConfirm(false);
		  }}>Cancel</button>
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

	export function ConfirmDeleteModal(detail) {


		const [showInitial, setInitial] = React.useState(true);
	const [showLoading, setLoading] = React.useState(false);
	const [showSucess, setSuccess] = React.useState(false);
//   const [text, setText] = React.useState(details);
	const [showModal, setShowModal] = useState();
	const navigate = useNavigate();
  const removeMember = async() => {
	const details = flattenObject(detail);	
      await deleteDoc(doc(db, "Driver", details.key));
      setShowModal(false);
	 
	  navigate("/driver");
	  window.location.reload();
         
   
  }
	return (
	<>
		<button className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=> setShowModal(true)}
			>
			Delete member record
		</button>
		{showModal ? (
		<>
		<div
				  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
				>
					<div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
    
    <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
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
          <p class="font-bold">Delete your account</p>
          <p class="text-sm text-gray-700 mt-1">You will lose all of your data by deleting your account. This action cannot be undone.
          </p>
        </div>
      </div>
      <div class="text-center md:text-right mt-4 md:flex md:justify-end">
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md	:ml-2 md:order-2" onClick={removeMember}>Delete
            Account</button>
        <button class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1">Cancel</button>
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



	