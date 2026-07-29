import express, {Request, Response} from "express";
import Character from "./models/character.ts";
import characters from "./data/characters.ts";
import characterRoutes from "./routes/characterRoutes.ts";
const app = express();
const port = 3000;
app.use(express.json());
app.use("/characters", characterRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
    });
