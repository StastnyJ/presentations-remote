import React, { useEffect, useState } from "react";
import LoadingPage from "./Pages/Loading";
import ControllsPage from "./Pages/Controlls";
import QuestionsPage, { Question } from "./Pages/Questions";
import "./App.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import ErrorPage from "./Pages/ErrorPage";
import mqtt from "mqtt";

type appState = "connected" | "connecting" | "connectionLost" | "failed";

function App() {
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | undefined>(undefined);
  const [state, setState] = useState<appState>("connecting");
  const [questionsVisible, setQuestionsVisible] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const sendMessage = (channel: string, msg: string) => {
    if (mqttClient !== undefined) mqttClient.publish(channel, msg);
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
    const client = mqtt.connect("wss://stastnyj.duckdns.org:9001/mqtt");

    client.on("connect", () => {
      client.subscribe("remote");
      setState("connected");
    });

    client.on("message", function (topic, message) {
      messageArrived(message.toString());
    });

    client.on("disconnect", () => setState("connectionLost"));

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
