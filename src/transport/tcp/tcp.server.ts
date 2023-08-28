import net from "node:net";
import { NodeServerInterface } from "../interfaces";

export class TcpServer implements NodeServerInterface {
    
    private readonly server: net.Server;

    public constructor() {
        this.server = net.createServer();
    }
    
    public on(eventName: string, cb: (...args: any) => any): void {
        this.server.on(eventName, cb);
    }

    public emit(eventName: string, ...args: any): any {
        this.server.emit(eventName, ...args);
    }

    public listen(port: number) {
        this.server.listen(port);
    }

}