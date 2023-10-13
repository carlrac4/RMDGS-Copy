
import React, {useCallback, useRef, useState} from 'react';
import ReactToPrint from 'react-to-print';

import {FunctionalMemberReport} from './pages/document/memberCollection';
import { FunctionalComponentToPrint } from './pages/document/cMembership';
import { Generate } from './pages/document/renderer';
import {FunctionalDriverMasterList} from './pages/document/driverMasterlist';
import {FunctionalOperatorMasterList} from './pages/document/operatorMasterlist';
import { FunctionalAnnouncement } from './pages/document/announcement';
import { FunctionalMonthlyReport } from './pages/document/monthlyReport';

export const PrintComponent = (details, click) => {
    
  const [text, setText] = useState(details);
  
  
  const componentRef = React.useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  
  

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <button className="w-full bg-blue-500 text-white active:bg-blue-600 font-bold  text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            Print
            </button>
    ); 
  }, []);
  return (
    <div>
      <ReactToPrint
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

    export const MemberReport = (detail, info) => {
     
      
      const componentRef = React.useRef(null);
      const reactToPrintContent = React.useCallback(() => {
        return componentRef.current;
      }, [componentRef.current]);
    
    
      const reactToPrintTrigger = React.useCallback(() => {
        return (
          <button className="w-full bg-red-500 text-white active:bg-red-600 font-bold  text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                Print record
                </button>
        ); 
      }, []);
      return (
        <div>
          <ReactToPrint
            content={reactToPrintContent}
            trigger={reactToPrintTrigger}
          />
          <div 
          style={{ display: "none" }}
          >
            <FunctionalMemberReport ref={componentRef} text={detail} info={info} />
            </div>
        </div>
      );}
    

      
    export const DriverMasterList = (detail, info) => {
     
      
      const componentRef = React.useRef(null);
      const reactToPrintContent = React.useCallback(() => {
        return componentRef.current;
      }, [componentRef.current]);
    
    
      const reactToPrintTrigger = React.useCallback(() => {
        return (
          <button className="w-full bg-blue-500 text-white active:bg-blue-600 font-bold  text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                Print
                </button>
        ); 
      }, []);
      return (
        <div>
          <ReactToPrint
            content={reactToPrintContent}
            trigger={reactToPrintTrigger}
          />
          <div 
          style={{ display: "none" }}
          >
            <FunctionalDriverMasterList ref={componentRef} text={detail} info={info} />
            </div>
        </div>
      );}
    
      export const OperatorMasterList = (detail, info) => {
     
      
        const componentRef = React.useRef(null);
        const reactToPrintContent = React.useCallback(() => {
          return componentRef.current;
        }, [componentRef.current]);
      
      
        const reactToPrintTrigger = React.useCallback(() => {
          return (
            <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                  Masterlist
                  </button>
          ); 
        }, []);
        return (
          <div>
            <ReactToPrint
              content={reactToPrintContent}
              trigger={reactToPrintTrigger}
            />
            <div 
            style={{ display: "none" }}
            >
              <FunctionalOperatorMasterList ref={componentRef}  />
              </div>
          </div>
        );}

        export const Announcement = (detail, info) => {
     
      
          const componentRef = React.useRef(null);
          const reactToPrintContent = React.useCallback(() => {
            return componentRef.current;
          }, [componentRef.current]);
        
        
          const reactToPrintTrigger = React.useCallback(() => {
            return (
              <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                    Generate
                    </button>
            ); 
          }, []);
          return (
            <div className=" ">
              <ReactToPrint
                content={reactToPrintContent}
                trigger={reactToPrintTrigger}
              />
              <div  style={{ display: "none" }}>
              
          
                <FunctionalAnnouncement ref={componentRef} text={detail} info={info} />
                </div>
            </div>
          );}




          export const MonthlyReport = (detail, info) => {
     
      
            const componentRef = React.useRef(null);
            const reactToPrintContent = React.useCallback(() => {
              return componentRef.current;
            }, [componentRef.current]);
          
          
            const reactToPrintTrigger = React.useCallback(() => {
              return (
                <button className="w-full bg-blue-500 text-white active:bg-blue-600 font-bold  text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                      MONTHLY REPORT
                      </button>
              ); 
            }, []);
            return (
              <div>
                <ReactToPrint
                  content={reactToPrintContent}
                  trigger={reactToPrintTrigger}
                />
                <div 
                style={{ display: "none" }}
                >
                  <FunctionalMonthlyReport ref={componentRef} text={detail}  />
                  </div>
              </div>
            );}
          
        
      