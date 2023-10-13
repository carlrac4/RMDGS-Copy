import React, { useRef } from "react";
import "./style/record.css";


export class MemberCollectionReport extends React.Component{
	constructor(props) {
		super(props);
	
		this.state = { checked: false };
		
	  }	

	
	  
  render() {

	const  {text}  = this.props;
	const items = text.data;
	const details = text.details;

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
									<td><p class="text-center text-sm">Date: {date} </p></td>
									<td><p class="text-center text-sm">Name: {details.key.NAME}</p></td>
									<td><p class="text-center text-sm">Month: {details.month == undefined ? "Overall": details.month}</p></td>
								</tr>
							</table>
							<div class="p-2 h-12 text-center date border border-red text-base w-full my-2 place-content-center"> <p> Member Collection Report </p>
							</div>
								<div className="tabStyle border border-red">
								<table class=" w-full text-sm text-left text-gray-500 dark:text-gray-400">
								<thead>
                           <tr>
                              <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> NO. </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"> Date </th>
                              <th className="text-center px-3 py-3 border-b-2 border-gray-200 bg-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount <br /> </th>
                             
                           </tr>
                        </thead>
								   <tbody>
								   {Object.keys(items.data).map((data,index) => {
                       return(
                           <tr class="w-full">
                              <td className="w-fit px-3 py-1 border-b border-black-100 bg-white text-sm">
                                 <div className="flex items-center"> {/* Name */} <div className="ml-3">
                                       <p className="text-gray-900 whitespace-no-wrap">{index + 1} </p>
                                    </div>
                                 </div>
                              </td>
							   <td className=" w-2/3 px-5 py-1 border-b border-white-600 bg-white text-sm">
                                 <p className="text-gray-900 whitespace-no-wrap">{items.data[index].replaceAll("m","-")} </p>
                              </td> 

							 <td className=" w-1/6 px-5 py-1 border-b border-white-600 bg-white text-sm">
                                 <p className="text-gray-900 whitespace-no-wrap"> {10} </p>
                              </td>
                           </tr> 
                            ); })}
   
                        </tbody>			   
								</table>
								<div className="flex "> {/* Name */} 
								<div className="ml-3 w-full flex justify-end ">
								<p className="m text-sm text-center text-black-900 whitespace-no-wrap">
								Total: 
										</p>
									   <p className="mx-3 w-1/6 text-sm text-center text-black-900 whitespace-no-wrap">
										
										{Object.keys(items.data).length * 10}
										 </p>
                                    </div>
                                 </div>
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

export const FunctionalMemberReport = React.forwardRef((props, ref) => {
	// eslint-disable-line max-len
	
	return <MemberCollectionReport ref={ref} text={props.text}/>;
  });