import {Character} from "../models/character.js";

import {UpdateCharacterSchema} from "../schemas/characterSchema.js";
import {z} from "zod";
import {CharacterCreationSchema} from "../dto/characterCreationSchema.js";
import { db } from '../prisma/db.js';

export class CharacterRepository {


public static async getAll(): Promise<Character[]> {
    try {
        return await db.orm.public.Character.all();
    } catch (error) {
        console.error('Failed to load characters from database:', error);
        throw error;
    }
}

    public static async findById(id: string): Promise<Character | null> {
        try {
            return await db.orm.public.Character
                .where({ id })
                .first();
        } catch (error) {
            console.error(`Failed to find character with id ${id}:`, error);
            throw error;
        }
    }

        public static async update(
            id: string,
            updates: Partial<Omit<Character, "id">>
    ): Promise<Character | null>{
            try {
                const validatedUpdates = UpdateCharacterSchema.parse(updates);

                return await db.orm.public.Character
                    .where({ id })
                    .update(validatedUpdates);
            } catch (error) {
                console.error('Failed to update character:', error);
                throw error;
            }
        }
    public static async create(
        characterData: z.infer<typeof CharacterCreationSchema>
    ): Promise<Character> {
        try {
            const validatedData = CharacterCreationSchema.parse(characterData);

            return await db.orm.public.Character.create(validatedData);
        } catch (error) {
            console.error('Failed to create character:', error);
            throw error;
        }
    }

    public static async delete(
        id: string
    ): Promise<boolean>{
        try {
            const deletedCharacter = await db.orm.public.Character
                .where({ id })
                .delete();

            return deletedCharacter !== null;
        }catch (error){
            console.error('Failed to delete character:', error);
            throw error;
        }
    }

}