function isOfType<T>(test: T, prop: keyof T): test is T {
  return (test as T)[prop] !== undefined;
}
function isObject(obj: unknown): obj is object {
  return obj !== null && typeof obj === "object";
}
export { isOfType, isObject };
