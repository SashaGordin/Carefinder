import React from "react";

const ProgressBar = ({ currentQuestionIndex, totalQuestions }) => {
  // Calculate the progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full h-2 bg-gray-200 fixed bottom-0 left-0 rounded mb-10">
      <div
        className="h-full bg-pink-500 transition-all duration-300 rounded"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;