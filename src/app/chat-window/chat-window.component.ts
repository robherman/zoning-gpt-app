import { Component, Input } from '@angular/core';
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
export class ChatWindowComponent {
  @Input() selectedState?: string = '';
  @Input() selectedCounty?: string = '';

  chatMessages: string[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  constructor(private apiService: ApiService) {}

  sendMessage() {
    if (this.newMessage.trim() && this.selectedState && this.selectedCounty) {
      const userMessage = this.newMessage.trim();
      this.chatMessages.push(`You: ${userMessage}`);
      this.newMessage = '';
      this.isLoading = true;

      this.apiService
        .sendChatMessage(userMessage, this.selectedState, this.selectedCounty)
        .subscribe({
          next: (response: string) => {
            this.chatMessages.push(`Zoning GPT: ${response}`);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error sending message:', error);
            this.chatMessages.push(
              'Error: Failed to get a response. Please try again.'
            );
            this.isLoading = false;
          },
        });
    }
  }
}
