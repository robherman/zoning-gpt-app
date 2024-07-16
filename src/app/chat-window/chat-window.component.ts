import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent implements AfterViewChecked {
  @Input() selectedState: string = '';
  @Input() selectedCounty: string = '';
  @ViewChild('chatMessagesContainer') private messagesContainer!: ElementRef;

  chatMessages: string[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  constructor(private apiService: ApiService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedState && this.selectedCounty) {
      const userMessage = this.newMessage.trim();
      this.chatMessages.push(`${userMessage}`);
      this.newMessage = '';
      this.isLoading = true;

      // Scroll to bottom after adding user message
      setTimeout(() => this.scrollToBottom(), 0);

      this.apiService
        .sendChatMessage(userMessage, this.selectedState, this.selectedCounty)
        .subscribe({
          next: (response: string) => {
            this.chatMessages.push(`Zoning-GPT: ${response}`);
            this.isLoading = false;
            // Scroll to bottom after adding bot message
            setTimeout(() => this.scrollToBottom(), 0);
          },
          error: (error) => {
            console.error('Error sending message:', error);
            this.chatMessages.push(
              'Error: Failed to get a response. Please try again.'
            );
            this.isLoading = false;
            // Scroll to bottom after adding error message
            setTimeout(() => this.scrollToBottom(), 0);
          },
        });
    }
  }
}
