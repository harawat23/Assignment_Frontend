import { Component, signal } from '@angular/core';
import { ShelfService } from '../../services/shelf.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShelfModel } from '../../models/Shelf';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shelf',
  imports: [CommonModule, FormsModule],
  templateUrl: './shelf.html',
  styleUrl: './shelf.css',
})
export class Shelf {
  shelfData = signal<ShelfModel[] | null>(null);
  errorMessage = "";
  loading = signal(false);
  searchValue=signal('');
  searchType=signal('shelfId')
  constructor(private shelfService: ShelfService,public router:Router) {

  }

  onSearch() {
    this.loading.set(true);
    this.shelfService.searchShelves(this.searchType(),this.searchValue()).subscribe({
      next: (result: ShelfModel[]) => {
        console.log(result);
        this.shelfData.set(result);
        this.loading.set(false);
      },
      error: (error:HttpErrorResponse) => {
        alert(error.error.message);
        this.loading.set(false);
      },
    });
  }

  navigateToShelfSummaryPage(id:string){
    this.router.navigate(['/shelf-summary',id]);
  }

  onSearchTypeChange(event:Event){
    const target = event.target as HTMLSelectElement; 
    if (target) {
      this.searchType.set(target.value); 
      console.log('Search type changed to:', this.searchType);
    }
  }
}
