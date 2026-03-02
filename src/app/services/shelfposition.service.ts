import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../api.config';
import { Observable } from 'rxjs';
import { DeviceModel } from '../models/Device';
import { ShelfModel } from '../models/Shelf';
import { ShelfPosition } from '../models/ShelfPosition';

@Injectable({
    providedIn: 'root',
})
export class ShelfPositionService {

    constructor(private http: HttpClient) { }

    getAllShelfPositions(pageNum:number):Observable<ShelfPosition[]>{
        return this.http.get<ShelfPosition[]>(API_ENDPOINTS.shelfPosition.getShelfPositions(pageNum));
    }

    attachShelf(shelfPosId:string,shelfId:string):Observable<ShelfPosition>{
        return this.http.put<ShelfPosition>(API_ENDPOINTS.shelfPosition.attachShelf(shelfPosId,shelfId),{});
    }

    detachShelf(shelfPosId:string,shelfId:string):Observable<ShelfPosition>{
        return this.http.put<ShelfPosition>(API_ENDPOINTS.shelfPosition.detachShelf(shelfPosId,shelfId),{});
    }

    deleteShelf(id:string){
        return this.http.delete<boolean>(API_ENDPOINTS.shelfPosition.deleteById(id));
    }

    addShelfPosition(id:String){
        return this.http.post<ShelfPosition>(API_ENDPOINTS.shelfPosition.save,{"deviceId":id});
    }
}