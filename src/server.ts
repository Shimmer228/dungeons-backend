import express, {Request, Response} from "express";
import Character from "./models/character.ts"

const app = express();
const port = 3000;
app.use(express.json());

app.get("/characters", (req: Request, res: Response)=> {
    res.send(characters);
    });
app.get("/characters/:id", (req: Request, res: Response)=> {
    const characterId = parseInt(req.params.id);
    const character = characters.find(char => char.id === characterId);
    if (character) {
            res.json(character);
        } else {
            res.status(404).json({
                message:"Character not found"
                });
        }
    });
app.post("/characters", (req:Request, res: Response) =>{
    const newId = characters.length >0 ? characters[characters.length - 1].id + 1 : 0;
    const newChar : Character = {
    id:newId,
    name: req.body.name,
    race: req.body.race,
    class: req.body.class,
    level: req.body.level,
    hp:req.body.hp
    };
    characters.push(newChar);
    res.status(201).json(newChar);
    });

app.delete("/characters/:id",(req:Request, res: Response) =>{
    const charID = parseInt(req.params.id);
    const char = characters.find(char => char.id === charID);
    if(char){
    characters.splice(characters.indexOf(char), 1);
    res.sendStatus(204);
    } else res.status(404).json({message: "no character with such ID"});
    });


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
    });
let characters: Character[] =
    [{
    id: 0,
    name: 'Alucard',
    race: 'Eladrin',
    class: 'Warlock',
    level: 4,
    hp: 49
    },
    {
    id: 1,
    name: 'Serafim',
    race: 'Human',
    class: 'Monk',
    level: 3,
    hp: 37
    },
    {
    id: 2,
    name: 'Lucian fon Reimar',
    race: 'Human',
    class: 'Bard',
    level: 3,
    hp: 29
    },
    {
    id: 3,
    name: 'Sir Avrelian',
    race: 'Harengon',
    class: 'Paladin',
    level: 5,
    hp: 56
    },
    {
    id: 4,
    name: 'Yoren',
    race: 'Human',
    class: 'Paladin',
    level: 5,
    hp: 56
    },
    ]