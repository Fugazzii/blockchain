import { TransactionInterface } from "../transaction";
import { BlockInterface } from "../block/block.interface";

export interface Node {

    /* Information about single (me) node */
    addr: string;
    balance: number;

    /* Information about other nodes in the chain */
    nodeToBalance: Map<Node, number>;
    transactionsHistory: Array<TransactionInterface>;
    chain: Array<BlockInterface>;
    addresses: Array<string>;

    start(): void;
    addNode(addr: Node): void;
    addTransaction(tx: TransactionInterface): void;
}
