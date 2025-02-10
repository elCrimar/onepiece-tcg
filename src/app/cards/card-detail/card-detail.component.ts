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
    return ability
    .replace('[Counter]', '<span class="counter-badge">⚡Counter&nbsp</span>')
    .replace('[Blocker]', '<span class="blocker-badge">Blocker</span>')
    .replace('[Rush]', '<span class="blocker-badge">Rush</span>')
    .replace('[On Play]', '<span class="blue-badge">On Play</span>')
    .replace('[When Attacking]', '<span class="blue-badge">When Attacking</span>')
    .replace('[Activate: Main]', '<span class="blue-badge">Activate: Main</span>')
    .replace('[Your Turn]', '<span class="blue-badge">Your Turn</span>')
    .replace('[On K.O.]', '<span class="blue-badge">On K.O.</span>')
    .replace('[Main]', '<span class="blue-badge">Main</span>')
    .replace("[On Your Opponent's Attack]", '<span class="blue-badge">On Your Opponent\'s Attack</span>')
    .replace("[On Block]", '<span class="blue-badge">On Block</span>')
    .replace('[DON!! x1]', '<span class="black-badge">DON!! x1</span>')
    .replace('[DON!! x2]', '<span class="black-badge">DON!! x2</span>')
    .replace('[DON!! x3]', '<span class="black-badge">DON!! x3</span>')
    .replace('[Once Per Turn]', '<span class="red-badge">Once Per Turn</span>')
    .replace('[Trigger]', '<span class="trigger-badge">Trigger</span>')
    .replace('➀', '<span class="don-number">①</span>')
    .replace('➁', '<span class="don-number">②</span>')
    .replace('③', '<span class="don-number">③</span>')
    .replace('➃', '<span class="don-number">④</span>');
  }

  formatTrigger(trigger: string | undefined): string {
    if (!trigger) return '';
    return trigger.replace('[Trigger]', '<span class="trigger-badge">Trigger</span>');
  }

  getIndicatorColor(color?: string): string {
    if (!color) {
      return 'transparent';
    }
    
    if (color.includes('/')) {
      const colors = color.split('/');
      if (colors.length === 2) {
        const c1 = colors[0].trim();
        const c2 = colors[1].trim();
        return `linear-gradient(90deg, ${c1} 50%, ${c2} 50%)`;
      }
    }
    
    return color;
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
