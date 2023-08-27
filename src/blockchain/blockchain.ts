import { IncomingMessage } from "http";
import WebSocket, { Server as WebSocketServer } from "ws";
import { TransactionInterface } from "../transaction";
import { Node } from "./blockchain.interface";
import { Block, BlockInterface } from "../block";

export class Blockchain implements Node {
    public nodeToBalance: Map<Node, number>;
    public transactionsHistory: Array<TransactionInterface>;
    public chain: Array<BlockInterface>;
    public server: WebSocketServer;
    public addresses: Array<string>;

    public constructor() {
        this.nodeToBalance = new Map<Node, number>();
        this.transactionsHistory = new Array<TransactionInterface>();
        this.chain = new Array<BlockInterface>();
        this.addresses = new Array<string>();

        this.server = new WebSocketServer({ port: 3333 });
    }

    public start() {
        while(true) {
            this.mine();
        }
    }
    public addNode(addr: string): void {}
    public addTransaction(tx: TransactionInterface): void {}

    private mine() {
        const next = new Block(Date.now(), []);
        next.mineBlock(2);
        this.chain.push(next);

        for(let addr of this.addresses) {
            const client = new WebSocket(addr);
            client.emit("block_mined", next);
        }
    }
 
    private listen() {
        this.server.on("connection", (data: IncomingMessage) => {

        });

        // on block_mine
        // on new_transaction
        // on new_user
    }
}