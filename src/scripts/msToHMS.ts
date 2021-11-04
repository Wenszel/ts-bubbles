export default function msToHMS(ms: number): string {
    let milliseconds: number | string = ms % 1000;
    let seconds: number | string = Math.floor((ms / 1000) % 60);
    let minutes: number | string = Math.floor((ms / (1000 * 60)) % 60);
    let hours: number | string = Math.floor((ms / (1000 * 60 * 60)) % 24);
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
