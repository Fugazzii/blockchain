import crypto from "node:crypto";
import { EllipticCurve } from "../ec";
import { TransactionInterface } from "./";
import { Node } from "../blockchain";

export class Transaction implements TransactionInterface {  

    private readonly timestamp: number;
    private signature: string | null;

    public constructor(
        private readonly from: Node | null,
        private readonly to: Node,
        private readonly amount: number,
        private readonly elliptic: EllipticCurve
    ) {
        this.timestamp = Date.now();
        this.signature = null;
    }

    public calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.from?.addr + this.to.addr + this.amount + this.timestamp)
            .digest('hex');
    }

    public sign(sk: string) {
        if (this.from === null) {
            throw new Error('Cannot sign a coinbase transaction');
        }

        const hashToSign = this.calculateHash();
        const key = this.elliptic.keyFromPrivate(sk);

        this.signature = key.sign(hashToSign).toDER('hex');
    }

    public isValid(): boolean {
        if (this.from === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = this.elliptic.keyFromPublic(this.from.addr);
        return publicKey.verify(this.calculateHash(), this.signature);
    }

    public getAmount() { return this.amount; }
    public getFromAddr() { return this.from as Node; }
    public getToAddr() { return this.to; }
}