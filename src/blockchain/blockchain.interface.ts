import { TransactionInterface } from "../transaction";
import { BlockInterface } from "../block/block.interface";

export interface Node {
    addr: string;
    balance: number;

    nodeToBalance: Map<string, number>;
    transactionsHistory: Array<TransactionInterface>;
    chain: Array<BlockInterface>;
    addresses: Array<string>;

    start(): void;
    addNode(addr: Node): void;
    addTransaction(tx: TransactionInterface, sk: string): void;
    get publicKey(): string;

}
