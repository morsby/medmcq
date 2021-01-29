import Selection from 'classes/Selection';
import React, { useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';

const SemesterRerouter = () => {
  const semesterId = useParams<{ semesterId: string }>().semesterId;

  useEffect(() => {
    if (Number(semesterId) > 7) return;
    if (isNaN(Number(semesterId))) return;
    Selection.change({ type: 'semesterId', value: Number(semesterId) });
  });

  return <Redirect to="/" />;
};

export default SemesterRerouter;
