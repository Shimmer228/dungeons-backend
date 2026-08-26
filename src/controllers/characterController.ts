import type {
    Request,
    Response,
} from "express";

import { CharacterService } from "../services/characterService.js";
import { UpdateCharacterSchema } from "../schemas/characterSchema.js";
import { CharacterSchema } from "../schemas/characterSchema.js";
import {safeParse} from "zod";
import {CharacterFiltersSchema} from "../dto/characterFiltersSchema.js";

type CharacterParams = {
    id: string;
};

export const getCharacters = (
    req: Request,
    res: Response
) => {
    const validationResult = CharacterFiltersSchema.safeParse(req.query);

    if (!validationResult.success) {
        return res.status(400).json({
            message: "Invalid query parameters",
            errors: validationResult.error.flatten()
        });
    }
    const result = CharacterService.getAll(validationResult.data);

    return res.status(200).json(result);
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


export const createCharacter = (
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
        CharacterService.create(
            validation.data
        );

    return res.status(201).json(character);
};


export const deleteCharacter = (
    req: Request<CharacterParams>,
    res: Response
) => {
    const deleted =
        CharacterService.delete(
            req.params.id
        );

    if (!deleted) {
        return res.sendStatus(404);
    }

    return res.sendStatus(204);
};


export const updateCharacter = (
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

    const updatedCharacter =
        CharacterService.update(
            req.params.id,
            validation.data
        );

    if (!updatedCharacter) {
        return res.sendStatus(404);
    }

    return res.json(updatedCharacter);
};