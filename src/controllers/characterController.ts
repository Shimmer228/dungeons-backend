import { Request, Response } from "express";
import {characters} from "../data/characters.ts"

    export const getAllCharacters = (req:Request, res: Response) => {
        console.log("getting all characters");
        if(characters)
        return res.status(200).json({characters});
        return res.sendStatus(404);
    }

    export const getOneCharacter = (req:Request, res: Response) =>{
        console.log("getting one character");
         const characterId = parseInt(req.params.id);
            const character = characters.find(char => char.id === characterId);
            if (character) {
                   return res.json(character);
                } else {
                   return res.status(404).json({
                        message:"Character not found"
                        });
                }
    }

    export const createCharacter =  (req:Request, res: Response) =>{
        console.log("creating a character");
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

    }

    export const deleteCharacter = (req:Request, res: Response) =>{
        console.log("deleting character");
        const charID = parseInt(req.params.id);
        const char = characters.find(char => char.id === charID);
        if(char){
        characters.splice(characters.indexOf(char), 1);
        res.sendStatus(204);
        }else
            res.status(404).json({message: "no character with such ID"});
    }
