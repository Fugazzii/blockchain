import { Block } from "../block/block.interface";

class Blockchain {

    private readonly chain: Array<Block>;

    public constructor() {
        this.chain = new Array<Block>();
    }

    private createGenesisBlock() {
        return null;
    }
}