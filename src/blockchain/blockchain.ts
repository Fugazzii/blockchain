import { EventEmitter } from "node:events";
import { log } from "node:console";
import { NetworkInterfaceInfo, networkInterfaces } from "node:os";

import { TransactionInterface } from "../transaction";
import { Node } from "./blockchain.interface";
import { Block, BlockInterface } from "../block";
import { EllipticCurve, Secp256k1, keyPair } from "../ec";
import { NodeClientInterface, NodeServerInterface } from "../transport";

export class Blockchain implements Node {

    /** Information about current (me) node */
    
    /*
        * Keypair of the current node
        * We need this to sign transactions
    */
    private keypair: keyPair;
    
    /*
        * Ip address of the node
        * Without public ip address, it would be impossible to establish communication between nodes 
    */
    public addr: string;
    
    /* 
        * Balance of the current node
    */
    public balance: number;


    /** Information about other nodes in the chain */

    /*
        * Map to quickly retreive balance of a node
        * <publicKey, balance>
    */
    public nodeToBalance: Map<string, number>;

    /*
        * All performed transactions in the blockchain
        * Usage of this array to save history of the transactions
    */
    public transactionsHistory: Array<TransactionInterface>; 
    
    /* 
        * Currently pending transactions
        * We need this to pack transactions in the single block after block will be mined
    */
    private pendingTransactions: Array<TransactionInterface>;

    /*
        * Actual blockchain data structure
        * Every block is saved here
    */
    public chain: Array<BlockInterface>;

    /*
        * All public ip addresses that are in the chain
        * For gossiping we need to have ip address of all node in the chain
        * Event broadcasting is just sending data to all of the address
    */
    public addresses: Array<string>;

    /*
        * Event emitter to handle event-driven architecture
    */
    private readonly emitter: EventEmitter;

    /** 
     * @param elliptic 
        * We need some elliptic curve to handle cryptography
        * Let's use **secp256k1** as it is used in Bitcoin
     * @returns Blockchain 
     */
    public constructor(
        private readonly server: NodeServerInterface,
        private readonly client: NodeClientInterface,
        private readonly elliptic: EllipticCurve = new Secp256k1()
    ) {
        this.nodeToBalance = new Map<string, number>();
        this.transactionsHistory = new Array<TransactionInterface>();
        this.pendingTransactions = new Array<TransactionInterface>();
        this.chain = this.genesisBlock();
        this.addresses = new Array<string>();
        this.emitter = new EventEmitter();
        
        this.addr = this.getIpAddr();
        this.balance = 0;

        this.keypair = this.elliptic.generateKeyPair();
    }

    public start() {
        this.listen();

        while(true) {
            this.mine();
        }
    }

    public addNode(node: Node): void {
        this.emitter.emit("new_node", node);
    }

    public addTransaction(tx: TransactionInterface): void {
        this.emitter.emit("new_transaction", tx);
    }
    
    private mine() {
        const next = new Block(Date.now(), this.pendingTransactions, this.latestBlock.getHash());
        next.mineBlock(5);

        this.emitter.emit("block_mined", next);
    }

    private listen() {
        this.emitter.on("block_mined",  this.handleNewBlock.bind(this));
        this.emitter.on("new_transaction", this.handleNewTransaction.bind(this));
        this.emitter.on("new_node", this.handleNewNode.bind(this));

        this.server.on("block_mined", this.handleNewBlock.bind(this));
        this.server.on("new_transaction", this.handleNewTransaction.bind(this));
        this.server.on("new_node", this.handleNewNode.bind(this));
    }

    /** HANDLERS */

    private handleNewBlock(block: BlockInterface) {
        this.chain.push(block);
        this.client.broadcast(this.addresses, block);
    }

    private handleNewTransaction(tx: TransactionInterface) {
    
        if(!tx.isValid()) throw new Error("Invalid transaction");

        const from = tx.getFromAddr();
        const amount = tx.getAmount();

        if(!this.hasSufficientBalance(from.addr, amount)) throw new Error("Insufficient balance");

        this.transactionsHistory.push(tx);

        this.client.broadcast(this.addresses, tx);

        log(`New Transaction: ${tx}`);
    }

    private handleNewNode(node: Node) {
        this.nodeToBalance.set(node.publicKey, 0);
        log(`${node.addr} has been added to chain`);
    }

    /** HELPERS */

    /**
     * 
     * @param address string
     * @param amount number
     * @returns boolean
     */
    private hasSufficientBalance(address: string, amount: number) {
        
        let currentBalance = this.nodeToBalance.get(address) as number;
        let futureBalance = currentBalance - amount;
        
        /*
            If amount is already more than balance,
            we no longer need to loop through the pending transactions
        */
        if(futureBalance >= 0) throw new Error("Insufficient balance");

        /*
            Make sure that we include pending transactions in the user balance
        */
        for(let tx of this.pendingTransactions) {
            if(tx.getFromAddr().addr === address) {
                futureBalance += tx.getAmount();
            }
            if(tx.getToAddr().addr === address) {
                futureBalance -= tx.getAmount();
            }
        }

        return futureBalance >= 0;
    }


    /**
     * @returns Array with genesis block
     */
    private genesisBlock(): Array<BlockInterface> {
        const genesis = new Block(Date.now(), [], "0");
        return new Array<BlockInterface>(genesis); 
    }

    /**
     * @returns Ip address of the current node
    */
    private getIpAddr() {
        const result = networkInterfaces().wlp2s0 as Array<NetworkInterfaceInfo>;
        return result[0].address;
    }

    /**
     * Retreive public key
     * @returns string
    */
    public get publicKey() {
        return this.keypair.publicKey;
    }

    /**
     * @returns BlockInterface
     */
    private get latestBlock() { return this.chain[this.chain.length - 1]; }
}