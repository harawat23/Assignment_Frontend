import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShelfService } from '../../services/shelf.service';
import { CommonModule } from '@angular/common';
import { ShelfModel } from '../../models/Shelf';
import { SearchFormCard } from '../../components/search-form-card/search-form-card';
import { Router } from '@angular/router';
 
type ShelfSearchField = 'shelfName' | 'partNumber' | 'shelfId';
 
@Component({
  selector: 'app-shelf',
  imports: [CommonModule, SearchFormCard],
  templateUrl: './shelf.html',
  styleUrl: './shelf.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shelf {
  private readonly destroyRef = inject(DestroyRef);
  private readonly shelfService = inject(ShelfService);
 
  readonly searchField = signal<ShelfSearchField>('shelfName');
  readonly searchValue = signal('');
  readonly searchFieldOptions = [
    { label: 'Shelf Name', value: 'shelfName' },
    { label: 'Part Number', value: 'partNumber' },
    { label: 'Shelf ID', value: 'shelfId' },
  ];
 
  readonly filteredShelves = signal<ShelfModel[]>([]);
  readonly errorMessage = signal('');
  readonly loading = signal(false);

  constructor(public route:Router){}
 
  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set('');
 
    this.shelfService.searchShelves(this.searchField(),this.searchValue()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (shelves: ShelfModel[]) => {
        this.filteredShelves.set(shelves);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error occurred:', error);
        this.errorMessage.set('Failed to fetch shelf data.');
        this.filteredShelves.set([]);
        this.loading.set(false);
      },
    });
  }
 
  onSearchValueChange(value: string): void {
    this.searchValue.set(value);
  }
 
  onSearchFieldChange(value: string): void {
    this.searchField.set(value as ShelfSearchField);
  }

  navigate(id:string){
    this.route.navigate(["/device-summary",id])
  }
}