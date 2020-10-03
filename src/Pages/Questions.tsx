import React from "react";

interface IProps {
  sendMessage: (chenel: string, message: string) => void;
  setQuestionsVisible: (val: boolean) => void;
  questions: Question[];
  setQusetions: (questions: Question[]) => void;
}

export interface Question {
  id: number;
  text: string;
}

export default function ({ sendMessage, setQuestionsVisible, setQusetions, questions }: IProps) {
  return (
    <div className="page">
      <table id="questionsTable">
        {questions.map((q) => (
          <tr
            onClick={() => {
              sendMessage("presentation", `removeQuestion/${q.id}`);
              setQusetions(questions.filter((ques) => ques.id !== q.id));
            }}
          >
            <td>{q.text}</td>
            <td className="deleteQuestion">X</td>
          </tr>
        ))}
      </table>
      <button
        onClick={() => {
          sendMessage("presentation", "hideQuestions");
          setQuestionsVisible(false);
        }}
        className="questions"
        id="hideQuestions"
      >
        Hide questions
      </button>
    </div>
  );
}
