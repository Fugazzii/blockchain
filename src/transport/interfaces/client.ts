import { BlockInterface } from "../../block";
import { TransactionInterface } from "../../transaction";

export interface NodeClientInterface {
    broadcast(addrs: Array<string>, data: TransactionInterface | BlockInterface | string): void;
}