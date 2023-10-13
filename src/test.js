import * as React from "react";
import ReactToPrint from "react-to-print";

import { ComponentToPrint } from "../ComponentToPrint";

export class ClassComponent extends React.PureComponent {
  componentRef = null;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      text: "old boring text"
    };
  }

  setComponentRef = (ref) => {
    this.componentRef = ref;
  };

  reactToPrintContent = () => {
    return this.componentRef;
  };

  reactToPrintTrigger = () => {
    return <button>Print using a Class Component</button>;
  };

  render() {
    return (
      <div>
        <ReactToPrint
          content={this.reactToPrintContent}
          documentTitle="AwesomeFileName"
          trigger={this.reactToPrintTrigger}
        />
        <ComponentToPrint ref={this.setComponentRef} text={this.state.text} />
      </div>
    );
  }
}
