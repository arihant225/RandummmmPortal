import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Configurations } from 'src/app/Configurations/Configurations';
import { ChatConnectivityService } from 'src/app/services/chat-connectivity.service';

@Component({
  selector: 'app-chat-confirmation',
  templateUrl: './chat-confirmation.component.html',
  styleUrls: ['./chat-confirmation.component.scss']
})

export class ChatConfirmationComponent {
  NameController:FormControl=new FormControl("",[Validators.required])
  constructor(private chatService:ChatConnectivityService,private router:Router){}
  
  Configure(){
    this.chatService.setName(this.NameController.value);
    this.router.navigate(["/chat"])

  }
}
