import { Request, Response } from "express";
import {characters} from "../data/characters.ts"
import {UpdateCharacterSchema} from "../schemas/characterSchema.ts"
import { randomUUID } from 'crypto';
import { z } from 'zod';

    const findCharacterById = (characterId:string) => {
        return characters.find(char => char.id === characterId);
    }

    export const getCharacters = (req:Request, res: Response) => {
        const {class:characterClass, race, level, sort} = req.query;
        console.log("Active filters:", { characterClass, race, level });
        const result = characters.filter((char) => {
            if(characterClass && String(characterClass) !== char.class) return false;
            if(race && String(race) !== char.race) return false;
            if(level && Number(level) !== char.level) return false;
            return true;
            });
        if(sort){
            const sortString = String(sort);
            const isDesc = sortString.startsWith("-");
            const field = (isDesc ? sortString.slice(1) : sortString);
            const validFields: (keyof Character)[] = ['name', 'level', 'class', 'race', 'id'];

            if(validFields.includes(field)){
                result.sort((a,b)=>{
                    const valueA = a[field];
                    const valueB = b[field];
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return isDesc
                        ? valueB.localeCompare(valueA)
                        : valueA.localeCompare(valueB);
                    }
                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                           return isDesc
                           ? valueB - valueA
                           : valueA - valueB;
                    }

                        return 0;
                });
            }
        }
            return res.status(200).json({result})
    }

    export const getOneCharacter = (req:Request, res: Response) =>{
            console.log("getting one character");
            const character: Character = findCharacterById(req.params.id);
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
        const newChar : Character = {
            id:randomUUID(),
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
        console.log(`deleting character with id = ${req.params.id}`);
       const character = findCharacterById(req.params.id);
        if(character){
        characters.splice(characters.indexOf(char), 1);
        res.sendStatus(204);
        }else
            res.status(404).json({message: "no character with such ID"});
    }



    export const changeCharacter = (req: Request, res: Response) =>{
        console.log("Updating character")
        const character = findCharacterById(req.params.id);
        const charIndex = characters.indexOf(character);
        if(character) {
            const result = UpdateCharacterSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                  message: 'Invalid request data'
                });

            }
            const updates = result.data;
            const updatedCharacter: Character = {
                ...characters[charIndex],
                ...updates
            };
            characters[charIndex] = updatedCharacter;
            res.json(updatedCharacter);
        }else res.sendStatus(404);

    }