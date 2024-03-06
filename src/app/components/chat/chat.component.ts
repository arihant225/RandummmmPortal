import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChatConnectivityService } from 'src/app/services/chat-connectivity.service';
import { IChatCommunication } from 'src/interfaces/IChatCommunications';
import { TextMessage } from 'src/interfaces/TextMessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userId:string|null=null;
  constructor(public chatService:ChatConnectivityService){
   
    this.chatService.ConfiguredConnection( this);
    this.chatService.connection.state
    

  

  }
  MatchHandler(obj:any)
  {
   this.OpponentId=obj.connectionId;
   this.LiveRequest=false;
  }
  chatCommunication:TextMessage[]=[];
  textController:FormControl=new FormControl("",[Validators.required]);
  OpponentId:string|null=null;
  LiveRequest:boolean=false;
  GoLive(){
    this.chatService.GoLive();
    this.LiveRequest=true;

  }
  
  processText($event:KeyboardEvent)
  {
    
 
    if($event.key=="Enter")
    {
      $event.preventDefault();
      if(this.textController.valid&&this.OpponentId)
      {
        this.chatService.sendMessage(this.OpponentId,this.textController.value)
        

      }
      this.textController.reset();
    }

  }


}
