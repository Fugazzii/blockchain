import net from "node:net";
import { NodeClientInterface } from "../interfaces";
import { BlockInterface } from "../../block";
import { TransactionInterface } from "../../transaction";

export class TcpClient implements NodeClientInterface {
    
    public constructor() {}

    public broadcast(addrs: Array<string>, data: string | TransactionInterface | BlockInterface): void {
        for(let addr of addrs) {
            const client = net.createConnection({
                host: addr,
                port: 3333
            });

            console.log("oee");
            client.write(data.toString());
        }
    }
    
}