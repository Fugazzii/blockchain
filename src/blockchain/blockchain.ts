import { BlockInterface, Block } from "../block";
import { TransactionInterface, Transaction } from "../transaction";
import { EllipticCurve, Secp256k1 } from "../ec";

export class Blockchain {

    private readonly addressToBalance: Map<string, number>;

    private readonly chain: Array<BlockInterface>;
    
    private pendingTransactions: Array<TransactionInterface>;
    private miningReward: number;
    private difficulty: number;

    public constructor(
        private readonly ellipticCurve: EllipticCurve = new Secp256k1()
    ) {
        this.addressToBalance = new Map<string, number>();
        this.chain = new Array<BlockInterface>();
        this.pendingTransactions = new Array<TransactionInterface>();
        this.miningReward = 100;
        this.difficulty = 2;
    }

    public run() {
        this.createGenesisBlock();
    }

    private createGenesisBlock() {
        const rn = Date.now();
        return new Block(rn, [], "0");
    }

    public addNode(addr: string) {
        this.addressToBalance.set(addr, 0);
    }

    public minePendingTransactions(rewardAddr: string) {
        const rewardTx = new Transaction(
            "",
            rewardAddr,
            this.miningReward,
            this.ellipticCurve
        );
        this.pendingTransactions.push(rewardTx);
    
        const block = new Block(Date.now(), this.pendingTransactions, this.latestBlock.getHash());
        
        block.mineBlock(this.difficulty);
    
        console.log('Block successfully mined!');
        
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    public addTransactions(transaction: TransactionInterface) {

        if(transaction.getAmount() <= 0) throw new Error("Invalid amount");

        const pendingTxsForWallet: Array<TransactionInterface> = this.pendingTransactions.filter(
            (tx: TransactionInterface) => tx.getFromAddr() === transaction.getFromAddr()
        );

        const walletBalance = this.addressToBalance.get(transaction.getFromAddr()) as number;

        if(pendingTxsForWallet.length > 0) {
            const totalPending = pendingTxsForWallet
                .map((tx: TransactionInterface) => tx.getAmount())
                .reduce((prev: number, curr: number) => prev + curr);
            
            const total = transaction.getAmount() + totalPending;
            
            if(total > walletBalance) throw new Error("Insufficient balance");
        }

        this.pendingTransactions.push(transaction);
        console.log("New transaction added");
    }

    private updateBalance() {
        for(let tx of this.pendingTransactions) {
            
            const from = tx.getFromAddr();
            const to = tx.getToAddr();
            const amount = tx.getAmount();

            const fromBalance = this.addressToBalance.get(from) as number;
            const toBalance = this.addressToBalance.get(to) as number;

            this.addressToBalance.set(from, fromBalance - amount);
            this.addressToBalance.set(to, toBalance + amount);
        }
    }

    private get latestBlock() { return this.chain[this.chain.length - 1]; }
}