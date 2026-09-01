import { randomUUID } from "crypto";
// import {characters} from "../data/characters.js";
import type { Character } from "../models/character.js";
import type {CharacterFilters} from "../dto/filters.js";
import {CharacterRepository} from "../repositories/characterRepository.js";
import { CharacterSchema } from "../schemas/characterSchema.js";

export class CharacterService {

    static async getAll(filters: CharacterFilters): Promise<Character[]> {
            const characters = await CharacterRepository.getAll();
            const result = characters.filter((character) => {

                if (
                    filters.class &&
                    character.class !== filters.class
                ) {
                    return false;
                }
                console.log(character);
                if (
                    filters.race &&
                    character.race !== filters.race
                ) {
                    return false;
                }

                if (
                    filters.level !== undefined &&
                    character.level !== filters.level
                ) {
                    return false;
                }

                return true;
            });

            if (filters.sort) {
                const isDesc = filters.sort.startsWith("-");
                const field = isDesc
                    ? filters.sort.slice(1)
                    : filters.sort;

                const validFields: (keyof Character)[] = [
                    "name",
                    "level",
                    "class",
                    "race",
                    "id"
                ];

                if (validFields.includes(field as keyof Character)) {
                    result.sort((a, b) => {

                        const valueA = a[field as keyof Character];
                        const valueB = b[field as keyof Character];

                        if (
                            typeof valueA === "string" &&
                            typeof valueB === "string"
                        ) {
                            return isDesc
                                ? valueB.localeCompare(valueA)
                                : valueA.localeCompare(valueB);
                        }

                        if (
                            typeof valueA === "number" &&
                            typeof valueB === "number"
                        ) {
                            return isDesc
                                ? valueB - valueA
                                : valueA - valueB;
                        }

                        return 0;
                    });
                }
            }
        console.log(result);
            return result;
        }


    static async findById(id: string):Promise<Character|undefined> {
        const characters = await CharacterRepository.getAll();
        return characters.find(
            character => character.id === id
        );
    }
    private static findInArray(characters: Character[], id: string): Character | undefined {
        return characters.find(character => character.id === id);
    }


    static async create(
        newCharacterData: Omit<Character, "id">
    ):Promise<Character|undefined> {

        const newCharacter : Character = {
            ...newCharacterData,
            id:randomUUID(),
        }
        return await CharacterRepository.create(newCharacter);
    }

    static async delete(id: string):Promise<boolean> {

        return await CharacterRepository.delete(id);
    }

    static async update(
        id: string,
        updates: Partial<Omit<Character, "id">>
    ):Promise<Character|null> {

        const character = await CharacterRepository.update(id, updates);
        console.log(character);
        return character;
    }

    static async changeHP(id: string, amount: number): Promise<Character | null> {
        console.log(id, amount);
        const characters = await CharacterRepository.getAll();
        const character = this.findInArray(characters, id);
        if(!character) {
            return null;
        }
        const newHp = amount<0 ? Math.max(0, character.hp + amount) : Math.min(character.maxHp, character.hp+amount);
        return this.update(id, { hp: newHp });
    }

}