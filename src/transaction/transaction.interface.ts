export interface TransactionInterface {
    calculateHash(): string;
    sign(key: string): void;
    isValid(): boolean;
}