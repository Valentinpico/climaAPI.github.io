import { connect } from "mqtt";

const mqttServer = "broker.emqx.io";
const mqttPort = 1883;
const mqttTopic = "clima/01";

const client = connect(`mqtt://${mqttServer}:${mqttPort}`);

client.on("connect", () => {
  console.log("Conectado al broker MQTT");
  client.subscribe(mqttTopic);
});

client.on("message", async (topic, message) => {
  if (topic === mqttTopic) {
    const data = await JSON.parse(message.toString());
    // Aquí puedes hacer lo que desees con los datos, por ejemplo, enviarlos a la API Express
    sendDataToAPI(data);
  }
});

function sendDataToAPI(data) {
    console.log(data);
  fetch("http://localhost:3000/clima", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
}

export default client;