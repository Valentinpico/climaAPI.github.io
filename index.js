import express from "express";
import { connect, Schema as _Schema, model } from "mongoose";
import cors from "cors";

await connect("mongodb+srv://alexmedranda:1234@cluster0.ncqopcc.mongodb.net/");

const Schema = _Schema;
const ClimaSchema = new Schema({
  Humedad: Number,
  Temperatura: Number,
  fecha: Date,
});
const Clima = model("Clima", ClimaSchema);

const app = express();

app.use(cors());
app.use(express.json());

app.post("/clima", async (req, res) => {
  const data = req.body;

  try {
    const newClima = new Clima({ ...data, fecha: new Date().toISOString() });
    await newClima.save();
    res.send({ res: "Clima creado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el clima.");
  }
});
//obtener el ultimo clima
app.get("/clima", async (req, res) => {
  try {
    const totalDocuments = await Clima.countDocuments();
    let clima = await Clima.findOne().sort({ _id: -1 }).limit(1);
    clima = { ...clima._doc, totalDocuments };
    res.json(clima);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el clima.");
  }
});
//borrar toda la colleccion
app.delete("/clima", async (req, res) => {
  try {
    await Clima.deleteMany();
    res.send({ res: "Clima borrado exitosamente." });
  } catch (error) {
    console.error(error);

    res.status(500).send("Error al borrar el clima.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
