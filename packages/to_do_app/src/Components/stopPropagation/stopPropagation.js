import React from 'react';

const stopPropagation = e => e.stopPropagation();

export const StopPropagationWrapper = ({ children }) => (
  <div onClick={stopPropagation}>{children}</div>
);
