import "./style.css";
import "./drawing";
import { registerServiceWorker } from "./serviceWorkerRegistration";
import { saveCanvas } from "./drawing";
import { addDrawingToSaved } from "./savedBoards";

registerServiceWorker();

const saveButton = document.querySelector("button.save-button")!

saveButton.addEventListener("click", async () => {
    const blob = await saveCanvas()
    const url = URL.createObjectURL(blob)
    addDrawingToSaved(url)
});
