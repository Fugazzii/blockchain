export interface BlockInterface {
    mineBlock(diff: number): void;
    getNonce(): number;
    getHash(): string;
}