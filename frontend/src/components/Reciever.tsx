import { useEffect , useRef} from "react";

export function Reciever(){
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080')
        socket.onopen=()=>{
            socket.send(JSON.stringify({type:'reciever'}))
        }
        socket.onmessage= async(event)=>{
            const message = JSON.parse(event.data);
            let pc : RTCPeerConnection | null=null;
            if (message.type === 'createOffer'){
                const pc = new RTCPeerConnection();
                await pc.setRemoteDescription(message.sdp);

                pc.ontrack=(event)=>{
                    const video = document.createElement('video');
                    document.body.appendChild(video);
                    console.log(event); 
                    video.srcObject= new MediaStream([event.track]);
                    video.play();
                }

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({type:'createAnswer' , sdp: pc.localDescription}));
            }
           
            else if (message.type === 'icecandidate'){
                if (pc !== null){
                    //@ts-ignore
                    pc.addIceCandidate(message.candidate)
                }
            }
        }
    },[]);
    return (
        <div>
            <video ref={videoRef}></video>
        </div>
    )
}