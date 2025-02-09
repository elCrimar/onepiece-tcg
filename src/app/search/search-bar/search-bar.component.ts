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
    // Campo principal para búsqueda por nombre
    searchTerm: string = '';
    
    // Filtros adicionales
    filters = {
        rarity: '',
        type: '',
        cost: '',
        power: '',
        counter: '',
        color: '',
        family: '',
        trigger: ''
    };

    @Output() search: EventEmitter<any> = new EventEmitter();

    onSearch(): void {
        // Se emite el filtro trigger sin conversión, ya es string
        this.search.emit({
            name: this.searchTerm,
            ...this.filters
        });
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.filters = {
            rarity: '',
            type: '',
            cost: '',
            power: '',
            counter: '',
            color: '',
            family: '',
            trigger: ''
        };
        this.onSearch();
    }
}