export interface IConnection {
    id: string;
    name: string;
    peerConnection?: RTCPeerConnection; // Assuming PeerConnection is a custom type
    stream?: MediaStream; // You can specify the type of stream here if it's known
}
