import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port:8080})

let senderSocket :null | WebSocket=  null ;
let recieverSocket :null | WebSocket=  null ;

wss.on('connection' , function connection(ws){
    ws.on('error' , console.error);

    ws.on('message', function message(data: any){
        const message = JSON.parse(data);
        if (message.type === 'sender'){
            senderSocket = ws;
        }
        else if (message.type === 'reciever'){
            recieverSocket = ws;
        }
        else if (message.type === "createOffer"){
            recieverSocket?.send(JSON.stringify({type:"createOffer" , sdp :message.sdp}));
        }
        else if (message.type === "createAnswer"){
            senderSocket?.send(JSON.stringify({type:"createAnswer" , sdp :message.sdp}));
        }
        else if (message.type === "ice-candidate"){
            if (ws === senderSocket ){
                recieverSocket?.send(JSON.stringify({type:'icecandidate' , candidate: message.candidate}));
            }
            else if (ws === recieverSocket){
                senderSocket?.send(JSON.stringify({type:'icecandidate' , candidate: message.candidate}));
            }
        }
    })

    

})