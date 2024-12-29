import { addSecond } from "@formkit/tempo";
import "./Pomodoro.css";
import { useState, useEffect, useMemo, useRef } from "react";

export default function Pomodoro() {
  const initialTime = useMemo(() => new Date(0, 0, 0, 0, 0, 3), []); // начальное время 3 секунды для теста
  const [timeLeft, setTimeLeft] = useState(initialTime); // сохраняем оставшееся время
  const [isActive, setIsActive] = useState(false); // состояние таймера (запущен или остановлен)
  const [numOfReps, setNumOfReps] = useState(1); // количество циклов

  const intervalRef = useRef(null); // для хранения идентификатора интервала
  const isTimerFinished = useRef(false); // для отслеживания завершения таймера

  // Очистка интервала при размонтировании
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const minutes = prevTime.getMinutes();
          const seconds = prevTime.getSeconds();

          // Если время закончено
          if (minutes === 0 && seconds === 1 && !isTimerFinished.current) {
            isTimerFinished.current = true; // Устанавливаем флаг, что таймер завершен
            clearInterval(intervalRef.current);
            setIsActive(false); // останавливаем таймер
            setTimeLeft(initialTime); // сбрасываем таймер на начальное значение
            setNumOfReps((prevReps) => prevReps + 1); // увеличиваем счетчик повторений
            return initialTime; // сбрасываем время
          }

          return addSecond(prevTime, -1); // вычитаем 1 секунду
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current); // очищаем интервал при размонтировании
    };
  }, [isActive, initialTime]);

  // Функция для форматирования времени в "MM:SS"
  const formatTime = (date) => {
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleTimer = () => {
    if (isActive) {
      // Если таймер активен, ставим его на паузу
      setIsActive(false);
    } else {
      // Если таймер не активен, запускаем его
      setIsActive(true);
      isTimerFinished.current = false; // сбрасываем флаг завершения при старте нового таймера
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current); // останавливаем интервал
    setIsActive(false); // останавливаем таймер
    setTimeLeft(initialTime); // сбрасываем время
    isTimerFinished.current = false; // сбрасываем флаг завершения
  };

  return (
    <div className="pomodoro-container">
      <h1>Pomodoro Timer</h1>
      <p className="timer">{formatTime(timeLeft)}</p>
      <div className="controls">
        <button onClick={toggleTimer}>{isActive ? "Pause" : "Start"}</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <p className="numOfReps">#{numOfReps}</p>
    </div>
  );
}
