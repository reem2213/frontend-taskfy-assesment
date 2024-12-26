import React, { useState, useRef } from "react";
import axios from "axios";

const Table = ({ tasks, setTasks }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [draggedTask, setDraggedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});
  const tableRef = useRef(null);

  const API_URL = "http://localhost:3000/tasks";

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilter(value);
    setFilteredTasks(
      value
        ? tasks.filter((task) => task.assignee.includes(value.toLowerCase()))
        : tasks
    );
  };

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
    const sorted = [...filteredTasks].sort((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredTasks(sorted);
  };

  const handleResize = (e, index) => {
    const startX = e.pageX;
    const table = tableRef.current;
    const headerCell = table.querySelectorAll("th")[index];
    const startWidth = headerCell.offsetWidth;

    const handleMouseMove = (event) => {
      const newWidth = startWidth + (event.pageX - startX);
      headerCell.style.width = `${newWidth}px`;
      headerCell.style.minWidth = `${newWidth}px`;
      headerCell.style.maxWidth = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDragStart = (index) => setDraggedTask(index);

  const handleDrop = (index) => {
    const reordered = [...filteredTasks];
    const [removed] = reordered.splice(draggedTask, 1);
    reordered.splice(index, 0, removed);
    setFilteredTasks(reordered);
    setTasks(reordered);
    setDraggedTask(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task.id);
    setEditTaskData(task);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditTaskData({ ...editTaskData, [name]: value });
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editTask}`, editTaskData);
      const updatedTask = response.data;
      const updatedTasks = tasks.map((task) =>
        task.id === editTask ? { ...task, ...updatedTask } : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setEditTask(null);
      setEditTaskData({});
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  return (
    <div className="table-view">
      <div className="filter-container">
        <label className="filter-label">Filter by assignee:</label>
        <input
          className="filter-input"
          type="text"
          placeholder="Filter by assignee"
          value={filter}
          onChange={handleFilter}
        />
      </div>
      <table ref={tableRef}>
        <thead>
          <tr>
            {[
              { label: "Task Name", key: "taskName" },
              { label: "Assignee", key: "assignee" },
              { label: "Due Date", key: "dueDate" },
              { label: "Issue Date", key: "issueDate" },
              { label: "Hours Spent", key: "hoursSpent" },
              { label: "Project", key: "project" },
              { label: "Difficulty", key: "difficulty" },
            ].map(({ label, key }, index) => (
              <th key={index}>
                <div className="resizable-header">
                  <span onClick={() => handleSort(key)}>{label}</span>
                  <div
                    className="resize-handle"
                    onMouseDown={(e) => handleResize(e, index)}
                  ></div>
                </div>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((t, index) => (
            <tr
              key={t.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              {editTask === t.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="taskName"
                      value={editTaskData.taskName || ""}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="assignee"
                      value={editTaskData.assignee || ""}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="dueDate"
                      value={editTaskData.dueDate || ""}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="issueDate"
                      value={editTaskData.issueDate || ""}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="hoursSpent"
                      value={editTaskData.hoursSpent || ""}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="project"
                      value={editTaskData.project || ""}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="difficulty"
                      value={editTaskData.difficulty || ""}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <button
                      className="button button-save"
                      onClick={handleEditSave}
                    >
                      Save
                    </button>
                    <button
                      className="button button-cancel"
                      onClick={() => setEditTask(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{t.taskName}</td>
                  <td>{t.assignee}</td>
                  <td>{t.dueDate}</td>
                  <td>{t.issueDate}</td>
                  <td>{t.hoursSpent}</td>
                  <td>{t.project}</td>
                  <td>{t.difficulty}</td>
                  <td>
                    <button
                      className="button button-delete"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="button button-edit"
                      onClick={() => handleEdit(t)}
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
