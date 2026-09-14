import express from "express";
import cors from "cors";
import toDoRoutes from "./routes/todos.js";
import { configDotenv } from "dotenv";

// loads .env file contents into process.env.
configDotenv();

const app = express();
const PORT = process.env.PORT || 5000;

// app.get("/about", (req, res) => {
//    res.send("Hello World!");
// });

app.use(cors());
app.use(express.json());

app.use("/todos", toDoRoutes);

app.get("/", (req, res) => {
   res.send("Test");
})

app.listen(PORT, () => {
   console.log(`server is running at ${PORT}`);
});