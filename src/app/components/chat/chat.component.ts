import { Component, NgZone } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatConnectivityService } from 'src/app/services/chat-connectivity.service';
import { LiveStreamingService } from 'src/app/services/live-streaming.service';
import { IChatCommunication } from 'src/interfaces/IChatCommunications';
import { IConnection } from 'src/interfaces/IConnection';
import { StreamOffer } from 'src/interfaces/StreamOffers';
import { TextMessage } from 'src/interfaces/TextMessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public OpponentStreams: MediaStream | undefined;
  userId: string | null = null;
  connections: IConnection[] = []
  endCall: boolean = false;
  chatCommunication: TextMessage[] = [];
  textController: FormControl = new FormControl("", [Validators.required]);
  LiveRequest: boolean = false;
  micState = true;
  VcState = true;
  stream: MediaStream | undefined = undefined;




  constructor(public chatService: ChatConnectivityService, private router: Router, private zone: NgZone, private liveStreamingService: LiveStreamingService) {

    if (!localStorage.getItem("userName")) {
      this.router.navigate(["/chatSetup"]);
      return
    }
    this.chatService.ConfiguredConnection(this);

  }





  LeftCall(connectionId: string) {
    this.connections = this.connections.filter(obj => obj.id != connectionId)
    if (this.connections.length == 0) {
      this.endCall = true;
      this.chatCommunication = [];
      if (this.stream) {
        this.stream.getAudioTracks().forEach(obj => obj.stop())

        this.stream.getVideoTracks().forEach(obj => obj.stop())
      }
    }

  }


  peerConnections: RTCPeerConnection[] = []
  MatchHandler(obj: any) {
  

    let tempConnection: IConnection = {
      id: obj.connectionId,
      name: obj.name,
    }
    


    if (!this.connections.length)
    this.SetupCall(tempConnection)
  else
  this.liveStreamingService.ConfigurePeerConnection(tempConnection, this)


    this.connections.push(tempConnection);






    this.chatCommunication.push(
      {
        name: obj.name,
        connectionId: obj.connectionId,
        type: "info",
        time: "",
        message: ''
      }
    )
    this.LiveRequest = false;

  }

  public EndCall() {
    this.chatService.EndCall();
    this.endCall = false;
    this.chatCommunication = [];
    this.connections = [];
    if (this.stream) {
      this.stream.getAudioTracks().forEach(obj => obj.stop())

      this.stream.getVideoTracks().forEach(obj => obj.stop())
    }

  }

  GoLive() {
    this.chatService.GoLive();
    this.LiveRequest = true;
    this.endCall = false;
    this.chatCommunication = [];
    this.connections = [];
  }

  processText($event: KeyboardEvent) {


    if ($event.key == "Enter") {
      $event.preventDefault();

      for (let obj of this.connections) {
        if (this.textController.valid && obj.id) {
          this.chatService.sendMessage(obj.id, this.textController.value)


        }
      }
      this.textController.reset();
    }

  }


  private SetupCall(connection:IConnection) {
    if (this.stream) {
      this.stream.getAudioTracks().forEach(obj => obj.stop())

      this.stream.getVideoTracks().forEach(obj => obj.stop())
    }
    
      
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(
      (stream) => {
        this.stream = stream;
        this.liveStreamingService.ConfigurePeerConnection(connection, this)
      }
    ).catch(
      ()=>{
  
      navigator.mediaDevices.getDisplayMedia(
        {audio:true,
        video:true}
      )
      .then(
        data=>{
          this.stream=data;
          this.liveStreamingService.ConfigurePeerConnection(connection, this)
        }
      )
   
    }
    )
  }

  setMicState(state: boolean) {
    this.micState = state;


  }


  setVCState(state: boolean) {
    this.VcState = state;
  };


  AcceptStreamRequest(offer: StreamOffer) {

    let tempIntervalRef = setInterval(
      () => {
        let peerConnection = this.connections.filter(op => op.id == offer.id)[0]
        if (peerConnection&&peerConnection.peerConnection) {
          this.liveStreamingService.AcceptOfferFromOtherPeers(peerConnection, offer.streamOffer);
          clearInterval(tempIntervalRef);
          clearTimeout(tempIntervalRef);
        }

      }, 100
    )
  }

  RecivedICECandidate(event:string)
  {
    console.log(this.connections);
    let _event:iceCandidateEvent=JSON.parse(event);

   let intervalCache=  setInterval(()=>{
      let connection=this.connections.filter(obj=>obj.id==_event.id)[0]
      if(connection)
      {
        connection.peerConnection?.addIceCandidate(_event.candidate)
        
        clearInterval(intervalCache);
        clearTimeout(intervalCache);
      }

    },100)
    
  }

  
  SetAcceptedOffer(event:string)
  {
    let _event:any=JSON.parse(event);

    console.log("offer recived");
   let intervalCache=  setInterval(()=>{
      let connection=this.connections.filter(obj=>obj.id==_event.id)[0]
      if(connection)
      {       
        clearInterval(intervalCache);
        clearTimeout(intervalCache);
      }

    },100)
    
  }


  



}
interface iceCandidateEvent{
  id:string,
  candidate:RTCIceCandidate
}
