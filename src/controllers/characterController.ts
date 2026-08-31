import type {
    Request,
    Response,
} from "express";

import { CharacterService } from "../services/characterService.js";
import { UpdateCharacterSchema } from "../schemas/characterSchema.js";
import { CharacterSchema } from "../schemas/characterSchema.js";
import {CharacterFiltersSchema} from "../dto/characterFiltersSchema.js";
import {HpChangeSchema} from "../dto/characterHpChangeSchema.js";

type CharacterParams = {
    id: string;
};

export const getCharacters = async (
    req: Request,
    res: Response
) => {
    try {
        const validationResult = CharacterFiltersSchema.safeParse(req.query);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid query parameters",
                errors: validationResult.error.flatten()
            });
        }
        const result = await CharacterService.getAll(validationResult.data);

        return res.status(200).json(result);
    }catch (error){
        console.error("Error retrieving characters:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getOneCharacter = (
    req: Request<CharacterParams>,
    res: Response
) => {
    const character =
        CharacterService.findById(
            req.params.id
        );

    if (!character) {
        return res.sendStatus(404);
    }

    return res.json(character);
};


export const createCharacter = async (
    req: Request,
    res: Response
) => {
    const validation =
        CharacterSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid character data",
            errors: validation.error.issues
        });
    }

    const character =
        await CharacterService.create(
            validation.data
        );

    return res.status(201).json(character);
};


export const deleteCharacter = async (
    req: Request<CharacterParams>,
    res: Response
) => {
    const deleted =
        await CharacterService.delete(
            req.params.id
        );

    if (!deleted) {
        return res.sendStatus(404);
    }

    return res.sendStatus(204);
};


export const updateCharacter = async (
    req: Request<CharacterParams>,
    res: Response
) => {
    const validation =
        UpdateCharacterSchema.safeParse(
            req.body
        );

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: validation.error.issues
        });
    }

    const updatedCharacter = await
        CharacterService.update(
            req.params.id,
            validation.data
        );

    if (!updatedCharacter) {
        return res.sendStatus(404);
    }

    return res.json(updatedCharacter);
};
export const changeHpOfCharacter = async (
    req: Request<CharacterParams>,
    res: Response
) => {
    try {
        const validation = HpChangeSchema.safeParse(req.body);

        if (!validation.success) return res.status(400).json({message: "invalid amount"})
        const result = await CharacterService.changeHP(req.params.id, Number(req.body.amount));
        return result ? res.status(200).json(result) : res.sendStatus(404);
    }catch(error){
        console.error("Error while changing hp:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
