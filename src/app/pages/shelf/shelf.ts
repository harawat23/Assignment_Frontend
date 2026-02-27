import { Component, signal } from '@angular/core';
import { ShelfService } from '../../services/shelf.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShelfModel } from '../../models/Shelf';

@Component({
  selector: 'app-shelf',
  imports: [CommonModule, FormsModule],
  templateUrl: './shelf.html',
  styleUrl: './shelf.css',
})
export class Shelf {
  shelfData = signal<ShelfModel | null>(null);
  errorMessage = "";
  shelfId = signal("");
  loading = signal(false);

  constructor(private shelfService: ShelfService) {

  }

  onSubmit() {
    this.loading.set(true);
    this.shelfService.getDeviceById(this.shelfId()).subscribe({
      next: (result: ShelfModel) => {
        console.log(result);
        this.shelfData.set(result);
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error occurred:", error);
        this.errorMessage = "Failed to fetch device data.";
        this.loading.set(false);
      },
    });
  }

  setValue(val: string) {
    this.shelfId.set(val);
    console.log(this.shelfId());
  }
}
