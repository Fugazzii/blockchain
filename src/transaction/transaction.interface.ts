import { Node } from "../blockchain";

export interface TransactionInterface {
    calculateHash(): string;
    isValid(): boolean;
    sign(sk: string): void;

    getAmount(): number;
    getFromAddr(): Node;
    getToAddr(): Node;
}