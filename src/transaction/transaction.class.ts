import crypto from "node:crypto";
import { EllipticCurve } from "../ec";

export class Transaction {

    private readonly timestamp: number;
    private signature: any;

    public constructor(
        private readonly fromAddr: string,
        private readonly toAddr: string,
        private readonly amount: number,
        private readonly elliptic: EllipticCurve
    ) {
        this.timestamp = Date.now();
    }

    public calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.fromAddr + this.toAddr + this.amount + this.timestamp)
            .digest('hex');
    }

    public sign(key: any) {
        if(key.getPublic("hex") !== this.fromAddr) {
            throw new Error("You cannot sign transactions for other wallets!")
        }

        const hashTx = this.calculateHash();
        const sig = key.sign(hashTx, "base64");

        this.signature = sig.toDER("hex");
    }

    public isValid(): boolean {
        if (this.fromAddr === null) return true;

        if (!this.signature || this.signature.length === 0) {
        throw new Error('No signature in this transaction');
        }

        const publicKey = this.elliptic.keyFromPublic(this.fromAddr);
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}