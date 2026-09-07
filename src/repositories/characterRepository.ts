import {Character} from "../models/character.js";
import {
    readFile,
    writeFile
} from "fs/promises";
import {CharacterSchema} from "../schemas/characterSchema.js";
import {z} from "zod";
import {CharacterCreationSchema} from "../dto/characterCreationSchema.js";
import { db } from '../prisma/db.js';

export class CharacterRepository {
    private static filePath = './src/data/characters.json';


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
    public static async saveAll(characters: Character[]): Promise<void> {
        try {
            const validatedData = z.array(CharacterCreationSchema).parse(characters);
            const jsonData = JSON.stringify(validatedData, null, 2);
            await writeFile(this.filePath, jsonData, 'utf-8');
        } catch (error) {
            console.error('Failed to save characters:', error);
            throw error;
        }
    }
        public static async update(
            id: string,
            updates: Partial<Omit<Character, "id">>
    ): Promise<Character | null>{
            const characters =
                await this.getAll();

            const index =
                characters.findIndex(
                    c => c.id === id
                );
            if (index === -1) {
                return null;
            }
            const updatedCharacter = {
                ...characters[index],
                ...updates
            };
            characters[index] =
                updatedCharacter;
            await this.saveAll(characters);
            return updatedCharacter;
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
            const characters = await this.getAll();
            const index = characters.findIndex(
                character => character.id === id
            );
            if (index === -1) {
                return false;
            }
            characters.splice(index, 1);
            await this.saveAll(characters);
            return true;
        }catch (error){
            console.error('Failed to create character:', error);
            throw error;
        }
    }

}