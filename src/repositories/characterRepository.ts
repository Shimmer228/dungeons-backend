import {Character} from "../models/character.js";
import {
    readFile,
    writeFile
} from "fs/promises";
import {CharacterSchema} from "../schemas/characterSchema.js";
import {z} from "zod";
import {CharacterCreationSchema} from "../dto/characterCreationSchema.js";

export class CharacterRepository {
    private static filePath = './src/data/characters.json';

    public static async getAll(): Promise<Character[]> {
        try {

            const data = await readFile(this.filePath, 'utf-8');
            const characters: Character[] = JSON.parse(data);
            return characters;
        } catch (error) {
            console.error('Failed to load characters:', error);
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
}