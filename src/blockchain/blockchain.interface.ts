export interface Blockchain {
    run(): Promise<void>;
}