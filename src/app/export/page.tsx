"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import * as xlsx from "xlsx";

const Export = () => {
  const [initialDate, setInitialDate] = useState<string>("");
  const [finalDate, setFinalDate] = useState<string>("");
  const handleExport = async () => {
    try {
      const { data } = await axios.get(
        `/api/time-log/export?initialDate=${initialDate}&finalDate=${finalDate}`
      );
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      xlsx.writeFile(workbook, `data.xlsx`);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
        >
          Home
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block">Initial Date</label>
          <input type="date" onChange={(e) => setInitialDate(e.target.value)} />
        </div>
        <div className="col-span-1">
          <label className="block">Final Date</label>
          <input type="date" onChange={(e) => setFinalDate(e.target.value)} />
        </div>
      </div>
      <button
        className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 mt-4"
        onClick={handleExport}
      >
        Export
      </button>
    </div>
  );
};

export default Export;
