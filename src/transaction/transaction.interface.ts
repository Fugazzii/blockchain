export interface Transaction {
    calculateHash(): string;
    sign(key: string): void;
    isValid(): boolean;
}