import crypto from "node:crypto";
import { TransactionInterface } from "../transaction";
import { BlockInterface } from "./block.interface";

export class Block implements BlockInterface {
    
    private hash: string;
    private nonce: number;
    
    public constructor(
        private timestamp: number,
        private transactions: Array<TransactionInterface>,
        private prevHash: string = ""
    ) {
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    public mineBlock(diff: number) {
        while (this.hash.substring(0, diff) !== Array(diff + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
      
        console.log(`Block mined: ${this.hash}`);
    }

    private calculateHash(): string {
        return crypto
            .createHash("sha256")
            .update(
                this.prevHash + 
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce
            )
            .digest("hex");
    }

    public getHash() { return this.hash; }
    public getNonce() { return this.nonce };


}