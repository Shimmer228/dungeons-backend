import { randomUUID } from "crypto";
// import {characters} from "../data/characters.js";
import type { Character } from "../models/character.js";
import type {CharacterFilters} from "../dto/filters.js";
import {CharacterRepository} from "../repositories/characterRepository.js";


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

    public static async saveAll(characters: Character[]): Promise<void> {
        await CharacterRepository.saveAll(characters);
    }

    static async create(
        newCharacter: Character
    ):Promise<Character|undefined> {
        const characters = await CharacterRepository.getAll();
        console.log(characters);
        if (!newCharacter.id) {
            newCharacter.id = randomUUID();
        }
        if (characters.some(c => c.id === newCharacter.id)) {
            throw new Error(`Character with ID ${newCharacter.id} already exists.`);
        }

        characters.push(newCharacter);
        await CharacterRepository.saveAll(characters);
        return newCharacter;
    }

    static async delete(id: string):Promise<boolean> {
        const characters = await CharacterRepository.getAll();
        const index = characters.findIndex(
            character => character.id === id
        );

        if (index === -1) {
            return false;
        }

        characters.splice(index, 1);

        return true;
    }

    static async update(
        id: string,
        updates: Partial<Omit<Character, "id">>
    ):Promise<Character|null> {
        const character = await this.findById(id);

        if (!character) {
            return null;
        }

        Object.assign(character, updates);

        return character;
    }

    static async damage(id: string, damage: number): Promise<Character | null> {
        const character = await this.findById(id);
        if (!character) {
            return null;
        }
        const newHp = Math.max(0, character.hp - damage);
        return this.update(id, { hp: newHp });
    }
}