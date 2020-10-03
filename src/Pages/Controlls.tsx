import React from "react";
import Timer from "../Components/Timer";

interface IProps {
  sendMessage: (chenel: string, message: string) => void;
  setQuestionsVisible: (val: boolean) => void;
}

export default function ({ sendMessage, setQuestionsVisible }: IProps) {
  return (
    <div className="page">
      <Timer />
      <span className="arrow" onClick={() => sendMessage("presentation", "moveUp")} role="img" aria-label="move-up">
        ⬆️
      </span>
      <div>
        <span className="arrow" onClick={() => sendMessage("presentation", "moveLeft")} role="img" aria-label="move-left">
          ⬅️
        </span>
        <span className="arrow" onClick={() => sendMessage("presentation", "moveRight")} role="img" aria-label="move-right">
          ➡️
        </span>
      </div>
      <span className="arrow" onClick={() => sendMessage("presentation", "moveDown")} role="img" aria-label="move-down">
        ⬇️
      </span>
      <br />
      <br />
      <button
        onClick={() => {
          sendMessage("presentation", "showQuestions");
          setQuestionsVisible(true);
        }}
        className="questions"
        id="showQuestions"
      >
        Show questions
      </button>
    </div>
  );
}
