import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { Message } from '../models/message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  messagesChangeSubscription!: Subscription;
  messagesFetchingSubscription!: Subscription;
  messagesUpdateSubscription!: Subscription;
  isFetching = false;

  constructor(private messagesService: MessagesService) {
  }

  ngOnInit(): void {
    this.messagesChangeSubscription = this.messagesService.messagesChange.subscribe(messages => {
      this.messages = messages;
      this.messagesUpdateSubscription = this.messagesService.receivingMessages().subscribe(messages => {
        this.messages = messages;
      });
    });
    this.messagesFetchingSubscription = this.messagesService.messagesFetching.subscribe(isFetching => {
      this.isFetching = isFetching;
    });

    this.messagesService.fetchMessages();
  }

  ngOnDestroy(): void {
    this.messagesFetchingSubscription.unsubscribe();
    this.messagesChangeSubscription.unsubscribe();
    this.messagesUpdateSubscription.unsubscribe();
  }

}
