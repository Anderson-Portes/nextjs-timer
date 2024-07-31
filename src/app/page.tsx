"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Prisma } from "@prisma/client";
import { signOut } from "next-auth/react";
import CreatableSelect from "react-select/creatable";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Description = { label: string; value: string } | null;

const Timer = () => {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeLogs, setTimeLogs] = useState<Prisma.TimeLogCreateInput[]>([]);
  const [descriptionOptions, setDescriptionOptions] = useState<any>([]);
  const [description, setDescription] = useState<Description>(null);
  const timer = useRef<NodeJS.Timeout | any>();

  useEffect(() => {
    fetchTimeLogs();
    fetchDescriptions();
  }, []);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - elapsedTime;
      timer.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current);
  }, [isRunning, elapsedTime]);

  const fetchTimeLogs = async () => {
    try {
      const { data } = await axios.get("/api/time-log");
      setTimeLogs(data);
      const totalElapsedTime = calculateTotalElapsedTime(data);
      setElapsedTime(totalElapsedTime);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchDescriptions = async () => {
    try {
      const { data } = await axios.get("/api/time-log/descriptions");
      setDescriptionOptions(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const calculateTotalElapsedTime = (data: Prisma.TimeLogCreateInput[]) => {
    return data.reduce((total, log) => {
      const startTime = log.createdAt ? new Date(log.createdAt) : new Date();
      const endTime = log.finishedAt ? new Date(log.finishedAt) : new Date();
      const diff = endTime.getTime() - startTime.getTime();
      return total + diff;
    }, 0);
  };

  const handleButtonClick = async () => {
    setIsRunning(!isRunning);
    await axios.post("/api/time-log", { description: description?.value });
    await fetchTimeLogs();
  };

  const handleLogout = () => {
    signOut({
      redirect: false,
    });
    router.push("/login");
  };

  const handleDelete = async (id: string | undefined) => {
    try {
      await axios.delete(`/api/time-log/${id}`);
      fetchTimeLogs();
    } catch (error) {
      console.log("Error deleting data:", error);
    }
  };

  const handleCreateDescriptionOption = (value: string) => {
    const newDescription = { label: value, value };
    setDescriptionOptions([...descriptionOptions, newDescription]);
    setDescription(newDescription);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-4 left-4">
        <Link
          href="/export"
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
        >
          Export
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <CreatableSelect
        options={descriptionOptions}
        onCreateOption={handleCreateDescriptionOption}
        onChange={(option) => setDescription(option || null)}
        value={description}
        className="w-60 mb-4"
      />
      <button
        onClick={handleButtonClick}
        className={`px-8 py-10 font-bold text-white rounded-full ${
          isRunning
            ? "bg-red-500 hover:bg-red-700"
            : "bg-green-500 hover:bg-green-700"
        }`}
      >
        {isRunning ? "Parar" : "Iniciar"}
      </button>
      <div className="mt-4 text-lg font-semibold">
        Tempo: {Math.floor(elapsedTime / 1000)} segundos
      </div>
      <div className="mt-4 w-full max-w-xl overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 text-left">Descrição</th>
              <th className="py-3 px-6 text-left">Criado em</th>
              <th className="py-3 px-6 text-left">Finalizado em</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {timeLogs.slice(0, 3).map((log) => (
              <tr key={log.id}>
                <td className="py-3 px-6 text-left">{log.description}</td>
                <td className="py-3 px-6 text-left">
                  {log.createdAt && new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-left">
                  {log.finishedAt && new Date(log.finishedAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {timeLogs.length > 3 && (
          <div className="text-gray-600 text-sm mt-2">
            <p>Mostrando 3 de {timeLogs.length} registros</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
