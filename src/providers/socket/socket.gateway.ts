import { ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketActionService } from './socket-action.service';
import { PrismaService } from 'src/database/prisma/prisma.service'; // Thay thế đường dẫn thật
import * as cuid from 'cuid';
import { WsGuard } from 'src/common/guard/socketJwt.guard';
import { MyJwtGuard } from 'src/common/guard';
import { GetUser } from 'src/common/decorator/user.decorator';
import { GetUserFromWs } from 'src/common/decorator/test';
import { MessageService } from 'src/app/message/message.service';
import { RoomMessageService } from 'src/app/roomMessage/roomMessage.service';
import { UserRoomMessageService } from 'src/app/userRoomMessage/userRoomMessage.service';
import { use } from 'passport';
import { ConfigService } from '@nestjs/config';
var jwt = require('jsonwebtoken');
@Injectable()
@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private pingInterval: NodeJS.Timeout;

  constructor(
    private socketActionService: SocketActionService,
    private prisma: PrismaService,
    private messageService: MessageService,
    private roomMessageService: RoomMessageService,
    private userRoomMessageService: UserRoomMessageService,
    private readonly configService: ConfigService
  ) {}

  async handleConnection(socket: Socket) {
    this.pingInterval = setInterval(() => {
      socket.emit('ping', { timestamp: new Date() });
    }, 30000);
    socket.on('join', async (userId) => {
      await this.saveUserSocketInfo(userId, socket.id);
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId); 
    });
  }
  async handleDisconnect(socket: Socket) {
    try {
      // await this.removeUserSocketInfo(socket.id);
      clearInterval(this.pingInterval);
    } catch (error) {
      console.error("Error while removing user socket info:", error);
    }
  }

  async saveUserSocketInfo(userId: string, socketId: string) {
    try {
      const savedSocketConnection = await this.socketActionService.saveSocketId(userId, socketId);

    } catch (error) {
      console.error('Error saving socket connection:', error);
    }
    
  }

  
  async removeUserSocketInfo(socketId: string) {
    return await this.socketActionService.deleteSocketId(socketId)
  }

  async getUserIdBySocketId(socketId: string): Promise<any> {
    return await this.socketActionService.getUserByClient(socketId);
  }

  async getSocketByUserId(userId: string): Promise<any> {
    return await this.socketActionService.getClientByUser(userId)
  }


  @SubscribeMessage('sendNotification')
  async sendNotificationWithClient(client: Socket, payload: any) {
    const { userId, description, action, id } = payload;


  try {
    const socketId = await this.getSocketByUserId(userId);
    if (socketId) {
      const notificationData = await this.socketActionService.createNotification(userId, description, action, id);
      this.server.to(socketId).emit('notification', notificationData);
    }
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
  }

  // @SubscribeMessage('sendNotification')
  async sendNotification(userId: string, description: string,action: string, id: string) {
    try {
      const socketId = await this.getSocketByUserId(userId);
      if (socketId) {
        const notificationData = await this.socketActionService.createNotification(userId, description, action, id);
        this.server.to(socketId).emit('notification', notificationData);
      }
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('Message')
  async sendMessage
  (@MessageBody() message:any,
  @ConnectedSocket() socket: Socket,
  @GetUser() user: any) {
    if(!user.id || !message.userId){
      throw new ForbiddenException('Please check again')
    }
    const seederId = await this.getSocketByUserId(user.id);

    const receivedId = await this.getSocketByUserId(message.userId);
    
    let roomId: string;
    const checkRoom = await this.roomMessageService.checkRoom(user.id, message.userId)
    if(!checkRoom){
        const roomMessage = await this.roomMessageService.createRoom();
        roomId = roomMessage.id
        await this.userRoomMessageService.create(user.id, roomMessage.id)
        await this.userRoomMessageService.create(message.userId, roomMessage.id)
    }else{
      roomId= checkRoom.id
    }
    const newMessage = await this.messageService.createMessage(
      message.content, 
      user.id, 
      roomId
      );
    const newRoom = await this.roomMessageService.checkRoomId(roomId)
    
    if(!checkRoom){
      this.server.to(seederId).emit('newRoom-received',{
        newRoom
      })
  
      this.server.to(receivedId).emit('newRoom-received',{
        newRoom
      })
      return
    }

    this.server.to(roomId).emit('message-received',{
      roomId: roomId,
      newMessage
    })  
  }
  
  @UseGuards(WsGuard)
  @SubscribeMessage('sendMessage')
  async sendMessageWithRoomId
  (
  @MessageBody() message:any,
  @ConnectedSocket() socket: Socket,
  @GetUser() user: any
  ) {
    const roomMessage = await this.roomMessageService.checkRoomId(message.roomId)
    if(!roomMessage){
      throw new ForbiddenException('Please Check Again')
    }

    const newMessage = await this.messageService.createMessage(
      message.content, 
      user.id, 
      roomMessage.id
    );

    this.server.to(roomMessage.id).emit('message-received',{
      roomId: roomMessage.id,
      newMessage
    })
    
  }
  

  @SubscribeMessage('sendMessageNative')
  async sendMessageWithRoomIdNavive
  (
  @MessageBody() message:any,
  @ConnectedSocket() socket: Socket,
  ) {
    const token = message.authencation
    let user : any;
    try{
      user = await jwt.verify(token, this.configService.get('JWT_SECRET'))
    }catch(error){
      throw new ForbiddenException('please check again')
    }
    
    const roomMessage = await this.roomMessageService.checkRoomId(message.roomId)
    if(!roomMessage){
      throw new ForbiddenException('Please Check Again')
    }

    const newMessage = await this.messageService.createMessage(
      message.content, 
      user.id, 
      roomMessage.id
    );

    this.server.to(roomMessage.id).emit('message-received',{
      roomId: roomMessage.id,
      newMessage
    })
  }

  @SubscribeMessage('messageNative')
  async sendMessageNative
  (@MessageBody() message:any,
  @ConnectedSocket() socket: Socket,
  ) {
    const token = message.authencation
    let user : any;
    try{
      user = await jwt.verify(token, this.configService.get('JWT_SECRET'))
    }catch(error){
      throw new ForbiddenException('please check again')
    }

    if(!user.id || !message.userId){
      throw new ForbiddenException('Please check again')
    }
    const seederId = await this.getSocketByUserId(user.id);
    const receivedId = await this.getSocketByUserId(message.userId);
    let roomId: string;
    const checkRoom = await this.roomMessageService.checkRoom(user.id, message.userId)
    if(!checkRoom){
        const roomMessage = await this.roomMessageService.createRoom();
        roomId = roomMessage.id
        await this.userRoomMessageService.create(user.id, roomMessage.id)
        await this.userRoomMessageService.create(message.userId, roomMessage.id)
    }else{
      roomId= checkRoom.id
    }
    const newMessage = await this.messageService.createMessage(
      message.content, 
      user.id, 
      roomId
      );
    const newRoom = await this.roomMessageService.checkRoomId(roomId)
    
    if(!checkRoom){
      this.server.to(seederId).emit('newRoom-received',{
        newRoom
      })
  
      this.server.to(receivedId).emit('newRoom-received',{
        newRoom
      })
      return
    }

    this.server.to(roomId).emit('message-received',{
      roomId: roomId,
      newMessage
    })  
  }
}
