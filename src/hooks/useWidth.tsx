import { useState, useEffect } from 'react';

export interface useWidthProps {}

const useWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
  }, []);

  return { width };
};

export default useWidth;
