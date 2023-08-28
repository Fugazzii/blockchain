import { Blockchain } from "./blockchain";
import { Node } from "./blockchain";
import { TcpClient } from "./transport/tcp.client";
import { TcpServer } from "./transport/tcp.server";

/* Custom transport */
const transportServer = new TcpServer();
const transportClient = new TcpClient();

/* This is my computer */
const me = new Blockchain(transportServer, transportClient);

/* 
    This is somebody's computer.
    It is not supposed to be here, just for representing example
*/
const somebody: Node = new Blockchain(transportServer, transportClient);


me.start();

/*
    * If one wants to connect to the blockchain network, somebody in the blockchain has to add them.
    * This is because some node need to announce that new node with some IP address is going to be added in the network
*/
me.addNode(somebody);