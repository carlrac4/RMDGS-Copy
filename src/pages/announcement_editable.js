

import React ,{useState} from 'react'
import DatePicker from 'react-datepicker';
import { Announcement } from '../PrintComponent'
import { Navigation } from '../templates/navigation';


const Announcement_editable = () => {
  
    const [formValues, setFormValues] = useState({
        what: "",
        where: "",
        when: "",
        time: "",
        agenda: [],
      });
    
      const [whatValid, setWhatValid] = useState(true);
      const [whereValid, setWhereValid] = useState(true);
      const [agendaValid, setAgendaValid] = useState(true);
    
      const handleInputChange = (event) => {
        const { name, value } = event.target || {};
        setFormValues({
          ...formValues,
          [name]: value,
        });
      };
    
      const handleTextareaChange = (event) => {
        const { name, value } = event.target;
        const formattedValue = value;
        setFormValues((prevState) => ({
          ...prevState,
          [name]: formattedValue,
        }));
      };
    
      const handleDateChange = (date) => {
        setFormValues({
          ...formValues,
          when: date,
        });
      };
    
      const handleTimeChange = (time) => {
        setFormValues({
          ...formValues,
          time: time,
        });
      };
    
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
        });
      };
    
      const validateWhat = (value) => {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(value);
      };
    
      const validateWhere = (value) => {
        const regex = /^[a-zA-Z0-9\s]*$/;
        return regex.test(value);
      };
    
      const validateAgenda = (value) => {
        const regex = /^[a-zA-Z0-9\s]*$/;
        return regex.test(value);
      };
    
      const handleInputBlur = (event) => {
        const { name, value } = event.target;
    
        switch (name) {
          case "what":
            setWhatValid(validateWhat(value));
            
            break;
          case "where":
            setWhereValid(validateWhere(value));
            break;
          case "agenda":
            setAgendaValid(validateAgenda(value));
            break;
          default:
            break;
        }
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        // do something with formValues
      };
  return (
    <div>
             <div className="min-h-screen flex flex-row bg-gray-100">
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
      <Navigation />
      <div className="flex-1 px-2 sm:px-0 mx-4 my-4">

        <div className="w-full bg-white p-3 mb-3 text-center text-3xl border-t-4 border-green-400"> 
        <p> Generate Announcement Document</p>
        </div>
        <div className="md:flex no-wrap md:-mx-2 " >
       
        <div className="w-full md:w-7/12 md:mx-2 h-auto">


<div className="bg-white p-3 shadow-sm rounded-sm">
  
  <div className="flex flex-col p-3 justify-center">
   <span className="text-center"> Announcement</span>
   <div className="flex flex-row justify-center p-6 justify-items-center">
      <div className="table w-full justify-self-center ">     
          <div className="border-b-2 border-gray-200 w-full flex flex-row my-3 py-3">
            <div className="py-2 px-4 font-medium text-gray-700 flex flex-row">What:</div>
            <div className="py-2 px-4 text-gray-600">{formValues.what}</div>
          </div>
          <div className="border-b-2 border-gray-200  w-full flex flex-row my-3 py-3"> <div className="py-2 px-4 font-medium text-gray-700">Where:</div>
        <div className="py-2 px-4 text-gray-600">{formValues.where}</div>
      </div>
      <div className="border-b-2 border-gray-200   w-full flex flex-row my-3 py-3">
        <div className="py-2 px-4 font-medium text-gray-700">When:</div>
        <div className="py-2 px-4 text-gray-600">{formatDate(formValues.when)}</div>
      </div>
      <div className="border-b-2 border-gray-200  w-full flex flex-row my-3 py-3">
        <div className="py-2 px-4 font-medium text-gray-700">Time:</div>
        <div className="py-2 px-4 text-gray-600">{formatTime(formValues.time)}</div>
      </div>
      <div className="border-b-2 border-gray-200  w-full flex flex-row my-3 py-3">
        <div className="py-2 px-4 font-medium text-gray-700">Agenda:</div>
        <div className="py-2 px-4 text-gray-600"><pre>{formValues.agenda}</pre></div>
      </div>
  </div>
</div>
  
  </div>
</div>
<div className="my-4"></div>

</div>
          <div className="w-full md:w-5/12 md:mx-2 mb-2 bg-white">
            <div className="flex flex-col justify-center p-6">
            <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="what" className="block text-gray-700 font-bold mb-2">
          What
        </label>
        <input
          type="text"
          id="what"
          name="what"
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            !whatValid && "border-red-500"
          }`}
          value={formValues.what}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {!whatValid &&
<p className="text-red-500 text-xs italic">Please enter a valid value.</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="where" className="block text-gray-700 font-bold mb-2">
          Where
        </label>
        <input
          type="text"
          id="where"
          name="where"
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            !whereValid && "border-red-500"
          }`}
          value={formValues.where}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {!whereValid && (
          <p className="text-red-500 text-xs italic">Please enter a valid value.</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="when" className="block text-gray-700 font-bold mb-2">
          When
        </label>
        <DatePicker
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
          id="when"
          name="when"
          showIcon
          selected={formValues.when}
          onChange={handleDateChange}
          onBlur={handleInputBlur}
        />
      
      </div>
      <div className="mb-4">
        <label htmlFor="time" className="block text-gray-700 font-bold mb-2">
          Time
        </label>
        <DatePicker
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outlin`}
          id="time"
          name="time"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          selected={formValues.time}
          onChange={handleTimeChange}
          onBlur={handleInputBlur}
        />
       
      </div>
      <div className="mb-4">
        <label htmlFor="agenda" className="block text-gray-700 font-bold mb-2">
          Agenda
        </label>
        <textarea
          id="agenda"
          name="agenda"
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            !agendaValid && "border-red-500"
          }`}
          value={formValues.agenda}
          onChange={handleTextareaChange}
          onBlur={handleInputBlur}
        />
        {!agendaValid && (
          <p className="text-red-500 text-xs italic">Please enter a valid value.</p>
        )}
      </div>
      <div className="flex items-center justify-between">
      {!Object.values(formValues).some((value) => value === "") && (
            formValues.agenda == "" ? null : <Announcement {...formValues} />
            
            )}
      </div>
    </form>

          </div>
        
        </div>
      </div>
      <div className="w-full bg-white p-3 mb-3 italic text-center text-base"> 
        <p> **** Complete filling all the info to enable print and download button ***</p>
        </div>
        </div>
 

        </div>

    </div>
  )
}

export default Announcement_editable