import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShelfService } from '../../services/shelf.service';
import { ShelfModel } from '../../models/Shelf';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shelf-summary',
  imports: [],
  templateUrl: './shelf-summary.html',
  styleUrl: './shelf-summary.css',
})
export class ShelfSummary {
  shelfData = signal<ShelfModel | null>(null);
  newShelf = signal({
    partNumber: "",
    shelfName: ""
  });

  constructor(private router: ActivatedRoute, private shelfService: ShelfService, private dialog: MatDialog) { }

  ngOnInit() {
    this.router.params.subscribe({
      next: (params) => {
        if (params["shelfId"]) {
          console.log(params["shelfId"]);
          this.getShelfbyId(params["shelfId"]);
        }
      },
      error: (error:HttpErrorResponse) => {
        console.log(error.error.message);
      }
    });
  }

  updateShelf() {
    if (this.shelfData() !== null) {
      this.shelfService.updateShelf(this.shelfData()?.shelfId as string, this.newShelf().shelfName, this.newShelf().partNumber).subscribe({
        next: (s: ShelfModel) => {
          const s1 = this.shelfData() as ShelfModel;
          s1.shelfName = s.shelfName;
          s1.updatedAt = s.updatedAt;
          s1.partNumber = s.partNumber;
          this.shelfData.set(s1);
          this.newShelf.set({ shelfName: s1.shelfName, partNumber: s1.partNumber });
          
          console.log("updated successfuly");
          
        },
        error: (error:HttpErrorResponse) => {
          alert(error.error.message);
        }
      })
    }
  }

  getShelfbyId(shelfId: string) {
    this.shelfService.getDeviceById(shelfId).subscribe({
      next: (result: ShelfModel) => {
        this.shelfData.set(result);
        console.log(this.shelfData());
        const s = this.newShelf();
        s.partNumber = this.shelfData()?.partNumber as string;
        s.shelfName = this.shelfData()?.shelfName as string;
        
      },
      error: (error:HttpErrorResponse) => {
        alert(error.error.message);
      },
    });
  }

  deleteShelf(shelfId: string | undefined) {
    if (shelfId === undefined) {
      alert("invalid shelf");
    } else if (this.shelfData() !== null) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      dialogRef.afterClosed().subscribe({
        next: (confirmed: boolean) => {
          if (confirmed) {
            const s = this.shelfData() as ShelfModel;
            this.shelfService.deleteShelf(shelfId).subscribe({
              next: (deleted: boolean) => {
                if (!deleted) {
                  this.shelfData.set(null);
                  this.newShelf.set({
                    shelfName: '',
                    partNumber: ''
                  });
                  
                  alert('Shelf deleted successfully');
                } else {
                  alert("failed to delete shelf");
                }
              },
              error: (error:HttpErrorResponse) => {
                alert(error.error.message);
              }
            })
          }
        },
        error: (error:HttpErrorResponse) => {
          alert(error.error.message);
        }
      })
    }
  }
}