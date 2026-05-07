import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ConversationStore, EventsStore } from '@kultur-hub/portal/domain';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-events-chat',
  imports: [ReactiveFormsModule, ButtonModule, TextareaModule, SkeletonModule],
  templateUrl: './events-chat.html',
  styleUrl: './events-chat.scss',
})
export class EventsChat {
  protected readonly eventsStore = inject(EventsStore);
  protected readonly conversationStore = inject(ConversationStore);

  protected readonly inputControl = inject(FormBuilder).nonNullable.control('');

  protected readonly messagesContainerRef = viewChild<ElementRef>('messagesContainer');

  constructor() {
    effect(() => {
      this.conversationStore.messages();
      setTimeout(() => {
        const el = this.messagesContainerRef()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      }, 0);
    });
  }

  protected async send(): Promise<void> {
    const text = this.inputControl.value.trim();
    if (!text || !this.eventsStore.selectedEventId()) return;
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
