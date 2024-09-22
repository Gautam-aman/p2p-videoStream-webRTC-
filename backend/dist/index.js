"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let recieverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        if (message.type === 'sender') {
            senderSocket = ws;
        }
        else if (message.type === 'reciever') {
            recieverSocket = ws;
        }
        else if (message.type === "createOffer") {
            recieverSocket === null || recieverSocket === void 0 ? void 0 : recieverSocket.send(JSON.stringify({ type: "createOffer", sdp: message.sdp }));
        }
        else if (message.type === "createAnswer") {
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "createAnswer", sdp: message.sdp }));
        }
        else if (message.type === "ice-candidate") {
            if (ws === senderSocket) {
                recieverSocket === null || recieverSocket === void 0 ? void 0 : recieverSocket.send(JSON.stringify({ type: 'icecandidate', candidate: message.candidate }));
            }
            else if (ws === recieverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'icecandidate', candidate: message.candidate }));
            }
        }
    });
});
