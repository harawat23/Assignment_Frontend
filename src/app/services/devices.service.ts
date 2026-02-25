import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private http:HttpClient;

  constructor(http:HttpClient){
    this.http=http;
  }

  getAllDevices(pageNum:number){
    return this.http.get(API_ENDPOINTS.device.getDevices(pageNum));
  }

  getDeviceById(id:string){
    return this.http.get(API_ENDPOINTS.device.byId(id));
  }
}
