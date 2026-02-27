import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../api.config';
import { Observable } from 'rxjs';
import { DeviceModel } from '../models/Device';
import { ShelfModel } from '../models/Shelf';

@Injectable({
    providedIn: 'root',
})
export class ShelfService {
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getAllShelfs(pageNum: number): Observable<ShelfModel[]> {
        return this.http.get<ShelfModel[]>(API_ENDPOINTS.shelf.getShelfs(pageNum));
    }

    getDeviceById(id: string): Observable<ShelfModel> {
        return this.http.get<ShelfModel>(API_ENDPOINTS.shelf.byId(id));
    }
}