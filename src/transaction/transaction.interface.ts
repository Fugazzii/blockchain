import { Node } from "../blockchain";

export interface TransactionInterface {
    calculateHash(): string;
    isValid(): boolean;

    getAmount(): number;
    getFromAddr(): Node;
    getToAddr(): Node;
}