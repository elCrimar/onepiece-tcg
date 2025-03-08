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
        // Crear un objeto limpio para los filtros
        const cleanFilters: any = {};
        
        // Solo agregar propiedades con valores no vacíos
        Object.entries(this.filters).forEach(([key, value]) => {
            // Solo incluir el filtro si tiene un valor no vacío
            if (value !== '' && value !== null && value !== undefined) {
                cleanFilters[key] = value;
            }
        });

        // Crear el objeto de búsqueda final
        const searchData = {
            ...(this.searchTerm ? { name: this.searchTerm } : {}),
            ...cleanFilters
        };

        console.log('Enviando filtros:', searchData);
        this.search.emit(searchData);
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
        console.log('Filtros reseteados, emitiendo evento de búsqueda vacía');
        this.onSearch();
    }
}