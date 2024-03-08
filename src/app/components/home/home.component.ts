import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { SectionController } from 'src/interfaces/SectionController';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stack_Active:boolean=false;
  ngOnInit(): void {
    this.initSections();
  window.screenTop;
  }

  public scrollTo(pageNo: number) {
    if (this.sectionController.currIndex == pageNo)
      return;
    else if (pageNo < this.sectionController.currIndex) {
      for (let i = this.sectionController.currIndex; i > pageNo; i--) {
        this.GetNextView(true)

      }
    }
    else {
      for (let i = this.sectionController.currIndex; i < pageNo; i++) {
        this.GetNextView(false)

      }

    }

  }

  downloadResume(){
    var link = document.createElement("a");
    link.href = '/assets/resume.pdf';
    link.download='Arihant_Jain.pdf'
    link.click()

    
  
  }
  sectionController: SectionController = {
    Sections: document.getElementsByClassName(''),
    currIndex: 0
  }

  private initSections() {

    this.sectionController.Sections = document.getElementsByClassName('Intro-Section');
   
  }
  @HostListener("wheel",['$event'])
  setCurrentIndex($event:WheelEvent){
    let top=(this.sectionController.Sections[this.sectionController.currIndex] as HTMLDivElement).offsetTop-100
    if(window.scrollY>=top+this.sectionController.Sections[this.sectionController.currIndex].clientHeight)
    this.sectionController.currIndex=this.sectionController.currIndex>=this.sectionController.Sections.length-1?this.sectionController.Sections.length-1:this.sectionController.currIndex+1;
    if(window.scrollY<top)
    this.sectionController.currIndex= this.sectionController.currIndex<=0?0:this.sectionController.currIndex-1;
  }


  private GetNextView(up: boolean) {

this.stack_Active=false;
    let prevIndex = this.sectionController.currIndex;
    if (up) {
      this.sectionController.currIndex = this.sectionController.currIndex <= 0 ? 0 : this.sectionController.currIndex - 1;
    }
    else {

      this.sectionController.currIndex = this.sectionController.currIndex >= this.sectionController.Sections.length - 1 ? this.sectionController.Sections.length - 1 : this.sectionController.currIndex + 1;
    }
    if (prevIndex != this.sectionController.currIndex) {
      this.sectionController.Sections[this.sectionController.currIndex].scrollIntoView({
        behavior:'smooth'
      })
    }
  }

}