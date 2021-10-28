export default function (target: any, name: string, descriptor: any) {
    const originalMethod = descriptor.value;
    const performanceEl = document.createElement("div");
    performanceEl.id = "performance";
    document.getElementById("app").append(performanceEl);
    descriptor.value = function (...args: any[]) {
        const start = new Date().getTime();
        var result = originalMethod.apply(this, args);
        const end = new Date().getTime();
        const time = end - start;
        performanceEl.innerHTML += `Time: 0.00${time}s <br/>`;
        performanceEl.scrollTop = performanceEl.scrollHeight;
        return result;
    };
}
