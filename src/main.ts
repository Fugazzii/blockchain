import { Blockchain } from "./blockchain";
import { Secp256k1 } from "./ec";
import { Transaction } from "./transaction";

const elliptic = new Secp256k1();

const teslCoin = new Blockchain(elliptic);

teslCoin.addNode("ilia");
teslCoin.addNode("sandro");

teslCoin.addTransactions(new Transaction("ilia", "sandro", 100, elliptic));

teslCoin.minePendingTransactions("ilia");

teslCoin.run();

