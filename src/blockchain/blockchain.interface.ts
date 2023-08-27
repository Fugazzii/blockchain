import { Server as WebSocketServer } from "ws";
import { TransactionInterface } from "../transaction";
import { BlockInterface } from "../block/block.interface";

export interface Node {
    nodeToBalance: Map<Node, number>;
    transactionsHistory: Array<TransactionInterface>;
    chain: Array<BlockInterface>;
    addresses: Array<string>;

    server: WebSocketServer;

    start(): void;
    addNode(addr: string): void;
    addTransaction(tx: TransactionInterface): void;
}
