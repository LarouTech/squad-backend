/* eslint-disable prettier/prettier */
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class LeagueGateway {

  @WebSocketServer()
  server: Server

  @SubscribeMessage('message')
  handleMessage(_: Socket, message: any): string {
    return 'Hello world!';
  }
}
