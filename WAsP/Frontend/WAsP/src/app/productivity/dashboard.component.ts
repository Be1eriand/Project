import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  socket: WebSocket;
  text: string;
  interval: any;

  constructor() { }

  ngOnInit(): void {
    this.setsock()
  }

  setsock() {
    this.socket = new WebSocket('ws://127.0.0.1:8000/socket/realtime/');

    this.socket.onopen = () => {
      console.log('WebSockets connection created.');
    };

    this.socket.onmessage = (event) => {
      console.log("data from socket:" + event.data);
      this.text = event.data;
    };

    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.onopen(null);
    }
  }

  start()
  {
    this.interval = setInterval( () =>{
      this.socket.send('start');
    }, 1000);
  }

  stop() {
    this.socket.send('stop');
    clearInterval(this.interval);
  }
  
}
