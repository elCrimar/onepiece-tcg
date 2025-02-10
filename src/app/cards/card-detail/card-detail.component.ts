import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent {
  @Input() card?: Card;
  @Output() close = new EventEmitter<void>();

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
}
