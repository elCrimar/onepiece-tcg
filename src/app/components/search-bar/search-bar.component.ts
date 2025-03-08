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
    
    // Para manejar el filtro de trigger
    triggerSelection: string = 'all';
    
    // Filtros adicionales
    filters = {
        rarity: '',
        type: '',
        cost: '',
        power: '',
        counter: '',
        color: '',
        family: '',
        trigger: '',
        empty_trigger: ''
    };

    @Output() search: EventEmitter<any> = new EventEmitter();

    // Método para actualizar los filtros de trigger según la selección
    updateTriggerFilter(): void {
        // Limpiar ambos filtros primero
        this.filters.trigger = '';
        this.filters.empty_trigger = '';
        
        // Establecer el filtro correspondiente según la selección
        if (this.triggerSelection === 'yes') {
            this.filters.trigger = 'trigger';
        } else if (this.triggerSelection === 'no') {
            this.filters.empty_trigger = 'true';
        }
        // Si es 'all', ambos permanecen vacíos
    }

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
        this.triggerSelection = 'all'; // Resetear también la selección de trigger
        
        this.filters = {
            rarity: '',
            type: '',
            cost: '',
            power: '',
            counter: '',
            color: '',
            family: '',
            trigger: '',
            empty_trigger: ''
        };
        
        console.log('Filtros reseteados, emitiendo evento de búsqueda vacía');
        this.onSearch();
    }
}