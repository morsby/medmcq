import React, { useEffect, ReactPropTypes } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Higher Order Component der bruges til at scrolle til toppen når der ændres
 * spørgsmål i quizzen.
 */
const ScrollToTop: React.SFC<any> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return children;
};

export default ScrollToTop;
