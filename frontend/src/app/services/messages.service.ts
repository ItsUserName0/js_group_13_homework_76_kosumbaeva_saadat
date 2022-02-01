import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messages: Message[] = [];
  messagesChange = new Subject<Message[]>();
  messagesFetching = new Subject<boolean>();
  messageUploading = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  fetchMessages() {
    this.messagesFetching.next(true);
    this.http.get<[message: Message]>(`${environment.apiUrl}/messages`)
      .pipe(map(result => {
        return result.map(item => {
          return new Message(item.message, item.author, item.datetime, item.id);
        });
      }))
      .subscribe({
        next: (result => {
          this.messages = result;
          this.messagesFetching.next(false);
          this.messagesChange.next(result);
        }),
        error: (() => {
          this.messagesFetching.next(false);
        })
      });
  }

  receivingMessages() {
    return new Observable<Message[]>((subscriber) => {
      const interval = setInterval(() => {
        if (this.messages.length === 0) return;
        this.http.get<[message: Message]>(`${environment.apiUrl}/messages?datetime=${this.messages[this.messages.length - 1].datetime}`).pipe(
          map(result => {
            if (result.length > 0) {
              return result.map(item => {
                return new Message(item.message, item.author, item.datetime, item.id);
              });
            }
            return result;
          })
        ).subscribe(result => {
          this.messages = this.messages.concat(result);
          if (this.messages.length > 30) {
            this.messages = this.messages.slice(result.length);
          }
          subscriber.next(this.messages.slice());
        })
      }, 2000);
      return {
        unsubscribe() {
          clearInterval(interval);
        }
      }
    });
  }

  sendMessage(message: Message) {
    const body = {
      author: message.author,
      message: message.message
    };
    this.messageUploading.next(true);
    return this.http.post(`${environment.apiUrl}/messages/new`, body).pipe(
      tap({
        next: () => {
          this.messageUploading.next(false);
        },
        error: () => {
          this.messageUploading.next(false);
        }
      })
    );
  }

}
