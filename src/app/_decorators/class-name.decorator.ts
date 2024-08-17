export function ClassName(name: string) {
    return function (constructor: Function) {
      constructor.prototype.className = name;
    };
}