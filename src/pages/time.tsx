import { useState } from "react";

export default function TimeDatePage() {
  const [dateTime, setDateTime] = useState(new Date("2025-04-05T00:00:00"));
  const [manualTime, setManualTime] = useState("");

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualTime(event.target.value);
  };

  const handleSetTime = () => {
    if (manualTime) {
      setDateTime(new Date(manualTime));
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold">Time & Date</h1>
      <p className="text-lg mt-2">{dateTime.toLocaleString()}</p>
      <input
        type="datetime-local"
        className="border rounded p-2 mt-4"
        value={manualTime}
        onChange={handleTimeChange}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        onClick={handleSetTime}
      >
        Set Time
      </button>
    </div>
  );
}
