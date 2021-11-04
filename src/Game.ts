import GameMap from "./GameMap";
import msToHMS from "./scripts/msToHMS";
import { COLORS } from "./Constans";
/** Main class of app responsible for creating entire game */
export default class Game {
    private map: GameMap;
    /** Array of current preview colors */
    private previewBubbles: Array<string>;
    private previewEl: HTMLElement = document.getElementById("preview");
    private scoreEl: HTMLElement = document.getElementById("score");
    /** Stores points which are equivalent to the number of bubbles being crushed */
    private score: number = 0;
    /** Stores date when the game started */
    private readonly startDate: number = new Date().getTime();
    /** Such number of bubbles are added to the map every round*/
    public readonly quantityOfBubblesInNewRound: number = 3;
    /** Such number of bubbles have to be in a row to be crushed */
    public readonly quantityToCrush: number = 5;
    /** Is game ended (no move can be done) */
    public isEnded: boolean = false;

    constructor() {
        this.map = new GameMap(9, 9, this);
        this.updatePreviewEl();
        this.nextRound();
    }
    /** Function responsible for updating previewEl with new bubbles */
    private updatePreviewEl(): void {
        this.previewEl.innerHTML = "";
        this.previewBubbles = this.drawBubbleColors();
        for (let color of this.previewBubbles) {
            const previewBubble = document.createElement("div");
            previewBubble.className = "preview-bubble";
            previewBubble.style.backgroundColor = color;
            this.previewEl.append(previewBubble);
        }
    }
    /**
     * Function responsible for updating scoreEl with new score
     * executed every time the bubbles is beaten
     */
    public updateScoreEl(): void {
        this.score += 1;
        this.scoreEl.innerHTML = `Points: ${this.score}`;
    }
    /**
     * Draw colors for next previewEl update
     * @returns array of colors
     */
    private drawBubbleColors(): Array<string> {
        const arrayOfColors: Array<string> = [];
        for (let i = 0; i < this.quantityOfBubblesInNewRound; i++) {
            arrayOfColors.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }
        return arrayOfColors;
    }
    /** Executed when player makes a move */
    public nextRound(): void {
        this.map.selectedBubble = null;
        /**
         * Checks if the move hasn't ended with crushing bubbles
         * if no player has another move before adding new bubbles to map
         */
        if (!this.map.checkForCrushed()) {
            this.map.generateBubbles(this.previewBubbles);
            this.updatePreviewEl();
        }
    }
    /** Executed when all nodes are full */
    public gameOver(): void {
        this.isEnded = true;
        const time = new Date().getTime() - this.startDate;
        alert(`Game over \nPoints: ${this.score} \nTime: ${msToHMS(time)}`);
    }
}
