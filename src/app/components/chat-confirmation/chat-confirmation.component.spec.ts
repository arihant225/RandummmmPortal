import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConfirmationComponent } from './chat-confirmation.component';

describe('ChatConfirmationComponent', () => {
  let component: ChatConfirmationComponent;
  let fixture: ComponentFixture<ChatConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
