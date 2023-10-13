import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import "./styles/tooltip.css";

export function Tooltip ({ text, position, children }) {
    const tooltipClass = classNames('tooltip', position);
  
    return (
      <div className="relative">
        <div className={tooltipClass}>
          <div className="tooltip-arrow"></div>
          <div className="tooltip-text">{text}</div>
        </div>
        {children}
      </div>
    );
  };