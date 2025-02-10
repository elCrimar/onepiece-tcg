import { Component, Input, Output, EventEmitter, HostListener, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements AfterViewInit {
  @Input() card?: Card;
  @Output() close = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  @ViewChild('modalBackground', { static: true }) modalBackground!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // Pone el foco en el fondo del modal para que se reciban los eventos de teclado.
    this.modalBackground.nativeElement.focus();
  }

  formatAbility(ability: string | undefined): string {
    if (!ability) return '';
    return ability.replace('[Counter]', '<span class="counter-badge">⚡Counter&nbsp</span>');
  }

  formatTrigger(trigger: string | undefined): string {
    if (!trigger) return '';
    return trigger.replace('[Trigger]', '<span class="trigger-badge">Trigger</span>');
  }

  closeModal(): void {
    this.close.emit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.previous.emit();
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.next.emit();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.close.emit();
      event.preventDefault();
    }
  }
}
