import { EventEmitter } from "node:events";
import { log } from "node:console";
import { NetworkInterfaceInfo, networkInterfaces } from "node:os";

import { TransactionInterface } from "../transaction";
import { Node } from "./blockchain.interface";
import { Block, BlockInterface } from "../block";

export class Blockchain implements Node {

    public addr: string;
    public nodeToBalance: Map<Node, number>;
    public transactionsHistory: Array<TransactionInterface>;
    private pendingTransactions: Array<TransactionInterface>;

    public chain: Array<BlockInterface>;
    public addresses: Array<string>;
    private emitter: EventEmitter;

    public constructor() {
        this.nodeToBalance = new Map<Node, number>();

        this.transactionsHistory = new Array<TransactionInterface>();
        this.pendingTransactions = new Array<TransactionInterface>();

        this.chain = this.genesisBlock();
        this.addresses = new Array<string>();
        this.emitter = new EventEmitter();
        
        this.addr = this.getIpAddr();
    }

    public start() {
        this.listen();

        // while(true) {
        //     this.mine();
        // }
    }

    public addNode(node: Node): void {
        this.emitter.emit("new_node", node);
    }

    public addTransaction(tx: TransactionInterface): void {
        this.emitter.emit("new_transaction", tx);
    }

    private listen() {
        this.emitter.on("block_mined", (block: BlockInterface) => {
            log(`New block: ${block}`);
        });

        this.emitter.on("new_transaction", (tx: TransactionInterface) => this.handleNewTransaction(tx));

        this.emitter.on("new_node", (node: Node) => this.handleNewNode(node));
    }

    private mine() {
        const next = new Block(Date.now(), this.pendingTransactions, this.latestBlock.getHash());
        next.mineBlock(5);
        this.chain.push(next);
        this.emitter.emit("block_mined", next);
    }

    private handleNewTransaction(tx: TransactionInterface) {
        this.transactionsHistory.push(tx);
        log(`New Transaction: ${tx}`);
    }

    private handleNewNode(node: Node) {
        this.nodeToBalance.set(node, 0);
        log(`${node.addr} has been added to chain`);
    }

    private genesisBlock() {
        const genesis = new Block(Date.now(), [], "0");
        return new Array<BlockInterface>(genesis); 
    }

    private get latestBlock() { return this.chain[this.chain.length - 1]; }

    private getIpAddr() {
        const result = networkInterfaces().wlp2s0 as Array<NetworkInterfaceInfo>;
        return result[0].address;
    }
}