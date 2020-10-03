import React, { useEffect, useState } from "react";
import LoadingPage from "./Pages/Loading";
import ControllsPage from "./Pages/Controlls";
import QuestionsPage, { Question } from "./Pages/Questions";
import "./App.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Client, Message } from "paho-mqtt";
import ErrorPage from "./Pages/ErrorPage";

type appState = "connected" | "connecting" | "connectionLost" | "failed";

function App() {
  const [mqttClient, setMqttClient] = useState<Client | undefined>(undefined);
  const [state, setState] = useState<appState>("connecting");
  const [questionsVisible, setQuestionsVisible] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const sendMessage = (chanel: string, message: string) => {
    const msg = new Message(message);
    msg.destinationName = chanel;
    if (mqttClient !== undefined) mqttClient.send(msg);
  };

  const messageArrived = (msg: string) => {
    console.log(msg);
    if (msg.startsWith("questionsInformation")) {
      msg = msg.replace("questionsInformation/", "");
      const info: { [index: number]: string } = JSON.parse(msg);
      setQuestions(
        ((Object.keys(info) as unknown[]) as number[]).map((index) => {
          return { id: index, text: info[index] };
        })
      );
    }
  };

  useEffect(() => {
    const client = new Client("159.89.4.84", 9001, "remote" + Math.round(Math.random() * 1000).toString());
    client.onMessageArrived = (m) => messageArrived(m.payloadString);
    client.onConnectionLost = () => setState("connectionLost");
    client.connect({
      onSuccess: () => {
        client.subscribe("remote");
        setState("connected");
      },
      onFailure: () => {
        alert("Failed to connect");
        setState("failed");
      },
    });
    setMqttClient(client);
  }, []);

  return (
    <FullScreen handle={useFullScreenHandle()}>
      {state === "connecting" ? (
        <LoadingPage />
      ) : state === "failed" || state === "connectionLost" ? (
        <ErrorPage />
      ) : questionsVisible ? (
        <QuestionsPage
          setQuestionsVisible={setQuestionsVisible}
          sendMessage={sendMessage}
          questions={questions}
          setQusetions={setQuestions}
        />
      ) : (
        <ControllsPage setQuestionsVisible={setQuestionsVisible} sendMessage={sendMessage} />
      )}
    </FullScreen>
  );
}

export default App;
