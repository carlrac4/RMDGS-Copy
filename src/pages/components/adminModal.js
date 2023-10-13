import React, {useState, useEffect} from "react";
import { db } from "../../firebase-config";

import Select from 'react-select'
import { collection, onSnapshot, runTransaction, doc,} from "firebase/firestore";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
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



function highlightError(element){

const selected = document.getElementById(element);
selected.className += " border-2 border-rose-600";


}



export default function AdminModal(details) {
const moment = require('moment');

	
// variables
	const {id} = useParams();
	const [user, setUser] = useState();
	const [showModal, setShowModal] = React.useState(false);
	const [startDate, setStartDate] = useState(moment().subtract(18, "years")._d);
	const [year, setYear] = useState(new Date());
	const [fullname, setFullname] = useState("");
	const [fname, setFirstname] = useState("");
	const [lname, setLastname] = useState("");
	const [mname, setMiddlename] = useState("");
	const [suffix, setSuffix] = useState("");
	const [address, setAddress] = useState("");
	const [contact, setContact] = useState("");
	const [license, setLicense] = useState("");
	const [precint, setPrecint] = useState("");
	const [error, setError] = useState("");
	const [confirmTable, setConfirmTable] = useState([]);
	const [showConfirmModal, setConfirmModal] = React.useState(false);
	const [showWarning, setWarning] = React.useState(false);

//end of variables

useEffect(() => {
	onSnapshot(doc(db, "users", id), (doc) => {
	   const data = doc.data();
	   setUser(data);
   }); 
 }, [setUser]); 

 const classes = "elative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

const suffixes = [
{ value: "Sr.", label: "Sr." },
{ value: "Jr.", label: "Jr." },
{ value: "I", label: "I" },
{ value: "II", label: "II" },
{ value: "III", label: "III" }
];
const inputError = [
"Please fill out all the fields!", "Please enter valid informations" 
];

const requiredFields = ["fname", "lname", "contact",
"gender","license", "precint",
"address", "year", "birth"
];
const options = {year:'numeric'};
var FinalName, FinalContact, FinalAddress, FinalYear, FinalLicense, FinalPrecint, FinalBirthdate;
	let first, last, middle, suf;
	
const fieldHeader = [

{label: "Full Name", value: fullname},
{label: "Contact No." , value: contact},
{label: "License No.", value: license},
{label: "Precint No." , value: precint},
{label:"Address" , value: address},
{label:"Year Started" , value: (year.toLocaleDateString('en-US', options))},
{label:"Birthday" , value: (startDate.toLocaleDateString('en-US'))}
];

	
	const confirmModal = () => {

		
		var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?0123456789]/;
		var Check = /[!@#$%^&*()_+\-=\[\]{};:"\\|<>\/?]/;
		
		
			if (fname.match(format) || lname.match(format) || mname.match(format)) {
				setError(inputError[1]);
				setWarning(true);
			} else {
				if (contact.length > 11) {
					highlightError(requiredFields[2])
					setWarning(true);
					setError(inputError[1]);
				} else {
					if (address.match(Check)) {
						highlightError(requiredFields[6])
						setWarning(true);
						setError(inputError[1]);
					} else {
						if (license.match(Check)) {
							highlightError(requiredFields[4]);
						} else {
							if (precint.match(Check)) {
								highlightError(requiredFields[5]);
							} else {
								setConfirmModal(true);
								setShowModal(false);
							}
						}
					}
				}
			}
		
		

	
		
		}

		
		
		const closeForm = () => {
			
			setFirstname("");
			setLastname("");
			setSuffix("");
			setMiddlename("");

		setShowModal(false);
		setWarning(false);
		}
	
		const updateUser = async() => {
		
			

			if(lname.length == 0){
				last = SplitName(user?.NAME).lastname;
			}else{
				last = lname
			} 
			if(fname.length == 0){
			
				first = SplitName(user?.NAME).firstname;
			}else {
				first = fname;
			}
			if (mname ==""){
				
				middle =SplitName(user?.NAME).middleinitial;
			}else{
				middle = mname;
			}
			if(suffix == ""){
				suf = SplitName(user?.NAME).suffix;
			}else{
				suf = suffix;
			}if (contact.length === 0) {
				FinalContact = user.CONTACT;
			} else { FinalContact = contact;
				
			}
			if (address.length === 0) {
				FinalAddress = user.ADDRESS;
			} else {
				FinalAddress = address;
			}
			if (license.length === 0) {FinalLicense = user.LICENSE;
			
			} else {
				FinalLicense = license;
			}
			if (precint.length === 0) {
				FinalPrecint = user.PRECINT;
			} else {
				FinalPrecint = precint;
			}
			if (year.length === 0) {
				FinalYear = user.YEAR;
			} else {
				FinalYear = (year.toLocaleDateString('en-US', options));
			}
			if (startDate.length === 0) {
				FinalBirthdate = user.BIRTHDATE;
			} else {
				FinalBirthdate = (startDate.toLocaleDateString('en-US'));
			}
			
			
			FinalName =last + ", " + first + " " + middle + ". " + suf;
		
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
						PRECINT: FinalPrecint,
						BIRTHDATE: FinalBirthdate,
						LICENSE: FinalLicense
						});
						});	
			
		}catch(e){
		console.log("error occured", e);
		}

		}

		const handleSubmit = event => {
		// 👇️ prevent page refresh
		event.preventDefault();
		};

	
		
		return (
		<>
			<button className="py-2 px-4 bg-transparent text-indigo-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0" type="button" onClick={()=> setShowModal(true)}
				>
				Edit Details
			</button>
			{showModal ? (
			<>
				<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none md:mt-10 focus:outline-none">
					<div className="relative w-auto my-6 md:ny-20 mx-auto max-w-3xl p-3">
						{/*content*/}

						<div className="border-0 rounded-lg mt-5 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
							{/*header*/}
							<div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">

							</div>
							{/*body*/}
							<form onSubmit={handleSubmit}>
								<div className="overflow-hidden shadow sm:rounded-md">
									<div className="bg-white px-4 py-5 sm:p-6">
										<div className="grid grid-cols-6 gap-6">

											<div className="col-span-6 sm:col-span-6 lg:col-span-6">
												<label htmlFor="title" className="block text-sm font-medium text-center text-gray-700">Add new driver Record</label>
											</div>
											{showWarning ? (
											<div class="col-span-6 sm:col-span-6 lg:col-span-6 bg-red-500">
												<label htmlFor="warning" class="block text-sm font-medium text-white p-3">{error}</label>
											</div>
											):null }
											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Last Name</label>
												<input style={{textTransform: "uppercase"}} 
											 id="last_name" name="last_name" placeholder={SplitName(user?.NAME).lastname}onChange={(event)=> {setLastname(event.target.value.toUpperCase());}} required type="text" className={classes} />
											</div>
											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">First Name</label>

												<input style={{textTransform: "uppercase"}} 
												 id="first_name" name="first_name" 
												placeholder={SplitName(user?.NAME).firstname} onChange={(event)=> { setFirstname(event.target.value.toUpperCase()); }} required type="text" className={classes} />
											</div>

											<div className="col-span-1 sm:col-span-1 lg:col-span-1">

												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">M.I.</label>

												<input style={{textTransform: "uppercase"}} id="middle_name" name="middle_name" placeholder={SplitName(user?.NAME).middleinitial} max="1" onChange={(event)=> {setMiddlename(event.target.value.toUpperCase());}} type="text" className={classes} />
											</div>

											<div className="col-span-1 sm:col-span-1 lg:col-span-1">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Suffix</label>

												<Select id="suffix" options={suffixes} value={suffix} onChange={setSuffix} placeholder={SplitName(user?.NAME).suffix}name="Suffix" required class={classes} />
											</div>


											<div className="col-span-6 sm:col-span-6">
												<label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
												<input style={{textTransform: "uppercase"}} 
												value={address} id="address" name="address" 
												placeholder={user?.ADDRESS}
												type="text" onChange={(event)=> {setAddress(event.target.value.toUpperCase());}}
											 required className={classes} />
											</div>
											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlfor="postal-code" className="block text-sm font-medium text-gray-700">Contact No.</label>
												<input style={{textTransform: "uppercase"}} value={contact} id="contact" name="contact" type="number" onChange={(event)=> {setContact(event.target.value);}}placeholder={user?.CONTACT} required className={classes}/>
											</div>
											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlFor="License" className="block text-sm font-medium text-gray-700">License No.</label>
												<input style={{textTransform: "uppercase"}} value={license} id="license" name="license" type="text" onChange={(event)=> {setLicense(event.target.value.toUpperCase());}}
												placeholder={user?.LICENSE}
												max="11"
												required className={classes} />
											</div>
											<div className="col-span-1 sm:col-span-1 lg:col-span-1">
												<label htmlFor="precint-code" className="block text-sm font-medium text-gray-700">Precint No.</label>
												<input style={{textTransform: "uppercase"}} value={precint} id="precint" name="precint" type="text" max="5" onChange={(event)=> {setPrecint(event.target.value.toUpperCase());}}placeholder={user?.PRECINT} required className={classes}/>
											</div>
											


											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Year started</label>

												<DatePicker id="year" selected={year} onChange={(date)=> setYear(date)}
													showYearPicker
													required
													dateFormat="yyyy"
													yearItemNumber={9}
													placeholder={user?.YEAR}
													disabledKeyboardNavigation

													className={classes}
													/>
											</div>

											<div className="col-span-2 sm:col-span-2 lg:col-span-2">
												<label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Birthdate</label>
												<DatePicker id="birth" className={classes} placeholderText={user?.BIRTHDATE} dateFormat="MM-dd-yyyy" disabledKeyboardNavigation showYearDropdown showMonthDropdown scrollableYearDropdown yearDropdownItemNumber={70} dropdownMode="select" selected={startDate} required minDate={moment().subtract(100, "years" )._d} maxDate={moment().subtract(18, "years" )._d} onChange={(date)=> {

													setStartDate(date)
													}} />

											</div>

										</div>
									</div>
									<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
										<button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={closeForm}>
											Close
										</button>
										<button className="text-white bg-blue-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={confirmModal}>
											Confirm
										</button>

										{/*
										<PrintComponent detail={{name: text.details.name, id: text.details.id, position: "driver",  salary: salary}} /> */}

									</div>
								</div>
							</form>
							{/*footer*/}

						</div>
					</div>
				</div>
				<div className="mx-0 opacity-25 fixed inset-0 z-40 bg-black"></div>
			</>
			) : null}

			{showConfirmModal ? (
			<>
				<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none md:mt-10 focus:outline-none">
					<div className="relative w-auto my-6 md:ny-20 mx-auto max-w-3xl p-3">
						{/*content*/}

						<div className="border-0 rounded-lg mt-5 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
							{/*header*/}
							<div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">

							</div>
							{/*body*/}
							<form onSubmit={handleSubmit}>
								<div class="overflow-hidden shadow sm:rounded-md">
									<div class="bg-white px-4 py-5 sm:p-6 flex items-center justify-center ">
										<div class="grid grid-cols-6 gap-6 ">
											<div class="col-span-6 sm:col-span-6 lg:col-span-6 bg-red-500">
												<label htmlFor="warning" class="block text-sm font-medium text-white p-3 text-center">Add new driver</label>
											</div>
											<div class="col-span-6 sm:col-span-6 lg:col-span-6 flex ">
												
											</div>

										</div>
									</div>
									<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
										<button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=> {setConfirmModal(false);
											setShowModal(true); }}
											>
											Close
										</button>
										<button className="text-white bg-blue-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"  onClick={updateUser}>
											Insert
										</button>

									</div>
								</div>
							</form>
							{/*footer*/}

						</div>
					</div>
				</div>
				<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
			</>
			) : null}
		</>

		);


		}





