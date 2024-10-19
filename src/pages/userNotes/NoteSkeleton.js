import React from "react";

const NoteSkeleton = () => {
    const dummyArray = [
        { key: '1' },
        { key: '2' },
        { key: '3' },
        { key: '4' },
        { key: '5' }
      ];
  return (
    <div>
      <div className="note-list-main-container">
        {dummyArray.map((item, index) => (
        <div className="note-content-card-main-wrapper" key={item.key}>
          <div className="note-card-top">
            <div className="skeleton-note-type skeleton"></div>
            <div className="note-content-card-controls">
              <div className="skeleton-btn skeleton"></div>
              <div className="skeleton-btn skeleton"></div>
              <div className="skeleton-btn skeleton"></div>
            </div>
          </div>
          <div className="note-card-content">
            <div className="note-card-content-title skeleton "></div>
            <div className="note-card-content-desc skeleton"></div>
          </div>
          <div className="skeleton skeleton-date"></div>
        </div>))}
      </div>
    </div>
  );
};

export default NoteSkeleton;
