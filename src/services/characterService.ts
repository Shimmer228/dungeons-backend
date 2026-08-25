import { randomUUID } from "crypto";
import {characters} from "../data/characters.js";
import type { Character } from "../models/character.js";
import type {CharacterFilters} from "../dto/filters.js";

export class CharacterService {

    static getAll(filters: CharacterFilters) {
            const result = characters.filter((character) => {

                if (
                    filters.class &&
                    character.class !== filters.class
                ) {
                    return false;
                }
                console.log(filters);
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

            return result;
        }


    static findById(id: string) {
        return characters.find(
            character => character.id === id
        );
    }

    static create(
        data: Omit<Character, "id">
    ) {
        const newCharacter: Character = {
            id: randomUUID(),
            ...data,
        };

        characters.push(newCharacter);

        return newCharacter;
    }

    static delete(id: string) {
        const index = characters.findIndex(
            character => character.id === id
        );

        if (index === -1) {
            return false;
        }

        characters.splice(index, 1);

        return true;
    }

    static update(
        id: string,
        updates: Partial<Omit<Character, "id">>
    ) {
        const character = this.findById(id);

        if (!character) {
            return null;
        }

        Object.assign(character, updates);

        return character;
    }
}