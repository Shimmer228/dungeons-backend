import { Router } from "express";
import { getCharacters, getOneCharacter, createCharacter, deleteCharacter, updateCharacter } from "../controllers/characterController.js";

const router = Router();

router.get("/", getCharacters);
router.get("/:id", getOneCharacter);
router.post("/", createCharacter);
router.delete("/:id", deleteCharacter);
router.patch("/:id", updateCharacter)
export default router;