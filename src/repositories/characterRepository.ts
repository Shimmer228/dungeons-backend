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
    public static async findById(id:string):Promise<Character|undefined>{

            const characters = await this.getAll();
            return characters.find((c) => c.id === id);
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

}