import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../api.config';
import { Observable } from 'rxjs';
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

    saveShelf(shelfName:string,partNumber:string):Observable<ShelfModel>{
        return this.http.post<ShelfModel>(API_ENDPOINTS.shelf.save,{shelfName:shelfName,partNumber:partNumber});
    }

    updateShelf(id:string,shelfName:string,partNumber:string){
        const requestBody={"shelfName":shelfName,"partNumber":partNumber};
        const headers={'Content-Type': 'application/json' };

        return this.http.put<ShelfModel>(API_ENDPOINTS.shelf.updateById(id),requestBody);
    }

    deleteShelf(id:string){
        return this.http.delete<boolean>(API_ENDPOINTS.shelf.deleteById(id));
    }
}