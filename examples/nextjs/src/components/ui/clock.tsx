import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <div>{currentTime ? currentTime.toUTCString() : 'Loading...'}</div>;
};

export default Clock;
