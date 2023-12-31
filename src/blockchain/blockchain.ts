import { EventEmitter } from "node:events";
import { log } from "node:console";
import { NetworkInterfaceInfo, networkInterfaces } from "node:os";

import { TransactionInterface } from "../transaction";
import { Node } from "./blockchain.interface";
import { Block, BlockInterface } from "../block";
import { EllipticCurve, Secp256k1, keyPair } from "../ec";
import { NodeClientInterface, NodeServerInterface } from "../transport";
import { BLOCKCHAIN_EVENT } from "./blockchian.events";

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
        * Difficulty coefficient for generating and finding next hash
    */
    public difficulty: number;

    /** 
     * @param listener
     * This is responsible for getting and listening data from another nodes
     * @param gossiper
     * This is responsible for announcing and broadcasting data up to other nodes
     * @param elliptic 
        * We need some elliptic curve to handle cryptography
        * Let's use **secp256k1** as it is used in Bitcoin
     * @returns Blockchain 
     */
    public constructor(
        private readonly listener: NodeServerInterface,
        private readonly gossiper: NodeClientInterface,
        private readonly elliptic: EllipticCurve = new Secp256k1()
    ) {
        this.nodeToBalance = new Map<string, number>();
        this.transactionsHistory = new Array<TransactionInterface>();
        this.pendingTransactions = new Array<TransactionInterface>();
        this.chain = this.genesisBlock();
        this.addresses = new Array<string>();
        
        this.addr = this.getIpAddr();
        this.balance = 0;

        this.keypair = this.elliptic.generateKeyPair();
        this.difficulty = 5;
    }

    /*
        * Method that connects you to the blockchain network and immediately starts mining
    */
    public start() {
        this.listen();
        this.listener.listen(3333);

        while(true) {
            this.mine();
        }
    }

    /*
        * If one wants to connect to the blockchain network, somebody in the blockchain has to add them.
        * This is because some node needs to announce that new node with some IP address is going to be added in the network
    */
    public addNode(node: Node): void {
        this.listener.emit(BLOCKCHAIN_EVENT.NEW_NODE_ADDED, node);
    }

    /*
        * Add new transaction in the pending transactions
    */
    public addTransaction(tx: TransactionInterface, sk: string): void {
        this.listener.emit(BLOCKCHAIN_EVENT.TRANSACTION_PERFORMED, tx, sk);
    }
    
    /*
        * Method that starts mining your machine
    */
    private mine() {
        const next = new Block(Date.now(), this.pendingTransactions, this.latestBlock.getHash());
        next.mineBlock(this.difficulty);

        this.listener.emit(BLOCKCHAIN_EVENT.BLOCK_MINED, next);
    }

    /*
        * Listen for outcoming information in the blockchain like:
        * 1. New block mining
        * 2. New transaction
        * 3. New node addition in the network
    */
    private listen() {
        this.listener.on(BLOCKCHAIN_EVENT.BLOCK_MINED, this.handleNewBlock.bind(this));
        this.listener.on(BLOCKCHAIN_EVENT.TRANSACTION_PERFORMED, this.handleNewTransaction.bind(this));
        this.listener.on(BLOCKCHAIN_EVENT.NEW_NODE_ADDED, this.handleNewNode.bind(this));
    }

    /** HANDLERS */

    /*
        * This is the handler when somebody in the network found the hash.
        * We are checking all pending txs and adding it into history
        * Then announcing it to all nodes in the blockchain
        * Also failed txs are logged as well
    */
    private handleNewBlock(block: BlockInterface) {

        const validTransactions = new Array<TransactionInterface>();
        const invalidTransactions = new Array<TransactionInterface>();

        for(let tx of this.pendingTransactions) {
            tx.isValid() ? validTransactions.push(tx) : invalidTransactions.push(tx);
        }
    
        this.chain.push(block);
        this.transactionsHistory = [...this.transactionsHistory, ...validTransactions];
        this.gossiper.broadcast(this.addresses, block);
    
        log(`Mined:`, block);
    
        if (invalidTransactions.length > 0) log(`Invalid transactions:`, invalidTransactions);

        this.pendingTransactions = [];
    }

    /*
        * Method that handles new txs addition in pending transaction
        * We are checking if user has sufficient coins to perform transaction
    */
    private handleNewTransaction(tx: TransactionInterface, sk: string) {
    
        if(!tx.isValid()) throw new Error("Invalid transaction");

        const from = tx.getFromAddr();
        const amount = tx.getAmount();

        if(!this.hasSufficientBalance(from.addr, amount)) throw new Error("Insufficient balance");

        tx.sign(sk);
        
        this.gossiper.broadcast(this.addresses, tx);

        log(`New Transaction: ${tx}`);
    }

    /*
        * Adds and announces addition of the new node in the network
    */
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