import { useEffect, useState } from 'react';

function Time() {
  const [date, setTime] = useState(new Date());
  const formatNumber = (num: any) => {
    return num?.toString()?.padStart(2, '0');
  };
  const formattedDate = `${date.getFullYear()}-${formatNumber(
    date.getMonth() + 1,
  )}-${formatNumber(date.getDate())}`;

  const formattedHour = `${formatNumber(date.getHours())}:${formatNumber(
    date.getMinutes(),
  )}:${formatNumber(date.getSeconds())}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 在组件卸载时清除定时器
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <span>{formattedDate}</span>
      <span>{formattedHour}</span>
    </>
  );
}

export default Time;
