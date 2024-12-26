"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ViewToggle from "../components/ViewToggle";
import Table from "../components/Table";
import { GanttChart } from "../components/GanttChart";
import HierarchicalView from "../components/HierarchicalView";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/tasks")
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

 
  return (
    <div>
      <h1>Task Management</h1>
      <ViewToggle currentView={view} toggleView={setView} />
      {view === "table" && <Table tasks={tasks} setTasks={setTasks} />}
      {view === "gantt" && <GanttChart tasks={tasks} />}
      {view === "hierarchical" && <HierarchicalView tasks={tasks} />}
    </div>
  );
}
