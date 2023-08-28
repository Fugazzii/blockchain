import { ec } from "elliptic";

export type keyPair = { publicKey: string; privateKey: string };

export interface EllipticCurve {
    keyFromPublic(pk: string): ec.KeyPair;
    generateKeyPair(): keyPair;
    sign(data: string, privateKey: string): string;
    verify(data: string, signature: string, publicKey: string): boolean;
}