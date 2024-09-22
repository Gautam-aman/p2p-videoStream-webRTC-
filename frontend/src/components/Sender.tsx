import { useEffect, useState } from "react"

export function Sender(){
    const [socket , setsocket] = useState<WebSocket|null>(null);
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080')
        socket.onopen=()=>{
            socket.send(JSON.stringify({type:'sender'}))
        }
        setsocket(socket);
    },[]);

    async function startsendingvideo(){
        if (!socket) return ;
         const pc = new RTCPeerConnection();
         pc.onnegotiationneeded=async ()=>{
            const offer = await pc.createOffer();
         await pc.setLocalDescription(offer);
         socket?.send(JSON.stringify({type:'createOffer' ,sdp:pc.localDescription}));
         }

         pc.onicecandidate=(event)=>{
            if(event.candidate){
            socket?.send(JSON.stringify({type:'icecandidate',candidate:event.candidate}));
            }
         }
         

         socket.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if (data.type === 'createAnswer'){
                pc.setRemoteDescription(data.sdp);
            }
            else if (data.type ==='icecandidate'){
                pc.addIceCandidate(data.candidate);
            }
         }

         const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})

         pc.addTrack(stream.getVideoTracks()[0]);

    }

    return (
        <div>
            
            <button onClick={startsendingvideo}>Send Video</button>
        </div>
    )
}