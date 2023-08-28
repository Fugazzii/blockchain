import { Blockchain } from "./blockchain";

const teslCoin = new Blockchain();

teslCoin.start();

teslCoin.addNode("ilia");
teslCoin.addNode("sandro");