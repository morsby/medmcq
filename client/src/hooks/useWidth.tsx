import React, { useState, useEffect } from 'react';
import _ from 'lodash';

export interface useWidthProps {}

const useWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let handleResize = () => setWidth(window.innerWidth);
    handleResize = _.debounce(handleResize, 300);

    window.addEventListener('resize', handleResize);

    return window.removeEventListener('resize', handleResize);
  }, []);

  return { width };
};

export default useWidth;
