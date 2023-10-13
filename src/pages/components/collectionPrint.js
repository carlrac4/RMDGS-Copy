
import React, {useCallback, useRef, useState} from 'react';
import ReactToPrint from 'react-to-print';

import { FunctionalComponentToPrint } from './pages/document/cMembership';
import { Generate } from './pages/document/renderer';

export const PrintComponent = (details, click) => {
    
  const [text, setText] = useState(details);
  
  
  const componentRef = React.useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  
  

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <button className="bg-red-500 text-white active:bg-red-600 font-bold  text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            Print
            </button>
    ); 
  }, []);
 
  return (
    
    <div>
      <ReactToPrint options={options}
        content={reactToPrintContent}
        trigger={reactToPrintTrigger}
      />
      <div style={{ display: "none" }}><FunctionalComponentToPrint ref={componentRef} text={text}/></div>
    </div>
  );}

  export const Pass = (details) => {
    const [text, setText] = useState(details);
    return (
      <div>
        <div ><Generate  text={text}/></div>
      </div>
    );
    }