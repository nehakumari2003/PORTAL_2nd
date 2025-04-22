import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-6 py-3 rounded-full shadow-lg hover:bg-opacity-80 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;