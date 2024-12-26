import React from "react";

export const GanttChart = ({ tasks }) => {
  const startDate = new Date(Math.min(...tasks.map((task) => new Date(task.issueDate).getTime())));
  const endDate = new Date(Math.max(...tasks.map((task) => new Date(task.dueDate).getTime())));
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const calculateBarPosition = (task) => {
    const taskStart = new Date(task.issueDate);
    const daysFromStart = Math.ceil((taskStart - startDate) / (1000 * 60 * 60 * 24));
    const taskDuration = Math.ceil(
      (new Date(task.dueDate) - taskStart) / (1000 * 60 * 60 * 24)
    );
    return { left: `${(daysFromStart / totalDays) * 100}%`, width: `${(taskDuration / totalDays) * 100}%` };
  };

  return (
    <div className="gantt-chart">
      <div className="gantt-header">
        {Array.from({ length: totalDays }, (_, i) => {
          const currentDate = new Date(startDate);
          currentDate.setDate(currentDate.getDate() + i);
          return (
            <div key={i} className="gantt-header-cell">
              {currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          );
        })}
      </div>
      <div className="gantt-body">
        {tasks.map((task) => {
          const { left, width } = calculateBarPosition(task);
          return (
            <div key={task.id} className="gantt-row">
              <div className="gantt-bar-container">
                <div
                  className="gantt-bar"
                  style={{
                    left,
                    width,
                  }}
                >
                {task.taskName}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
