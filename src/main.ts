import "./style.css";
import "./drawing";
import { saveCanvas } from "./drawing";
import { addDrawingToSaved } from "./savedBoards";
import { registerServiceWorker } from "./serviceWorkerRegistration";
import { nanoid } from "nanoid";

registerServiceWorker();

const saveButton = document.querySelector("button.save-button")!;

saveButton.addEventListener("click", async () => {
    const blob = await saveCanvas();
    const boardId = nanoid(16);
    const url = `/drawings/${boardId}.png`;

    const cache = await caches.open("saved-boards");
    const response = new Response(blob, {
        headers: {
            "Content-Type": "image/png",
        },
    });
    await cache.put(url, response);

    const localStorageBoards = localStorage.getItem('saved-boards')
    const savedBoards: string[] = localStorageBoards ? JSON.parse(localStorageBoards) : []

    savedBoards.push(url)
    localStorage.setItem('saved-boards', JSON.stringify(savedBoards))

    addDrawingToSaved(url);
});

function loadSavedBoardsFromStorage () {
    const localStorageSavedBoards = localStorage.getItem('saved-boards')
    if (localStorageSavedBoards) {
        const savedBoards = JSON.parse(localStorageSavedBoards) as string[]
        for (const board of savedBoards) {
            addDrawingToSaved(board)
        }
    }
}

loadSavedBoardsFromStorage()