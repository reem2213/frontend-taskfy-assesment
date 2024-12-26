import React from "react";

const ViewToggle = ({ currentView, toggleView }) => {
  const views = ["table", "gantt", "hierarchical"];
  return (
    <div className="view-toggle">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => toggleView(view)}
          className={currentView === view ? "active" : ""}
        >
          {view} View
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;

