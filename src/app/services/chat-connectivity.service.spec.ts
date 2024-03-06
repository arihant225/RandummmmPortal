import { TestBed } from '@angular/core/testing';

import { ChatConnectivityService } from './chat-connectivity.service';

describe('ChatConnectivityService', () => {
  let service: ChatConnectivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatConnectivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
