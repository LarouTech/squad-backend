/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthorizerGuard } from 'src/auth/authorizer.guard';

@UseGuards(AuthorizerGuard)
@WebSocketGateway(3300, {namespace: 'profile'})
export class ProfileGateway implements OnGatewayConnection {


  @WebSocketServer()
  server: Server


  handleConnection(socket: Socket) {
    console.log(`Connected: ${socket.id}`);
  }


  @SubscribeMessage('joinLeagueNotification')
  onJoinLeagueNotification(socket: Socket, message: string) {
    console.log(message)
    this.server.emit('joinLeagueNotificationEmitter', message)
  }


}
