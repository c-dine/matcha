import { Injectable } from '@angular/core';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
	socket = io(`http://localhost:8080/socket`);

    constructor(
    ) {}
}
