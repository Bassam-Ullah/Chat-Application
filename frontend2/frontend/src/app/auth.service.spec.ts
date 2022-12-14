import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';
export const mocktoken = {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMzQ2YjVmLWIzMWMtN2EzYy1hODUzLTk4MTIwNjBkM2I0YSIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJVc2VyIiwibWlkZGxlTmFtZSI6bnVsbCwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJwaG9uZSI6bnVsbCwibGFzdExvZ2luIjpudWxsLCJkb2IiOm51bGwsImdlbmRlciI6bnVsbCwiZGVmYXVsdFRlbmFudElkIjoiMWQ2ZTYwY2ItYTAxNy0xZWI3LTg4N2EtMzZkY2ZiYWQzNDM0IiwicGVybWlzc2lvbnMiOlsiQ3JlYXRlVG9kbyIsIlVwZGF0ZVRvZG8iLCJEZWxldGVUb2RvIiwiVmlld01lc3NhZ2UiLCJDcmVhdGVNZXNzYWdlIiwiVXBkYXRlTWVzc2FnZSIsIkRlbGV0ZU1lc3NhZ2UiLCIxIiwiMiIsIjMiLCI0IiwiNSIsIjYiLCI3IiwiOCIsIkNyZWF0ZU1lc3NhZ2VSZWNpcGllbnQiLCJWaWV3TWVzc2FnZVJlY2lwaWVudCIsIlVwZGF0ZU1lc3NhZ2VSZWNpcGllbnQiLCJEZWxldGVNZXNzYWdlUmVjaXBpZW50IiwiVmlld05vdGlmaWNhdGlvbiIsIkNyZWF0ZU5vdGlmaWNhdGlvbiIsIlVwZGF0ZU5vdGlmaWNhdGlvbiIsIkRlbGV0ZU5vdGlmaWNhdGlvbiIsIkNhbkdldE5vdGlmaWNhdGlvbkFjY2VzcyIsIlZpZXdDaGFubmVsIiwiQ3JlYXRlQ2hhbm5lbCIsIlVwZGF0ZUNoYW5uZWwiLCJEZWxldGVDaGFubmVsIl0sInVzZXJQcmVmZXJlbmNlcyI6eyJsb2NhbGUiOiJlbiJ9LCJ0ZW5hbnRJZCI6IjFkNmU2MGNiLWEwMTctMWViNy04ODdhLTM2ZGNmYmFkMzQzNCIsInVzZXJUZW5hbnRJZCI6ImEyZDE0ZmQ4LTVkY2QtYTk3YS1iODcwLTk3ZGFlNTc4ZmNmZiIsInN0YXR1cyI6MSwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjY3NDk1OTI1LCJleHAiOjE2Njc0OTY4MjUsImlzcyI6ImhlbGxvIn0.YUf7LfpYOByRayjmzfgqsf40F2LvVrrsjVLtH96EB28",
    expires: 1667460482038,
    refreshToken: "301775c996dfc9d8df2264e1194d83affdec434d0b0f4041e80f2e796323d7bb"
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  const tokenUrl = environment.API_URL + 'auth/token';
  const localAuthUrl = environment.API_URL + `auth/login`;
  const mockCode = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6InRlc3RfY2xpZW50X2lkIiwidXNlciI6eyJkZWxldGVkIjpmYWxzZSwiZGVsZXRlZE9uIjpudWxsLCJkZWxldGVkQnkiOm51bGwsImNyZWF0ZWRPbiI6IjIwMjItMTAtMjdUMTE6MDE6MTMuMjM1WiIsIm1vZGlmaWVkT24iOiIyMDIyLTEwLTI3VDExOjA1OjM3LjcxM1oiLCJjcmVhdGVkQnkiOm51bGwsIm1vZGlmaWVkQnkiOm51bGwsImlkIjoiZmEzNDZiNWYtYjMxYy03YTNjLWE4NTMtOTgxMjA2MGQzYjRhIiwiZmlyc3ROYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IlVzZXIiLCJtaWRkbGVOYW1lIjpudWxsLCJ1c2VybmFtZSI6ImFkbWluQGV4YW1wbGUuY29tIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInBob25lIjpudWxsLCJhdXRoQ2xpZW50SWRzIjpbMV0sImxhc3RMb2dpbiI6bnVsbCwiZG9iIjpudWxsLCJnZW5kZXIiOm51bGwsImRlZmF1bHRUZW5hbnRJZCI6IjFkNmU2MGNiLWEwMTctMWViNy04ODdhLTM2ZGNmYmFkMzQzNCIsInBlcm1pc3Npb25zIjpbXX0sImlhdCI6MTY2NzQ5NTg4NCwiZXhwIjoxNjY3NDk2MDY0LCJhdWQiOiJ0ZXN0X2NsaWVudF9pZCIsImlzcyI6ImhlbGxvIn0.jp0l-JyuueFy2bgyex5f3AokTGGqvtsRS_jvH-iTAQc'
  const mockusername = "admin@example.com";
  const mockpassword = "test123!@#";

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
          ],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should get access token on calling getToken function", fakeAsync(() => {
    service.getToken(mockCode).subscribe(token => {
      expect(JSON.stringify(token)).toEqual(JSON.stringify(mocktoken))
    });
    let req = httpTestingController.expectOne(tokenUrl);
    expect(req.request.method).toEqual("POST");
    req.flush(mocktoken);
  }));

  it("should got login on calling login function", fakeAsync(() => {
    service.login(mockusername,mockpassword).subscribe(code => {
      expect(JSON.stringify(code)).toEqual(JSON.stringify({code:mockCode}))
    });
    let req = httpTestingController.expectOne(localAuthUrl);
    expect(req.request.method).toEqual("POST");
    req.flush({code:mockCode});
  }));


});