import GameMap from "./GameMap";
import { COLORS } from "./Constans";
import Delay from "./decorators/delay";
class Game {
    private previewBubbles: Array<string>;
    private previewEl: HTMLElement;
    private scoreEl: HTMLElement;
    private asideEl: HTMLElement;
    private startDate: number;
    private score: number = 0;
    private quantityOfBubblesInNewRound: number = 3;
    private map: GameMap;
    public isEnded: boolean = false;
    public readonly quantityToCrush: number = 5;

    constructor() {
        this.map = new GameMap(9, 9, this);
        this.previewBubbles = this.drawBubbleColors(this.quantityOfBubblesInNewRound);
        this.asideEl = document.createElement("div");
        this.asideEl.id = "aside";
        document.getElementById("app").appendChild(this.asideEl);
        this.startDate = new Date().getTime();
        this.initPreview();
        this.initScore();
        this.nextRound();
    }
    private initScore(): void {
        this.scoreEl = document.createElement("div");
        this.scoreEl.id = "score";
        this.scoreEl.innerHTML = `Points: ${this.score}`;
        document.getElementById("aside").appendChild(this.scoreEl);
    }
    private initPreview(): void {
        this.previewEl = document.createElement("div");
        this.previewEl.id = "preview";
        for (const color of this.previewBubbles) {
            const previewBubble = document.createElement("div");
            previewBubble.className = "preview-bubble";
            previewBubble.style.backgroundColor = color;
            this.previewEl.appendChild(previewBubble);
        }
        document.getElementById("aside").appendChild(this.previewEl);
    }
    private changePreviewBubbles(drawedColors: Array<string>): void {
        this.previewEl.innerHTML = "";
        const pEl = document.createElement("p");
        pEl.textContent = "Next bubbles:";
        this.previewEl.append(pEl);
        this.previewBubbles = drawedColors;
        for (let color of drawedColors) {
            const previewBubble = document.createElement("div");
            previewBubble.className = "preview-bubble";
            previewBubble.style.backgroundColor = color;
            this.previewEl.appendChild(previewBubble);
        }
    }
    private drawBubbleColors(quantity: number): Array<string> {
        const arrayOfColors: Array<string> = [];
        for (let i = 0; i < quantity; i++) {
            arrayOfColors.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }
        return arrayOfColors;
    }
    public nextRound(): void {
        let isCrushed = this.map.checkForCrushed();
        this.map.selectedBubble = null;
        if (!isCrushed) {
            this.map.generateBubble(this.previewBubbles);
            this.map.checkForCrushed();
            this.changePreviewBubbles(this.drawBubbleColors(this.quantityOfBubblesInNewRound));
        }
    }
    public endGame(): void {
        function msToHMS(duration: number): string {
            let milliseconds: number | string = duration % 1000;
            let seconds: number | string = Math.floor((duration / 1000) % 60);
            let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60);
            let hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
        }
        this.isEnded = true;
        const time = new Date().getTime() - this.startDate;
        alert(`Game over \nPoints: ${this.score} \nTime: ${msToHMS(time)}`);
    }
    public increaseScore(): void {
        this.score += 1;
        this.scoreEl.innerHTML = `Points: ${this.score}`;
    }
}
export default Game;
