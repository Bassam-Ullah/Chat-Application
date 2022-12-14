import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import {Chat} from './chat.model';

import { UserService } from './chat.service';

export const mockUserTenentId = "bb24dfdd-971d-7cd8-7f14-1ad56c0cfc29";
const channelUUID = environment.CHAT_ROOM;

export const mockChat: Chat[] = [{
  id: '0fa5e293-098a-807b-99a5-955a0da609c2',
  subject: '343e42fa-2a87-6d05-8395-135f8e1714b8',
  body: 'hello bhai',
  toUserId: channelUUID,
  channelId: channelUUID,
  channelType: '0'
}];

describe('ChatService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  const tenantIdUrl = `${environment.BASE_URL}/userTenantId`;
  const baseUrl = `${environment.BASE_URL}/messages`;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwZTk2ZWUwLWZkMTQtMjllYi0xODE5LTUyMWM1ODE1NjdkZSIsImZpcnN0TmFtZSI6IlZpcHVsICIsImxhc3ROYW1lIjoiU2hhcm1hIiwibWlkZGxlTmFtZSI6bnVsbCwidXNlcm5hbWUiOiJ2aXB1bC5zaGFybWExQHNvdXJjZWZ1c2UuY29tIiwiZW1haWwiOiJ2aXB1bC5zaGFybWExQHNvdXJjZWZ1c2UuY29tIiwicGhvbmUiOm51bGwsImxhc3RMb2dpbiI6bnVsbCwiZG9iIjpudWxsLCJnZW5kZXIiOm51bGwsImRlZmF1bHRUZW5hbnRJZCI6IjFkNmU2MGNiLWEwMTctMWViNy04ODdhLTM2ZGNmYmFkMzQzNCIsInBlcm1pc3Npb25zIjpbIkNyZWF0ZVRvZG8iLCJVcGRhdGVUb2RvIiwiRGVsZXRlVG9kbyIsIlZpZXdNZXNzYWdlIiwiQ3JlYXRlTWVzc2FnZSIsIlVwZGF0ZU1lc3NhZ2UiLCJEZWxldGVNZXNzYWdlIiwiMSIsIjIiLCIzIiwiNCIsIjUiLCI2IiwiNyIsIjgiLCJDcmVhdGVNZXNzYWdlUmVjaXBpZW50IiwiVmlld01lc3NhZ2VSZWNpcGllbnQiLCJVcGRhdGVNZXNzYWdlUmVjaXBpZW50IiwiRGVsZXRlTWVzc2FnZVJlY2lwaWVudCIsIlZpZXdOb3RpZmljYXRpb24iLCJDcmVhdGVOb3RpZmljYXRpb24iLCJVcGRhdGVOb3RpZmljYXRpb24iLCJEZWxldGVOb3RpZmljYXRpb24iLCJDYW5HZXROb3RpZmljYXRpb25BY2Nlc3MiLCJWaWV3Q2hhbm5lbCIsIkNyZWF0ZUNoYW5uZWwiLCJVcGRhdGVDaGFubmVsIiwiRGVsZXRlQ2hhbm5lbCJdLCJ1c2VyUHJlZmVyZW5jZXMiOnsibG9jYWxlIjoiZW4ifSwidGVuYW50SWQiOiIxZDZlNjBjYi1hMDE3LTFlYjctODg3YS0zNmRjZmJhZDM0MzQiLCJ1c2VyVGVuYW50SWQiOiJiYjI0ZGZkZC05NzFkLTdjZDgtN2YxNC0xYWQ1NmMwY2ZjMjkiLCJzdGF0dXMiOjAsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY2NzQ1NTM1NywiZXhwIjoxNjY3NDU2MjU3LCJpc3MiOiJoZWxsbyJ9.uB_YABvIrNSRctJk5wSNbL33_ltx6imANoN8qCRnPgU';


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should read user uuid on calling getUserTenantId", fakeAsync(() => {
    service.getUserTenantId(token).subscribe(UserTenentId => {
      expect(JSON.stringify(UserTenentId)).toEqual(JSON.stringify(mockUserTenentId))
    });
    let req = httpTestingController.expectOne(tenantIdUrl);
    expect(req.request.method).toEqual("GET");
    req.flush(mockUserTenentId);
  }));

  it("should read Chat correctly on calling the get function", fakeAsync(() => {
    service.get(token,channelUUID).subscribe((chat) => {
      
      expect(JSON.stringify(chat)).toEqual(JSON.stringify(mockChat));

    });
    let req = httpTestingController.expectOne(baseUrl+'?ChannelID='+channelUUID);
    expect(req.request.method).toEqual("GET");
    req.flush(mockChat)
  }));

  it("should post Chat correctly on calling the post function", fakeAsync(() => {
    const chatpost ={
      id: '0fa5e293-098a-807b-99a5-955a0da609c3',
      subject: '343e42fa-2a87-6d05-8395-135f8e1714b3',
      body: 'hello bhai',
      toUserId: channelUUID,
      channelId: channelUUID,
      channelType: '0'
    };
  
    service.post(chatpost,token).subscribe((chat:Chat) => {
      expect(chat).toEqual(chatpost);
    });
    let req = httpTestingController.expectOne(baseUrl)
    expect(req.request.method).toEqual("POST");
    req.flush(chatpost)
  }));

});
