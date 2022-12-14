// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChatComponent } from './chat.component';
import { RouterTestingModule } from '@angular/router/testing';
import { mocktoken } from '../auth.service.spec';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptorMockService } from '../http-request-interceptor-mock.service';
import { mockUserTenentId } from '../chat.service.spec';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers:[
        {
          provide:HTTP_INTERCEPTORS,
          useClass:HttpRequestInterceptorMockService,
          multi:true
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should set the token property getting from api call on ngOnInit',fakeAsync(()=>{
    tick();
    expect(component.token).toEqual(mocktoken.accessToken);
    }));

  it('should get UserTenentId from api call on function enterToken',fakeAsync(()=>{
    component.enterToken();
    tick();
    expect(component.senderUUID).toEqual(mockUserTenentId);
  }));
  
  it('should add data to the message property and change inRoom property to truely on clicking Join button',()=>{
    component.getMessages();
    expect(component.inRoom).toBeTrue();
  });
  
  it('should empty the message property and change inRoom property to falsey on clicking leave button', () => {
    expect(component.inRoom).toBeTrue();
    component.leaveRoom() 
    expect(component.inRoom).toBeFalse();
    expect(component.messages).toEqual([]);
  });

  // it('should get UserTenentId from api call on function enterToken',fakeAsync(()=>{
  //   component.sendMessage({message:'hello bhai'},'sender');
  //   tick();
  //   expect(component.messages).toEqual(mockChat);
  // }));

});
