import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChatConfirmationComponent } from './components/chat-confirmation/chat-confirmation.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  
{
  component:ChatConfirmationComponent,
  path:'chatSetup',
  pathMatch:'full'
},{
  component:HomeComponent,
  path:'',
  pathMatch:'full'
},{
  component:ChatComponent,
  path:'chat',
  pathMatch:'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
