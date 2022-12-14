// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component} from '@angular/core';
import {NgxNotificationService} from 'ngx-notification';
import {environment} from '../../environments/environment';
import {Chat, ChatMessage} from '../chat.model';
import {UserService} from '../chat.service';
import {io, SocketOptions, ManagerOptions} from 'socket.io-client';
import {AuthPayload} from '../auth.model';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  // styles: [
  //   `
  //     :host {
  //       display: flex;
  //     }
  //   `,
  // ],
})
export class ChatComponent {
  payload?: AuthPayload;
  username?: string;
  constructor(
    private readonly userHttpService: UserService,
    private readonly ngxNotificationService: NgxNotificationService,
    private route: ActivatedRoute,
    private authenticationService: AuthService,
  ) {
    this.route.queryParams.subscribe(param => {
      this.authenticationService.getToken(param.code).subscribe(params =>{
        this.token = params.accessToken;
        this.payload = jwt_decode(this.token);
        this.username = this.payload?.username ?? this.payload?.firstName;
        console.log(this.payload);
          this.channelUUID = environment.CHAT_ROOM;
          this.enterToken();
      })
    });
  }
  public messages: ChatMessage[] = [];
  public senderUUID = '';
  public channelUUID = environment.CHAT_ROOM;
  public token = '';
  public inRoom = true;

  socketIOOpts: Partial<ManagerOptions & SocketOptions> = {
    path: '/socket.io',
    transports: ['polling'],
    upgrade: false,
  };
  

  enterToken() {
    this.userHttpService.getUserTenantId(this.token).subscribe(data => {
      this.senderUUID = data;
    });
  }

  leaveRoom() {
    this.messages = [];
    this.inRoom = false;
  }

  getMessages() {
    this.inRoom = true;
    this.userHttpService.get(this.token, this.channelUUID).subscribe(data => {
      this.messages = [];
      for (const d of data) {
        const temp: ChatMessage = {
          body: d.body,
          subject: d.subject,
          channelType: '0',
          reply: false,
          sender: d.subject,
        };
        if (d.createdBy === this.senderUUID) {
          temp.sender = this.username!;
          temp.reply = true;
        }
        this.messages.push(temp);
      }
    });

    this.subcribeToNotifications();
  }

  subcribeToNotifications() {
    const socket = io(environment.SOCKET_ENDPOINT, this.socketIOOpts);
    socket.on('connect', () => {
      const channelsToAdd: string[] = [this.channelUUID];
      socket.emit('subscribe-to-channel', channelsToAdd);
    });

    socket.on('userNotif', message => {
      console.log(message); //NOSONAR
      const temp: ChatMessage = {
        body: message.body,
        subject: message.subject,
        channelType: '0',
        reply: false,
        sender: message.subject,
      };
      if(message.subject != this.username){
        this.ngxNotificationService.sendMessage('You got a message', 'success', 'top-right');
        this.messages.push(temp);
      }
    });
  }

  // sonarignore:start
  sendMessage(event: {message: string}, avatar: string) {
    // sonarignore:end
    if (!this.inRoom) {
      return;
    }
    const chatMessage: ChatMessage = {
      body: event.message,
      subject: this.username!,
      toUserId: this.channelUUID,
      channelId: this.channelUUID,
      channelType: '0',
      reply: true,
      sender: this.username!,
    };

    const dbMessage: Chat = {
      body: event.message,
      subject: this.username!,
      toUserId: this.channelUUID,
      channelId: this.channelUUID,
      channelType: '0',
    };

    // sonarignore:start
    this.userHttpService.post(dbMessage, this.token).subscribe(response => {
      // sonarignore:end
      this.messages.push(chatMessage);
    });
  }
}
