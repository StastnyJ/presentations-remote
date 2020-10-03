import mqtt, { MqttClient } from "mqtt";

const websocketUrl = "mqtt://159.89.4.84";
const apiEndpoint = "presentation/";

function getClient(errorHandler: (msg: string) => void) {
  const client = mqtt.connect(websocketUrl);
  // @ts-ignore
  client.stream.on("error", () => {
    errorHandler(`Connection to ${websocketUrl} failed`);
    client.end();
  });
  return client;
}

function subscribe(client: MqttClient, topic: string, errorHandler: (msg: string) => void) {
  const callBack = (err: any) => {
    if (err) {
      errorHandler("Subscription request failed");
    }
  };
  return client.subscribe(apiEndpoint + topic, callBack);
}

function onMessage(client: MqttClient, callBack: (data: any) => void) {
  client.on("message", (topic, message, packet) => {
    callBack(JSON.parse(new TextDecoder("utf-8").decode(message)));
  });
}

function unsubscribe(client: MqttClient, topic: string) {
  client.unsubscribe(apiEndpoint + topic);
}

function closeConnection(client: MqttClient) {
  client.end();
}

const mqttService = {
  getClient,
  subscribe,
  onMessage,
  unsubscribe,
  closeConnection,
};

export default mqttService;
