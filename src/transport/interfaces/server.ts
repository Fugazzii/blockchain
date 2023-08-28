export interface NodeServerInterface {
    on(eventName: string, cb: (...args: any) => any): void;
}