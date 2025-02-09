import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
    searchTerm: string = '';
    @Output() search: EventEmitter<string> = new EventEmitter();

    onSearch(): void {
        this.search.emit(this.searchTerm);
    }
}
