export interface TransactionInterface {
    calculateHash(): string;
    sign(key: string): void;
    isValid(): boolean;

    getAmount(): number;
    getFromAddr(): string;
    getToAddr(): string;
}