export type Constructor<T = any> = new (...args: any[]) => T;

export interface ClassElement {
  kind: "field" | "method";
  key: PropertyKey;
  placement: "static" | "prototype" | "own";
  initializer?: (...args) => unknown;
  extras?: ClassElement[];
  finisher?: <T>(cls: Constructor<T>) => undefined | Constructor<T>;
  descriptor?: PropertyDescriptor;
}
