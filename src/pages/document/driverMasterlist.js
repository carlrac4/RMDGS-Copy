import React, { useState } from "react";
import "./style/record.css";
import {onSnapshot, collection, query, orderBy} from "firebase/firestore";
import { db } from "../../firebase-config";




export class DriverMasterList extends React.Component{
	constructor(props) {
		super(props);
	
		this.state = { checked: false };
		
	  }	

	
	  
  render() {
	const strObjFromStorage = localStorage.getItem('DrvMasterList')
	const wow = JSON.parse(strObjFromStorage)
	const details = {...wow};

	const  {text}  = this.props;
	

	const current = new Date();
	const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    return (
		
		<div className="main">
		<div class="w-full h-full	 gap-4 flex flex-row">
		   <table class="w-full">
			<thead className="record-header mb-5">
			<tr >
				<td>
			<div class="border-b-2 border-black text-center p-4">
						  <p class="text-6xl officers-header">SKLTODA INC</p>
						  <p class="text-xs">Sitio Kubuhan Langgam & Rustan St. Joseph 9&10 Toda Inc.</p>
						  <p class="text-xs font-bold">SEC Reg. No.: CN200809756</p>
					   </div>
					   </td>
			</tr>
			
			</thead>				  
			<tbody>
				<tr class="w-full border-black ">		
				 <td class="flex flex-col w-full border-black">
					<div class=" top-0 gap-4  flex-col flex border-black">
					
					   
					   <div class="h-full border-black flex align-center justify-center content-center">
						  <div class="flex flex-col gap-2 w-2/3 h-full py-4 px-3 a">
							<table class="w-full mb-2" >
								<tr >
									<td><p class="text-center text-sm">Date: {date}  </p></td>
								
								</tr>
							</table>
							<div class="p-2 h-12 text-center date border border-red text-base w-full my-2 place-content-center"> <p> Driver's Masterlist </p>
							</div>
								<div className="tabStyle border border-red">
								<table class=" w-full text-sm text-left text-gray-500 dark:text-gray-400">
								<thead>
                           <tr>
                              <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> NO. </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> NAME </th>
                            
                           </tr>
                        </thead>
								   <tbody>
								   {Object.values(details).map((data,index) => {
                       return(
                           <tr class="w-full">
                              <td className="w-fit px-3 py-1 border-b border-black-100 bg-white text-sm">
                                 <div className="flex items-center"> {/* Name */} <div className="ml-3">
                                       <p className="text-gray-900 whitespace-no-wrap">
										{index + 1}
									   </p>
                                    </div>
                                 </div>
                              </td>
							   <td className=" w-2/3 px-5 py-1 border-b border-white-600 bg-white text-sm">
                                 <p className="text-gray-900 whitespace-no-wrap">{data.NAME} </p>
                              </td> 

						
                           </tr> 
									  );
									  })}
    
                        </tbody>			   
								</table>
								
								</div>			 </div>
						 </div>
						 </div>
					  </td>
					  </tr>
					  </tbody>
		   </table>
		</div>
	 </div>
	
  );
}
}

export const FunctionalDriverMasterList = React.forwardRef((props, ref) => {
	// eslint-disable-line max-len
	
	return <DriverMasterList ref={ref} text={props.text}/>;
  });