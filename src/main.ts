import { Blockchain } from "./blockchain";
import { Node } from "./blockchain";
import { TcpClient } from "./transport/tcp/tcp.client";
import { TcpServer } from "./transport/tcp/tcp.server";

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


me.addNode(somebody);