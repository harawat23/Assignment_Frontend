import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ShelfPosition } from '../../models/ShelfPosition';
 
@Component({
    selector: 'app-shelf-positions-table',
    imports: [],
    templateUrl: './shelf-positions-table.html',
    styleUrl: './shelf-positions-table.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfPositionsTable {
    readonly shelfPositions = input<ShelfPosition[] | null>([]);
    readonly interactive = input(false);
 
    readonly attachShelfRequested = output<{ index: number; shelfId: string }>();
    readonly detachShelfRequested = output<{ index: number; shelfId: string }>();
    readonly deleteShelfRequested = output<number>();
 
    protected readonly attachFormIndex = signal<number | null>(null);
 
    protected openAttachForm(index: number): void {
        this.attachFormIndex.set(index);
    }
 
    protected closeAttachForm(): void {
        this.attachFormIndex.set(null);
    }
 
    protected requestAttach(index: number, shelfId: string): void {
        const value = shelfId.trim();
        if (!value) {
            return;
        }
 
        this.attachShelfRequested.emit({ index, shelfId: value });
        this.closeAttachForm();
    }
 
    protected requestDetach(index: number, shelfId: string): void {
        this.detachShelfRequested.emit({ index, shelfId });
    }
 
    protected requestDelete(index: number): void {
        this.deleteShelfRequested.emit(index);
    }
}