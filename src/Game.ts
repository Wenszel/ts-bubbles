import GameMap from "./GameMap";
import { COLORS } from "./Constans";
class Game {
    previewBubbles: Array<string>;
    previewEl: HTMLElement;
    map: GameMap;
    constructor() {
        this.map = new GameMap(9, 9, this);
        this.previewBubbles = this.drawBubbleColors(3);
        this.initPreview();
        this.nextRound();
    }
    initPreview() {
        this.previewEl = document.createElement("div");
        this.previewEl.id = "preview";
        for (let color of this.previewBubbles) {
            const previewBubble = document.createElement("div");
            previewBubble.className = "preview-bubble";
            previewBubble.style.backgroundColor = color;
            this.previewEl.appendChild(previewBubble);
        }
        document.getElementById("app").appendChild(this.previewEl);
    }
    changePreviewBubbles(drawedColors: Array<string>) {
        this.previewEl.innerHTML = "";
        this.previewBubbles = drawedColors;
        for (let color of drawedColors) {
            const previewBubble = document.createElement("div");
            previewBubble.className = "preview-bubble";
            previewBubble.style.backgroundColor = color;
            this.previewEl.appendChild(previewBubble);
        }
    }
    drawBubbleColors(quantity: number): Array<string> {
        const arrayOfColors: Array<string> = [];
        for (let i = 0; i < quantity; i++) {
            arrayOfColors.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }
        return arrayOfColors;
    }
    nextRound() {
        this.map.selectedBubble = null;
        this.map.generateBubble(this.previewBubbles);
        this.changePreviewBubbles(this.drawBubbleColors(3));
    }
}
export default Game;
