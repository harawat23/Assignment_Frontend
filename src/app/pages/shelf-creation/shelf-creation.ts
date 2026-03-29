import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShelfService } from '../../services/shelf.service';
import { ShelfFieldsForm, ShelfFormValue } from '../../components/shelf-fields-form/shelf-fields-form';
 
@Component({
  selector: 'app-shelf-creation',
  imports: [ShelfFieldsForm],
  templateUrl: './shelf-creation.html',
  styleUrl: './shelf-creation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfCreation {
  private readonly destroyRef = inject(DestroyRef);
  private readonly shelfService = inject(ShelfService);
 
  readonly newShelf = signal<ShelfFormValue>({
    shelfName: '',
    partNumber: '',
  });
 
  validateShelfForm(): boolean {
    const formValue = this.newShelf();
    return !!(formValue.shelfName.trim() && formValue.partNumber.trim());
  }
 
  saveShelfData(): void {
    if (!this.validateShelfForm()) {
      return;
    }
 
    const formValue = this.newShelf();
    this.shelfService
      .saveShelf(formValue.shelfName, formValue.partNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          console.log('shelf saved successfully', result);
          this.newShelf.set({
            shelfName: '',
            partNumber: '',
          });
        },
        error: (error) => {
          console.error('error Saving the shelf:', error);
        },
      });
  }
 
  onShelfChange(updatedShelf: ShelfFormValue): void {
    this.newShelf.set(updatedShelf);
  }
}