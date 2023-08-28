import { Blockchain } from "./blockchain";
import { Node } from "./blockchain";

const teslCoin = new Blockchain();

const me: Node = new Blockchain();

teslCoin.start();

teslCoin.addNode(me);