import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ShelfModel } from '../../models/Shelf';
import { ShelfService } from '../../services/shelf.service';
import { ShelfFieldsForm, ShelfFormValue, ShelfMetaData } from '../../components/shelf-fields-form/shelf-fields-form';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-shelf-summary',
    imports: [ShelfFieldsForm],
    templateUrl: './shelf-summary.html',
    styleUrl: './shelf-summary.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfSummary {
    private readonly destroyRef = inject(DestroyRef);
    private readonly shelfService = inject(ShelfService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly shelf = signal<ShelfModel | null>(null);
    readonly shelfId = signal('');
    readonly editShelf = signal<ShelfFormValue>({
        shelfName: '',
        partNumber: ''
    });

    readonly shelfMetadata = signal<ShelfMetaData>({
        shelfId: '',
        createdAt: '',
        updatedAt: '',
        connectedDevice: null
    });

    ngOnInit(): void {
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (params) => {
                const shelfId = params['shelfId'];
                if (!shelfId) {
                    console.error('shelfId parameter is missing');
                    return;
                }

                this.shelfId.set(shelfId);
                this.fetchShelfDetails(shelfId);
            },
            error: (error) => {
                console.error('Error fetching route params:', error);
            },
        });
    }

    updateShelf(): void {
        const currentShelf = this.shelf();
        const formValue = this.editShelf();

        if (!currentShelf || !this.validateShelfForm()) {
            console.error('Validation failed or shelf is not loaded');
            return;
        }

        this.shelfService
            .updateShelf(currentShelf.shelfId, formValue.shelfName, formValue.partNumber)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (updatedShelf) => {
                    this.shelf.set(updatedShelf);
                    this.editShelf.set({
                        shelfName: updatedShelf.shelfName,
                        partNumber: updatedShelf.partNumber,
                    });
                    // console.log(this.shelf());
                    this.updateMetadata(updatedShelf);
                },
                error: (error) => {
                    console.error('Error updating shelf:', error);
                },
            });
    }

    deleteShelf(): void {
        const currentShelf = this.shelf();
        console.log("delete clicked")
        if (!currentShelf) {
            console.error('Shelf is not loaded');
            return;
        }

        this.shelfService
            .deleteShelf(currentShelf.shelfId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (deleted: boolean) => {
                    if (!deleted) {
                        this.shelfMetadata.set({
                            shelfId: '',
                            createdAt: '',
                            updatedAt: '',
                            connectedDevice: ''
                        });
                        this.editShelf.set({
                            shelfName: '',
                            partNumber: ''
                        });

                        alert('Shelf deleted successfully');
                    } else {
                        alert("failed to delete shelf");
                    }
                },
                error: (error: HttpErrorResponse) => {
                    alert(error.error.message);
                }

            });
    }

    onShelfChange(updatedShelf: ShelfFormValue): void {
        this.editShelf.set(updatedShelf);
    }

    private fetchShelfDetails(shelfId: string): void {
        this.shelfService
            .getDeviceById(shelfId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (shelf) => {
                    this.shelf.set(shelf);
                    console.log(shelf)
                    this.editShelf.set({
                        shelfName: shelf.shelfName,
                        partNumber: shelf.partNumber,
                    });
                    this.updateMetadata(shelf);
                },
                error: (error) => {
                    console.error('Error fetching shelf:', error);
                },
            });
    }

    private validateShelfForm(): boolean {
        const formValue = this.editShelf();
        return !!(formValue.shelfName.trim() && formValue.partNumber.trim());
    }

    private updateMetadata(shelf: ShelfModel): void {
        console.log(shelf.device);
        this.shelfMetadata.set({
            createdAt: shelf.createdAt,
            updatedAt: shelf.updatedAt,
            shelfId: shelf.shelfId,
            connectedDevice: shelf.device?.deviceId || ''
        });

        // console.log(this.shelfMetadata().connectedDevice)
    }
}