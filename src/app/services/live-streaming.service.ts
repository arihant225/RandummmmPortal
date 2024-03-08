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

  ConfigurePeerConnection(connection:IConnection, component: ChatComponent) {

    let peerConnection: RTCPeerConnection;
    let configurations = {
      iceServers: [{ urls: Configurations.Webrtc }]
    }
    peerConnection = new RTCPeerConnection(configurations);


    //setting up peer Connection

  

    if (component.stream) {
      for (let track of component.stream.getTracks())
        peerConnection.addTrack(track,component.stream);
    }
   peerConnection.ontrack=(ev)=>{
    console.log(ev)
        connection.stream= ev.streams[0]
        
       
    }
    


    peerConnection.onsignalingstatechange = (state) => {
      if (peerConnection.signalingState == "have-remote-offer")
        peerConnection.createAnswer().then(offer => {
          peerConnection.setLocalDescription(offer)
          console.log("call answered")
          console.log(peerConnection)
   
        }
        )
    };
    connection.peerConnection=peerConnection;

  

    //creating offer;


    let offer = peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });


    //sending offer 
    offer.then(
      session => {
        peerConnection?.setLocalDescription(session);
        this.chatConnectivity.sendStreamingOffer(session, connection.id);
      }
    )



  }

  AcceptOfferFromOtherPeers(peerConnection: RTCPeerConnection, offer: RTCSessionDescriptionInit) {
    if (peerConnection) {
      peerConnection.setRemoteDescription(offer);
 
    }

  }
}



