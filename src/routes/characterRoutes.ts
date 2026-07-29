import { Router } from "express";
import { getAllCharacters, getOneCharacter, createCharacter, deleteCharacter } from "../controllers/characterController";

const router = Router();

router.get("/", getAllCharacters);
router.get("/:id", getOneCharacter);
router.post("/", createCharacter);
router.delete("/:id", deleteCharacter);
export default router;