import { Router } from "express";
import { getCharacters, getOneCharacter, createCharacter, deleteCharacter, changeCharacter } from "../controllers/characterController";

const router = Router();

router.get("/", getCharacters);
router.get("/:id", getOneCharacter);
router.post("/", createCharacter);
router.delete("/:id", deleteCharacter);
router.patch("/:id", changeCharacter)
export default router;