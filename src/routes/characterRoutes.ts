import { Router } from "express";
import {
    getCharacters,
    getOneCharacter,
    createCharacter,
    deleteCharacter,
    updateCharacter,
    changeHpOfCharacter
} from "../controllers/characterController.js";

const router = Router();

router.get("/", getCharacters);
router.get("/:id", getOneCharacter);
router.post("/", createCharacter);
router.delete("/:id", deleteCharacter);
router.patch("/:id", updateCharacter)
router.patch("/damage/:id", changeHpOfCharacter)
export default router;