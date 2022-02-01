import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessagesService } from '../../services/messages.service';
import { Subscription } from 'rxjs';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.sass']
})
export class NewMessageComponent implements OnInit, OnDestroy {
  @ViewChild('f') messageForm!: NgForm;
  messageUploadingSubscription!: Subscription;
  isUploading = false;

  constructor(private messagesService: MessagesService) {
  }

  ngOnInit(): void {
    this.messageUploadingSubscription = this.messagesService.messageUploading.subscribe(isUploading => {
      this.isUploading = isUploading;
    })
  }

  sendMessage() {
    if (!this.messageForm.value.message.trim().length || !this.messageForm.value.author.trim().length) return;
    const id = Math.random().toString();
    const message = new Message(this.messageForm.value.message, this.messageForm.value.author, id, id);
    this.messagesService.sendMessage(message).subscribe();
  }

  ngOnDestroy(): void {
    this.messageUploadingSubscription.unsubscribe();
  }

}
