import { Component } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    this.socket.on("chat message", (msg) => this.messages.unshift(msg));
  }

  title = 'angular-chat';
  messages:string[] = [];
  sendMessageForm = new FormGroup({
    messageInputControl: new FormControl(""),
  });

  socket = io();
  onSubmit() {
    console.log(this.sendMessageForm.controls.messageInputControl.value);
    this.socket.emit("chat message", this.sendMessageForm.controls.messageInputControl.value);
    this.sendMessageForm.controls.messageInputControl.setValue("");
  }
}
