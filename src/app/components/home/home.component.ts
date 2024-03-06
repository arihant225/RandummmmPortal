import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { SectionController } from 'src/interfaces/SectionController';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
ngOnInit(): void {
  this.initSections();

}



sectionController:SectionController={
  Sections:document.getElementsByClassName(''),
  currIndex:0
}

private initSections(){

  this.sectionController.Sections=document.getElementsByClassName('Intro-Section');
  this.sectionController.currIndex=0;
  if(this.sectionController.Sections.length>0)
  {
    this.sectionController.Sections[0].classList.add('active');
  }
}

@HostListener('wheel',['$event'])
ScrollHandler($event:WheelEvent)
{
}


private GetNextView($event:WheelEvent)
{

  let up=false;
  let prevIndex= this.sectionController.currIndex;
  if(up)
  {
    this.sectionController.currIndex=this.sectionController.currIndex<=0?0:this.sectionController.currIndex-1;
  }
  else{

    this.sectionController.currIndex=this.sectionController.currIndex>=this.sectionController.Sections.length-1?this.sectionController.Sections.length-1:this.sectionController.currIndex+1;
  }
  if(prevIndex!=this.sectionController.currIndex)
  {
    this.sectionController.Sections[prevIndex].classList.remove('active');
    this.sectionController.Sections[this.sectionController.currIndex].classList.add('active')
  }
}

}