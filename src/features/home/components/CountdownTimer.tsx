import {TimeLeft} from "@/features/home/types/home.types";
import { useEffect, useState } from "react";

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function CountdownTimer({
  targetDate,
  onFinish,
}: {
  targetDate: Date;
  onFinish?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(targetDate),
  );
  const [isFinished, setIsFinished] = useState(false);

  useEffect(
    function startTimer() {
      const timer = setInterval(function update() {
        const remaining = calculateTimeLeft(targetDate);
        setTimeLeft(remaining);

        const isZero = Object.values(remaining).every(function check(value) {
          return value === 0;
        });

        if (isZero) {
          setIsFinished(true);
          onFinish?.();
          clearInterval(timer);
        }
      }, 1000);

      return function cleanup() {
        clearInterval(timer);
      };
    },
    [targetDate, onFinish],
  );

  if (isFinished) return null;

  const units = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-8 text-center">
      {units.map(function renderUnit(unit) {
        return (
          <div key={unit.label} className="flex flex-col w-12">
            <span className="md:text-font-5 font-extrabold min-w-[36px] md:min-w-[44px]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-font-2 uppercase font-bold">
              {unit.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
