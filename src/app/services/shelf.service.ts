import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../api.config';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ShelfModel } from '../models/Shelf';

@Injectable({
    providedIn: 'root',
})
export class ShelfService {
    private http: HttpClient;
    private readonly shelfDataSubject = new BehaviorSubject<ShelfModel[] | null>(null);
    public readonly shelfData$ = this.shelfDataSubject.asObservable();

    private readonly numberOfShelvesSubject = new BehaviorSubject<number>(0);
    public readonly numberOfShelves$ = this.numberOfShelvesSubject.asObservable();

    constructor(http: HttpClient) {
        this.http = http;
    }

    updatenumberOfShelves() {
        this.http.get<number>(API_ENDPOINTS.shelf.getNumberOfShelves).pipe(
            tap((n) => { this.numberOfShelvesSubject.next(n); })
        ).subscribe();
    }

    private update_insert_shelf(shelf: ShelfModel): void {
        if (this.shelfDataSubject.value !== null) {
            const currentShelfs = this.shelfDataSubject.value;
            const existingIndex = currentShelfs?.findIndex((currentShelf) => currentShelf.shelfId === shelf.shelfId);

            if (existingIndex === -1) {
                this.shelfDataSubject.next([shelf, ...currentShelfs]);
                return;
            }

            const updatedShelfs = [...currentShelfs];
            updatedShelfs[existingIndex] = shelf;
            this.shelfDataSubject.next(updatedShelfs);
        }
    }

    private mergeShelfs(shelfs: ShelfModel[]): void {
        const mergedMap = new Map<string, ShelfModel>();

        if (this.shelfDataSubject.value !== null) {
            for (const shelf of this.shelfDataSubject.value) {
                mergedMap.set(shelf.shelfId, shelf);
            }
        }

        for (const shelf of shelfs) {
            mergedMap.set(shelf.shelfId, shelf);
        }

        this.shelfDataSubject.next(Array.from(mergedMap.values()));
    }

    getAllShelfs(pageNum: number): Observable<ShelfModel[]> {
        return this.http.get<ShelfModel[]>(API_ENDPOINTS.shelf.getShelfs(pageNum)).pipe(
            tap((shelfs) => {
                this.mergeShelfs(shelfs);
                this.updatenumberOfShelves();
            })
        );
    }

    getDeviceById(id: string): Observable<ShelfModel> {
        return this.http.get<ShelfModel>(API_ENDPOINTS.shelf.byId(id)).pipe(
            tap((shelf) => {
                this.update_insert_shelf(shelf);
            })
        );
    }

    saveShelf(shelfName: string, partNumber: string): Observable<ShelfModel> {
        return this.http.post<ShelfModel>(API_ENDPOINTS.shelf.save, { shelfName: shelfName, partNumber: partNumber }).pipe(
            tap((createdShelf) => {
                this.update_insert_shelf(createdShelf);
                this.updatenumberOfShelves();
            })
        );
    }

    updateShelf(id: string, shelfName: string, partNumber: string) {
        const requestBody = { "shelfName": shelfName, "partNumber": partNumber };
        const headers = { 'Content-Type': 'application/json' };

        return this.http.put<ShelfModel>(API_ENDPOINTS.shelf.updateById(id), requestBody).pipe(
            tap((updatedShelf) => {
                this.update_insert_shelf(updatedShelf)
            })
        );
    }

    deleteShelf(id: string) {
        return this.http.delete<boolean>(API_ENDPOINTS.shelf.deleteById(id)).pipe(
            tap((isDeleted) => {
                if (!isDeleted && this.shelfDataSubject.value !== null) {
                    return;
                } else {
                    const a = this.shelfDataSubject.value as ShelfModel[];
                    const filterShelfs = a.filter((shelf) => { shelf.shelfId !== id });
                    this.shelfDataSubject.next(filterShelfs);
                    this.updatenumberOfShelves();
                }
            })
        );
    }
}