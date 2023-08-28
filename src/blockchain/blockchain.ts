import { EventEmitter } from "node:events";

import { TransactionInterface } from "../transaction";
import { Node } from "./blockchain.interface";
import { Block, BlockInterface } from "../block";

export class Blockchain implements Node {
    public nodeToBalance: Map<Node, number>;
    public transactionsHistory: Array<TransactionInterface>;
    public chain: Array<BlockInterface>;
    public addresses: Array<string>;
    private emitter: EventEmitter;

    public constructor() {
        this.nodeToBalance = new Map<Node, number>();
        this.transactionsHistory = new Array<TransactionInterface>();
        this.chain = new Array<BlockInterface>();
        this.addresses = new Array<string>();
        this.emitter = new EventEmitter();
    }

    public start() {
        this.listen();

        // while(true) {
        //     this.mine();
        // }
    }

    public addNode(addr: string): void {
        this.emitter.emit("new_node", addr);
    }

    public addTransaction(tx: TransactionInterface): void {
        this.emitter.emit("new_transaction", tx);
    }

    private mine() {
        const next = new Block(Date.now(), []);
        next.mineBlock(5);
        this.chain.push(next);

        this.emitter.emit("block_mined", next);
    }
 
    private listen() {
        this.emitter.on("block_mined", (block: BlockInterface) => {
            console.log(`New block: ${block}`);
        });

        this.emitter.on("new_transaction", (tx: TransactionInterface) => {
            console.log(`New Transaction: ${tx}`);
        });

        this.emitter.on("new_node", (addr: string) => {
            console.log(`${addr} has been added to chain`);
        });
    }
}