import React from "react";

export const TopLoaderSkeleton = () => {
  return (
    <div>
      {/* <div className="user-meeting-page-main-container"> */}
        <div className="user-meeting-page-top-wrapper">
          <div className="all-loader-header skeleton"></div>
          <div className="user-meeting-page-top-bar-wrapper">
            <div className="all-loader-tab skeleton"></div>
            <div className="all-loader-tab skeleton"></div>
            <div className="all-loader-tab skeleton"></div>
          </div>
        </div>

        {/* <div className="user-meeting-tab-preview">
          <div className="all-loader-details-btn skeleton"></div>
          <div className="personal-room-details-content">
            <div className="all-loader-details skeleton"></div>
            <div className="personal-room-bottom-options">
              <div className="all-loader-bottom-option skeleton"></div>
              <div className="all-loader-bottom-option skeleton"></div>
            </div>
          </div>
        </div> */}


      {/* </div> */}
    </div>
  );
};

export const ContentLoaderSkeleton = () =>{
    
    return (
        <div>
            {/* <div className="user-meeting-tab-preview"> */}
          <div className="all-loader-details-btn skeleton"></div>
          <div className="personal-room-details-content">
            <div className="all-loader-details skeleton"></div>
            <div className="personal-room-bottom-options">
              <div className="all-loader-bottom-option skeleton"></div>
              <div className="all-loader-bottom-option skeleton"></div>
            </div>
          </div>
        {/* </div> */}
        </div>
    )
}
