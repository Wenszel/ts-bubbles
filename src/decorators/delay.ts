export default function delay(delay: number) {
    return function (target: any, name: string, descriptor: any) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            setTimeout(() => {
                var result = originalMethod.apply(this, args);
                return result;
            }, delay);
        };
    };
}
