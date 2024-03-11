import { Injectable } from '@angular/core';
import 'webrtc'
import { Configurations } from '../Configurations/Configurations';
import { ChatConnectivityService } from './chat-connectivity.service';
import { ChatComponent } from '../components/chat/chat.component';
import { IConnection } from 'src/interfaces/IConnection';

@Injectable({
  providedIn: 'root'
})
export class LiveStreamingService {


  constructor(private chatConnectivity: ChatConnectivityService) {
  }

  ConfigureDataChannel(peer:RTCPeerConnection)
  {
    let dataChannel = peer.createDataChannel("myDataChannel");
    dataChannel.onopen = ()=> {
      console.log("Data channel opened");
      dataChannel.send("Hello, World!");

    };
    
    dataChannel.onmessage = (event:any)=> {
      console.log("Received message: " + event.data);
    };
    
    dataChannel.onerror = (error:any)=> {
      console.error("Data channel error: " + error);
    };

  }
  ConfigurePeerConnection(connection: IConnection, component: ChatComponent) {
    



    let peerConnection: RTCPeerConnection;

    let configurations:RTCConfiguration = {
      iceServers: [
      //  { urls:"turn:relay1.expressturn.com:3478",username:"efKMBJV0LC4X769KXD",credential:"8UP6IQo50m9UeoKd"},
      {
          urls:Configurations.Webrtc
        }]
        ,iceCandidatePoolSize:2,bundlePolicy:'max-bundle',rtcpMuxPolicy:'require',iceTransportPolicy:'all'
    }

    peerConnection = new RTCPeerConnection(configurations);

    peerConnection.onconnectionstatechange=ev=>{
      if(peerConnection.connectionState=="failed"){
        peerConnection.restartIce  
    }
  }

    //setting up peer Connection

    if (component.stream) {
      for (let track of component.stream.getTracks()) {
  
        peerConnection.addTrack(track, component.stream);
      }
     
    }





    peerConnection.ontrack = (ev) => {
      console.log("track from remote", ev)
     
        connection.stream=ev.streams[0];
    

    }







    connection.peerConnection = peerConnection;




    peerConnection.onicecandidate =
    ev => {
      console.log(ev)
      if (ev.candidate) {
        let send = {
          candidate: ev.candidate,
          id: component.userId
        }


        this.chatConnectivity.sendICECandidate(JSON.stringify(send), connection.id);


      }
    }

    let offer = peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });


    offer.then(
      session => {
        peerConnection?.setLocalDescription(session);

        this.chatConnectivity.sendStreamingOffer(session, connection.id);
      }
    )



  }

  AcceptOfferFromOtherPeers(connection: IConnection, offer: RTCSessionDescriptionInit) {
    if (connection.peerConnection) {
      connection.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      connection.peerConnection.createAnswer().then(answer => {
        connection.peerConnection?.setLocalDescription(answer);
        this.chatConnectivity.AnswerStreamingCall(JSON.stringify(offer),connection.id)
        if(connection.peerConnection)
        this.ConfigureDataChannel(connection.peerConnection)
      }
      )
 



    }

  }


}



