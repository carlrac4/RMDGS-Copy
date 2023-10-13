import React, {useState, useEffect} from "react";
import { db } from "../../firebase-config";
import Select from 'react-select'
import { collection, addDoc,doc, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";


function highlightError(element){

const selected = document.getElementById(element);
selected.className += " border-2 border-rose-600";


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
  

export default function DriverModal(auth) {
	
const moment = require('moment');

const [showModal, setShowModal] = React.useState(false);
const [startDate, setStartDate] = useState(moment().subtract(18, "years")._d);
const [year, setYear] = useState(new Date());
const [fname, setFirstname] = useState("");
const [lname, setLastname] = useState("");
const [mname, setMiddlename] = useState("");
const [suffix, setSuffix] = useState("");
const [address, setAddress] = useState("");
const [contact, setContact] = useState("");
const [gender, setGender] = useState("");
const [identi, setID] = useState([]);
const [license, setLicense] = useState("");
const [precint, setPrecint] = useState("");
const [fullname, setFullname] = useState("");
const [error, setError] = useState("");
const [confirmTable, setConfirmTable] = useState([]);
const [showConfirmModal, setConfirmModal] = React.useState(false);
const [showWarning, setWarning] = React.useState(false);
const getLast = async() => {

const unsub = onSnapshot(doc(db, "Records", "driver"), (doc) => {
setID(doc.data())
});

}

const dateEncode = getDate().replaceAll("/","m");
useEffect(() => {

getLast();

}, []);
const genders = [
{value:"MALE", label:"MALE"},
{value:"FEMALE", label:"FEMALE"},
{value:"OTHER", label:"OTHER"}

];
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



const fieldHeader = [

{label: "Full Name", value: fullname},
{label: "Identification", value: identi.lastID + 1},
{label: "Contact No." , value: contact},
{label: "Gender" , value: gender.value},
{label: "License No.", value: license},
{label: "Precint No." , value: precint},
{label:"Address" , value: address},
{label:"Year Started" , value: (year.toLocaleDateString('en-US', options))},
{label:"Birthday" , value: (startDate.toLocaleDateString('en-US'))}
];

const confirmModal = () => {

if (lname == "" || fname == "" || address== "" ||
contact == "" || gender == "" ||
year == "" || startDate == "" ||
license == "" || precint == "") {
setWarning(true);
setError(inputError[0]);

} else {
var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?0123456789]/;
	var Check = /[!@#$%^&*()_+\-=\[\]{};:"\\|<>\/?]/;

		if (fname.match(format) || lname.match(format) || mname.match(format)) {
		setError(inputError[1]);
		setWarning(true);
		} else {
		setFullname(lname + ", " + fname + " " + mname + ". " + suffix);
		if (contact.length > 11) {
		console.log(contact.length);
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
		if (precint.length > 4 || precint.match(Check)) {
		highlightError(requiredFields[5])
		} else {
		setShowModal(false);
		setConfirmModal(true);
		}
		}
		}
		}
		}





		};
		}
		const closeForm = () => {
		setShowModal(false);
		setWarning(false);
		}
		const addDriver = async() => {
		try {
			const docRef = await addDoc(collection(db, "Driver"), {
				NAME:fullname,
				ADDRESS:address,
				CONTACT:contact,
				GENDER:gender.value,
				YEAR: year,
				BIRTHDATE: startDate,
				PRECINT: precint,
				LICENSE: license,
				NO: identi.lastID + 1
		});

   		 await setDoc(doc(db, "Records","driver"), {
			lastID: identi.lastID + 1,
			totalID: identi.totalID + 1,
   		 }, { merge: false });

		    await addDoc(collection(db, "DriverLogs"), {
				'user':auth.id,
				"date":dateEncode,
				'action':'Add',
				'memberID': identi.lastID + 1
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
				Add New Driver
			</button>
			{showModal ? (
			<>
				<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none md:mt-10 focus:outline-none">
					<div className="relative w-auto my-6 md:ny-20 mx-auto max-w-3xl p-3">
						{/*content*/}

						<div className="border-0 rounded-md mt-5 shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
							{/*header*/}
							<div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">

							</div>
							{/*body*/}
							<form onSubmit={handleSubmit}>
								<div className="overflow-hidden shadow sm:rounded-md">
									<div className="bg-white px-4 py-5 sm:p-6">
										<div className="grid grid-cols-6 gap-6">

											<div className="col-span-6 sm:col-span-6 md:col-span-6">
												<label htmlFor="title" className="block text-sm font-medium text-center text-gray-700 italic">ADD NEW DRIVER RECORD</label>
											</div>
											{showWarning ? (
											<div class="col-span-6 sm:col-span-6 md:col-span-6 bg-red-500">
												<label htmlFor="warning" class="block text-sm font-medium text-white p-3">{error}</label>
											</div>
											):null }
											<div className="col-span-2 sm:col-span-2 md:col-span-2">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Last Name</label>
												<input style={{textTransform: "uppercase"}} value={lname} id="last_name" name="last_name" placeholder="Last Name" onChange={(event)=> {setLastname(event.target.value.toUpperCase());}} required type="text" className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
											</div>
											<div className="col-span-2 sm:col-span-2 md:col-span-2">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">First Name</label>

												<input style={{textTransform: "uppercase"}} value={fname} id="first_name" name="first_name" placeholder="First Name" onChange={(event)=> { setFirstname(event.target.value.toUpperCase()); }} required type="text" className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
											</div>

											<div className="col-span-1 sm:col-span-1 md:col-span-1">

												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">M.I.</label>

												<input style={{textTransform: "uppercase"}} value={mname} id="middle_name" name="middle_name" placeholder="M.I." max="1" onChange={(event)=> {setMiddlename(event.target.value.toUpperCase());}} type="text" className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
											</div>

											<div className="col-span-1 sm:col-span-1 md:col-span-1">
												<label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Suffix</label>

												<Select id="suffix" options={suffixes} value={suffix} onChange={setSuffix} placeholder="Suffix" name="Suffix" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
											</div>


											<div className="col-span-6 sm:col-span-6">
												<label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
												<input style={{textTransform: "uppercase"}} value={address} id="address" name="address" type="text" onChange={(event)=> {setAddress(event.target.value.toUpperCase());}} placeholder="Address" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
											</div>
											<div className="col-span-2 sm:col-span-2 md:col-span-2">
												<label htmlfor="postal-code" className="block text-sm font-medium text-gray-700">Contact No.</label>
												<input style={{textTransform: "uppercase"}} value={contact} id="contact" name="contact" type="number" onChange={(event)=> {setContact(event.target.value);}}placeholder="Contact No." required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
											</div>
											<div className="col-span-2 sm:col-span-2 md:col-span-2">
												<label htmlFor="License" className="block text-sm font-medium text-gray-700">License No.</label>
												<input style={{textTransform: "uppercase"}} value={license} id="license" name="license" type="text" onChange={(event)=> {setLicense(event.target.value.toUpperCase());}}
												placeholder="DXX-XX-XXXXXX"
												max="11"
												required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
											</div>
											<div className="col-span-1 sm:col-span-1 md:col-span-1">
												<label htmlFor="precint-code" className="block text-sm font-medium text-gray-700">Precint No.</label>
												<input style={{textTransform: "uppercase"}} value={precint} id="precint" name="precint" type="text" max="5" onChange={(event)=> {setPrecint(event.target.value.toUpperCase());}}placeholder="1XXB" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
											</div>
											<div className="col-span-1 sm:col-span-1 md:col-span-1">
												<label htmlFor="id" className="block text-sm font-medium text-gray-700">ID No.</label>
												<input id="id" name="id" type="text" max="5" placeholder={identi.lastID + 1} disabled className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
											</div>
											<div className="col-span-2 sm:col-span-2 md:col-span-2">
												<label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Gender</label>
												<Select id="gender" options={genders} onChange={setGender} placeholder="Gender" name="genders" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />

											</div>


											<div className="col-span-2 sm:col-span-2 md:col-span-2">
												<label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Year started</label>

												<DatePicker id="year" selected={year} onChange={(date)=> setYear(date)}
													showYearPicker
													required
													dateFormat="yyyy"
													yearItemNumber={9}

													disabledKeyboardNavigation

													className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
													/>
											</div>

											<div className="col-span-2 sm:col-span-2 md:col-span-2">
												<label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Birthdate</label>
												<DatePicker id="birth" className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholderText="MM-DD-YYYY" dateFormat="MM-dd-yyyy" disabledKeyboardNavigation showYearDropdown showMonthDropdown scrollableYearDropdown yearDropdownItemNumber={70} dropdownMode="select" selected={startDate} required minDate={moment().subtract(100, "years" )._d} maxDate={moment().subtract(18, "years" )._d} onChange={(date)=> {

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

						<div className="border-0 rounded-md mt-5 shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
							{/*header*/}
							<div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">

							</div>
							{/*body*/}
							<form onSubmit={handleSubmit}>
								<div class="overflow-hidden shadow sm:rounded-md">
									<div class="bg-white px-4 py-5 sm:p-6 flex items-center justify-center ">
										<div class="grid grid-cols-6 gap-6 ">
											<div class="col-span-6 sm:col-span-6 md:col-span-6 bg-green-500 rounded-md">
												<label htmlFor="warning" class="block text-sm font-medium text-white p-3 text-center">Confirm Adding of new driver</label>
											</div>
											<div class="col-span-6 sm:col-span-6 md:col-span-6 flex ">
												<table className="min-w-full leading-normal ">
													<thead>
														<tr>
															<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
																Field
															</th>
															<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
																Data
															</th>
														</tr>
													</thead>
													<tbody>
														{fieldHeader.map((fieldHeader) => {
														return(


														<tr>
															<td className="px-5 py-1 border-b border-black-100 bg-white text-sm">
																<div className="flex items-center">

																	{/* Name */}
																	<div className="ml-3">
																		<p className="text-gray-900 whitespace-no-wrap">
																			{fieldHeader.label}
																		</p>
																	</div>

																</div>

															</td>
															<td className="px-5 py-1 border-b border-black-100 bg-white text-sm">
																<div className="flex items-center">

																	{/* Name */}
																	<div className="ml-3">
																		<p className="text-gray-900 whitespace-no-wrap">
																			{fieldHeader.value}
																		</p>
																	</div>

																</div>

															</td>
														</tr>
														)
														})}
													</tbody>
												</table>
											</div>

										</div>
									</div>
									<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
										<button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=> {setConfirmModal(false);
											setShowModal(true); }}
											>
											Close
										</button>
										<button className="text-white bg-blue-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={()=> {
											addDriver();
											setConfirmModal(false);
											
										}}>
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




