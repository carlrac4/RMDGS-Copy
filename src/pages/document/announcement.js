import React, { useRef } from "react";
import "./style/announcement.css";


export class ComponentToPrint extends React.Component{
	constructor(props) {
		super(props);
	
		this.state = { checked: false };
	  }	

	  
  render() {
	
	  
	const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
	const  {text}  = this.props;
	console.log(text)
	  const formatDate = (date) => {
        if (!date) {
          return "";
        }
        return new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };
      
      const formatTime = (time) => {
        if (!time) {
          return "";
        }
        return new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
	}
	
    return (
    <div className="m-5">
   
  <div class="w-full h-full  p-2 gap-4 flex flex-row">

<div class=" h-fit w-1/2 p-0 border-2 border-black basis-1/4">
  <div class="flex justify-center ">
  <img src={require("./style/SKLTODA.png")} className="w-36 h-36 m-2" />
  </div>
  <div class="flex justify-center ">
	  <h3 class="text-center officers-header">
		SKLTODA INC. <br/>
		2021-2023
	  </h3>
  </div>
  <div class=" flex flex-col col-span-1 gap-3 justify-center text-center my-8">
	<div>
	  <div class="officer-Name">EDGAR CAMU</div>
	  <div class="officer-title">President</div>
	</div>
	<div>
	  <div class="officer-Name">JOSE DELMIGUEZ</div>
	  <div class="officer-title">Vice-President</div>
	</div>
	<div>
	  <div class="officer-Name">MARK ALLAN GAYLON</div>
	  <div class="officer-title">Secretary</div>
	</div>
	<div>
	  <div class="officer-Name">VICTOR NALE</div>
	  <div class="officer-title">Treasurer</div>
	</div>
	<div>
	  <div class="officer-Name">EVA REA</div>
	  <div class="officer-title">Auditor</div>
	</div>
	<div>
	  <div class="officer-Name">ALLAN NASAYAO</div>
	  <div class="officer-title">P.R.O</div>
	</div>
	<div class="mt-5">
	  <div class="officer-title">Sgt. At Arms</div>
	  <div class="officer-Name">
		Abr/AHAM CRUZ JR.<br/>
		Abr/AHAM CRUZ JR.<br/>
		RODOLFO CEZAR<br/>
		GILBERT CASIPIT<br/>
		SERVILLANO RANOSA<br/>
		GERRY GUTIERREZ
	  </div>
	</div>
	<div class="mt-5">
	  <div class="officer-title">Board of Directors</div>
	  <div class="officer-Name">
		JOSEdivTO PANIS<br/>
		ALEJO BARCENAL<br/>
		GINO GREGORIO<br/>
		JOSE SANTILLAN<br/>
		JOVITO PEREZ<br/>
		RUBY VILLARUEL<br/>
		BENJAMIN PASCO
	  </div>
	</div>
	
  </div>
  <div>
	
  </div>
  
</div>
<div class=" p-4 flex flex-col basis-3/4 text-center gap-4">

	<div class="border-b-2 border-black p-4">
	  <p class="text-6xl officers-header">SKLTODA INC</p>
	  <p class="text-xs">Sitio Kubuhan Langgam & Rustan St. Joseph 9&10 Toda Inc.</p>
	  <p class="text-xs font-bold">SEC Reg. No.: CN200809756</p>
	</div>
  
	<div class="h-full border-black">
	  <div class="flex flex-col gap-4 h-full py-4 px-3">
		<div class="h-fit text-base text-right paradate"><p class="textright">{date}</p> </div>
		<div class="h-fit font-bold paraones"><p class="text-center">ANNOUNCEMENT</p> </div>
		<div class="paraones h-fit w-full flex flex-row flex-wrap"> 
		  <p class="w-full font-bold h-auto mx-0 text-start text-9xl">WHAT: {text.what} < br/> </p> 
		  <p class="w-full font-bold h-auto mx-0 text-start text-9xl"> WHEN: {formatDate(text.when)} </p> <br/> 
		  <p class="w-full font-bold h-auto mx-0 text-start text-9xl">TIME: {formatTime(text.time)}</p>  <br/>
		  <p class="w-full font-bold h-auto mx-0 text-start text-9xl">  WHERE:{text.where} </p> 
		  {/* <br /> <p class="w-40 font-bold mx-0 text-start"></p> <p class=" text-center w-76 h-fit"></p><br/>
		  <p class="w-40 font-bold mx-0 text-start">TIME:</p> <p class=" text-center w-76 h-fit">{formatTime(text.time)}</p><br />
		  <p class="w-40 font-bold mx-0 text-start">WHERE:</p> <p class=" text-center w-76 h-fit">{text.where}</p> */}
		</div>
		<div class="h-fit w-full font-bold flex flex-row flex-wrap paraones">
		  <p class="w-full font-bold mx-0 h-fit text-start">AGENDA:</p>
		  <pre class="w-full font-bold mx-0 h-auto text-start tnr">{text.agenda}</pre> 
		 
		</div>
		
		<div class="w-full flex flex-row contend-between">
		  <div class="h-fit w-full mt-10 flex flex-col sign	">
			<p class="border-b-2 text-center mb-0 p-0 w-40 h-fit">EDGAR CAMU</p> <p class="w-40 mx-0 h-fit text-center font-bold">President</p> 
		  </div>
		
		</div>
		
	  </div>
	</div> 
</div>
</div>
</div>
  );
}
}

export const FunctionalAnnouncement = React.forwardRef((props, ref) => {
	// eslint-disable-line max-len
	
	return <ComponentToPrint ref={ref} text={props.text}/>;
  });