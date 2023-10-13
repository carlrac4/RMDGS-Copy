import "./style/document.css";
import React  from 'react';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

export class Generate extends React.Component{
  
  constructor(props){
		super(props);
		this.state = { };
	  };
    printDocument() {
      const input = document.getElementById('toPrint');
      html2canvas(input)
        .then((canvas) => {
          let imgWidth = 208;
          let imgHeight = canvas.height * imgWidth / canvas.width;
          const imgData = canvas.toDataURL('img/png');
          const pdf = new jsPDF('p', 'mm', 'letter');
         
          pdf.addImage(imgData, 'PNG', 10, 5, imgWidth, imgHeight - 20);
          // pdf.output('dataurlnewwindow');
          pdf.save("download.pdf");
        });
        console.log("clicked");
    }

render(){
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
	const  {text}  = this.props;
  return (
    
    <div className="m-10 ">
      <div id="toPrint" className=" body p-4 gap-4 flex flex-row">
	<div className=" h-fit w-1/2 p-0 border-2 border-black basis-1/4">
		<div className="flex justify-center ">
			<img src={require("./style/SKLTODA.png")} className="w-36 h-36 m-2" />
		</div>
		<div className="flex justify-center ">
			<h3 className="text-center officers-header"> SKLTODA INC. <br /> 2021-2023 </h3>
		</div>
		<div className=" flex flex-col col-span-1 gap-3 justify-center text-center my-8">
			<div>
				<div className="officer-Name">EDGAR CAMU</div>
				<div className="officer-title">President</div>
			</div>
			<div>
				<div className="officer-Name">JOSE DELMIGUEZ</div>
				<div className="officer-title">Vice-President</div>
			</div>
			<div>
				<div className="officer-Name">MARK ALLAN GAYLON</div>
				<div className="officer-title">Secretary</div>
			</div>
			<div>
				<div className="officer-Name">VICTOR NALE</div>
				<div className="officer-title">Treasurer</div>
			</div>
			<div>
				<div className="officer-Name">EVA REA</div>
				<div className="officer-title">Auditor</div>
			</div>
			<div>
				<div className="officer-Name">ALLAN NASAYAO</div>
				<div className="officer-title">P.R.O</div>
			</div>
			<div className="mt-5">
				<div className="officer-title">Sgt. At Arms</div>
				<div className="officer-Name"> ABRAHAM CRUZ JR. <br /> ABRAHAM CRUZ JR. <br /> RODOLFO CEZAR <br /> GILBERT CASIPIT <br /> SERVILLANO RANOSA <br /> GERRY GUTIERREZ </div>
			</div>
			<div className="mt-5">
				<div className="officer-title">Board of Directors</div>
				<div className="officer-Name"> JOSELITO PANIS <br /> ALEJO BARCENAL <br /> GINO GREGORIO <br /> JOSE SANTILLAN <br /> JOVITO PEREZ <br /> RUBY VILLARUEL <br /> BENJAMIN PASCO </div>
			</div>
		</div>
		<div></div>
	</div>
	<div className=" p-4 flex flex-col basis-3/4 text-center gap-4">
		<div className="p-3">
			<p className="text-6xl officers-header font-bold mb-6">SKLTODA INC</p>
			<p className="text-xs">Sitio Kubuhan Langgam & Rustan St. Joseph 9&10 Toda Inc.</p>
			<div className="text-xs font-bold border-b-2 border-black  pb-4">SEC Reg. No.: CN200809756</div>
		</div>
		<div className="h-full border-black">
			<div className="flex flex-col gap-4 h-full py-4 px-2">
				<div className="h-12 text-start font-bold date">{date}</div>
				<div className="h-12 text-start font-bold date text-base">To Whom It May Concern: </div>
				<div className="paraone h-fit w-full flex flex-row flex-wrap ">
					<p className="w-44 mx-0 h-fit text-start">This letter is to inform you that </p>
					<p className="border-b-2 text-center w-80 h-8 pb-3">{text.detail.name}</p>
					<p className="w-24 mx-0 h-fit text-start">with I.D number </p>
					<p className="w-12 border-b-2 black mb-2 text-center h-8 pb-3"> </p>
					<p className="w-36 h-fit text-center">has been a member of </p>
					<p className="w-52 h-fit text-center border-b-2 border-black mb-3 ">SKLTODA INC. </p>
					<p className="w-8 mx-0 h-fit text-start">since</p>
					<p className="w-12 border-b-2 black text-center h-8 pb-3"> 033 </p>.
				</div>
				<div className="h-fit w-full flex flex-row flex-wrap paraone">
					<p className="w-40 mx-0 h-fit text-start">His/her current position is </p>
					<p className="border-b-2 text-center w-[20rem] h-fit"></p>. <p className="w-48 mx-0 h-fit text-start">His/her current income daily is ₱</p>
					<p className="border-b-2 text-center w-44  mr-2 h-8 pb-3">hey</p>
					<p className="w-24 mx-0 h-fit text-start">Philippine Peso.</p>
				</div>
				<div className="h-fit w-full flex flex-row flex-wrap paraone">
					<p className="border-b-2 text-center mr-2 w-[14rem] h-8 pb-3">hey</p>
					<p className="w-60 mx-0 h-fit text-start">’s probability of continued employment is </p>
					<p className="w-60 mx-0 h-fit text-start">very good. He/she is a valued employee.</p>
				</div>
				
				<div className="h-fit w-full mt-10 flex flex-col flex-wrap paraone">
					<p className="border-b-2 text-center mb-0 p-0 w-40 h-fit">EDGAR CAMU</p>
					<p className="w-40 mx-0 h-fit text-center font-bold">SKLTODA PRESIDENT</p>
				</div>
				<div className="h-fit w-full mt-10 flex flex-col flex-wrap paraone">
					<p className="text-center mb-0 p-0 w-full h-fit italic">* This document is only valid with the signature of an official.</p>
				</div>
			</div>
		</div>
	</div>
      </div>	
      <button class="w-full bg-red-500 text-white active:bg-red-600 font-bold  text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={this.printDocument}>Download</button>
    </div>
  
  );
 } 
}

export const PassDate = React.forwardRef((props, ref) => {
	// eslint-disable-line max-len
	
	return <Generate ref={ref} text={props.text}/>;
  });

