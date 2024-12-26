import React, { useState } from "react";

const HierarchicalView = ({ tasks }) => {
  const [expanded, setExpanded] = useState({});
  const groupedTasks = tasks.reduce((acc, task) => {
    const assignee = task.assignee || "Unassigned";
    const dueDate = task.dueDate || "No Due Date";
    acc[assignee] = acc[assignee] || {};
    acc[assignee][dueDate] = acc[assignee][dueDate] || [];
    acc[assignee][dueDate].push(task);
    return acc;
  }, {});

  const toggleExpand = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <table className="hierarchical-table">
      <thead>
        <tr>
          <th>Assignee</th>
          <th>Due Date</th>
          <th>Task Details</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedTasks).map(([assignee, dueDates]) => (
          <React.Fragment key={assignee}>
            <tr>
              <td colSpan="3" onClick={() => toggleExpand(assignee)}>
                <span style={{ cursor: "pointer" }}>
                  {expanded[assignee] ? "▼" : "▶"} {assignee}
                </span>
              </td>
            </tr>
            {expanded[assignee] &&
              Object.entries(dueDates).map(([dueDate, tasks]) => (
                <React.Fragment key={dueDate}>
                  <tr>
                    <td></td>
                    <td onClick={() => toggleExpand(`${assignee}-${dueDate}`)}>
                      <span style={{ cursor: "pointer" }}>
                        {expanded[`${assignee}-${dueDate}`] ? "▼" : "▶"}{" "}
                        {dueDate}
                      </span>
                    </td>
                    <td></td>
                  </tr>
                  {expanded[`${assignee}-${dueDate}`] &&
                    tasks.map((task) => (
                      <tr key={task.id}>
                        <td></td>
                        <td></td>
                        <td>{task.taskName}</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};
export default HierarchicalView;
