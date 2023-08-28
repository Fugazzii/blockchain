import dgram from "node:dgram";

export interface NodeServerInterface {
    broadcast(addrs: Array<string>): void;
    listen(): void;
}

export class NodeServer implements NodeServerInterface{
    
    private readonly server: dgram.Socket;

    public constructor() {
        this.server = dgram.createSocket("udp4", (msg: Buffer, rinfo: dgram.RemoteInfo) => undefined);
    }

    public broadcast(addrs: Array<string>): void {
        
    }

    public listen(): void {
        this.server.on("new_node", () => {
            
        })
    }
}