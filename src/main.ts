import "./style.css";
import "./drawing";
import { saveCanvas } from "./drawing";
import { addDrawingToSaved } from "./savedBoards";
import { registerServiceWorker } from "./serviceWorkerRegistration";

registerServiceWorker()

const saveButton = document.querySelector("button.save-button")!

saveButton.addEventListener("click", async () => {
    const blob = await saveCanvas()
    const url = URL.createObjectURL(blob)
    addDrawingToSaved(url)
});
