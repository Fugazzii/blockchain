export interface NodeServerInterface {
    on(eventName: string, cb: (...args: any) => any): void;
    emit(eventName: string, ...args: any): any;
    listen(port: number): void;
}