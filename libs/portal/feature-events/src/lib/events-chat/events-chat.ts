import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ConversationStore, EventsStore } from '@kultur-hub/portal/domain';
import { MessageRole } from '@kultur-hub/shared/api';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-events-chat',
  imports: [ReactiveFormsModule, ButtonModule, TextareaModule],
  templateUrl: './events-chat.html',
  styleUrl: './events-chat.scss',
})
export class EventsChat {
  protected readonly eventsStore = inject(EventsStore);
  protected readonly conversationStore = inject(ConversationStore);
  protected readonly MessageRole = MessageRole;

  protected readonly inputControl = inject(FormBuilder).nonNullable.control('');

  protected readonly messagesContainerRef = viewChild<ElementRef>('messagesContainer');
  protected readonly textareaRef = viewChild<ElementRef>('textareaRef');

  private readonly lastMessageText = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.conversationStore.messages();
      setTimeout(() => {
        const el = this.messagesContainerRef()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      }, 0);
    });

    effect(() => {
      if (this.conversationStore.sendError() && this.lastMessageText()) {
        this.inputControl.setValue(this.lastMessageText()!);
        this.lastMessageText.set(null);
        setTimeout(() => {
          const el = this.textareaRef()?.nativeElement;
          if (el) {
            el.focus();
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
          }
        }, 0);
      }
    });
  }

  protected async send(): Promise<void> {
    const text = this.inputControl.value.trim();
    if (!text || !this.eventsStore.selectedEventId()) return;
    this.lastMessageText.set(text);
    this.inputControl.reset();
    await this.conversationStore.sendMessage(text);
  }

  protected onEnter(event: Event): void {
    if (!(event as KeyboardEvent).shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
}
