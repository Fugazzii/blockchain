import { EllipticCurve } from "./ec.interface";
import { ec as elliptic } from "elliptic";

export class Secp256k1 implements EllipticCurve {
    
    private ec: elliptic;

    public constructor() {
        this.ec = new elliptic("secp256k1");
    }

    public keyFromPublic(pk: string) {
        return this.ec.keyFromPublic(pk);
    }

    public generateKeyPair() {
        const keyPair = this.ec.genKeyPair();
        const publicKey = keyPair.getPublic('hex');
        const privateKey = keyPair.getPrivate('hex');
        return { publicKey, privateKey };
    }

    public sign(data: string, privateKey: string) {
        const key = this.ec.keyFromPrivate(privateKey, 'hex');
        const signature = key.sign(data);
        return signature.toDER('hex');
    }
    
    public verify(data: string, signature: string, publicKey: string) {
        const key = this.ec.keyFromPublic(publicKey, 'hex');
        return key.verify(data, signature);
    }
    
}