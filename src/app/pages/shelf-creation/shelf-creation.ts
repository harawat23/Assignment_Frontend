import { Component, signal } from '@angular/core';
import { ShelfModel } from '../../models/Shelf';
import { ShelfService } from '../../services/shelf.service';

@Component({
  selector: 'app-shelf-creation',
  imports: [],
  templateUrl: './shelf-creation.html',
  styleUrl: './shelf-creation.css',
})
export class ShelfCreation {
  saveDevice = signal(false);
   newShelf = {
    partNumber: signal(''),
    shelfName: signal('')
  };

  constructor(private shelfService:ShelfService){}

  validateShelfForm(): boolean {
    const errors: any = {};
    let isValid = true;

    if (!this.newShelf.partNumber().trim()) {
      errors.partNumber = 'Part Number is Required';
      isValid = false;
    }

    if (!this.newShelf.shelfName().trim()) {
      errors.shelfName = 'Shelf Name is Required';
      isValid = false;
    }

    return isValid;
  }

  saveShelfData() {
    this.shelfService.saveShelf(this.newShelf.shelfName(), this.newShelf.partNumber()).subscribe({
      next: (result) => {
        if (this.validateShelfForm()) {
          console.log("shelf saved successfully")
          console.log(result);
          this.newShelf.shelfName.set('');
          this.newShelf.partNumber.set('');
        }
      },
      error: (error) => {
        console.error("error Saving the shelf:", error)
      }
    })
  }
}
