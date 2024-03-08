import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'
import { Configurations } from '../Configurations/Configurations';
import { ChatComponent } from '../components/chat/chat.component';
import { TextMessage } from 'src/interfaces/TextMessage';
import { StreamOffer } from 'src/interfaces/StreamOffers';
@Injectable({
  providedIn: 'root'
})
export class ChatConnectivityService {


  api: string = Configurations.Api;
  connection: HubConnection
  constructor() {
    let singnalREndPoint = this.api + "live";
    this.connection = new HubConnectionBuilder().withUrl(singnalREndPoint).build();
  }
  public setName(name: string) {
    localStorage.setItem("userName", name);
  }
  
  ConfiguredConnection(chatComponent: ChatComponent) {

    let name = localStorage.getItem("userName");
    if (name)
      this.startConnection(name, chatComponent);
  }
  //#region establish Connection
  private startConnection(name: string, chatComponent: ChatComponent) {
    if (this.connection.state != HubConnectionState.Connected) {
      this.connection.start().then(
        success => {
          this.connection.send("GetConnectionId", name)
        }
      )
    }
    this.connection.on("NewConnectionConfigured", obj => {

      localStorage.setItem("connectionId", obj)
      chatComponent.userId = localStorage.getItem("connectionId")
    });
  


    //configured events


    this.FoundMatch(chatComponent);
    this.RecieveMessage(chatComponent);
    this.callDisconnected(chatComponent);
    this.GetRemoteStream(chatComponent)
  }



  public sendMessage(ConnectionId: string, message: string) {
    this.connection.send("SendMessage", ConnectionId, message)
  }


  public EndCall(){
    this.connection.send("EndCall")
  }


  

  //#region events
  public GoLive() {
    this.connection.send("AddRequest")
  }
  private RecieveMessage(chatComponent: ChatComponent) {
    this.connection.on(
      "RecivedMessage", (message: TextMessage) => {

        console.log(message)
        chatComponent.chatCommunication.push(message);
        setTimeout(() => {


          let scroller = document.getElementsByClassName("chat-scroller")[0]
          if (scroller) {
            scroller.scrollBy({
              behavior: 'smooth',
              top: scroller.scrollHeight + scroller.clientHeight
            })
          }
        }, 5);
      }
    );


  }
  private callDisconnected(chatComponent:ChatComponent)
  {
    this.connection.on("Disconnected",
    obj=>{
     
      chatComponent.LeftCall(obj);
    })
  }

  private FoundMatch(chatComponent: ChatComponent) {
    this.connection.on("FoundMatch",
      obj => {
        chatComponent.MatchHandler(obj)
      })
  }
  private GetRemoteStream(chatComponent:ChatComponent){
    this.connection.on("AcceptStreamRequest",(offer:StreamOffer)=>{
     chatComponent.AcceptStreamRequest(offer);
    })
  }

  public sendStreamingOffer(offer:RTCSessionDescriptionInit,id:string)
  {
    this.connection.send("SendStreamRequest",offer.sdp,offer.type,id)
    
  }


  //#endregion


}

