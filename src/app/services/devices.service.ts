import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../api.config';
import { Observable } from 'rxjs';
import { DeviceModel } from '../models/Device';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private http:HttpClient;

  constructor(http:HttpClient){
    this.http=http;
  }

  getAllDevices(pageNum:number):Observable<DeviceModel[]>{
    return this.http.get<DeviceModel[]>(API_ENDPOINTS.device.getDevices(pageNum));
  }

  getDeviceById(id:string):Observable<DeviceModel>{
    return this.http.get<DeviceModel>(API_ENDPOINTS.device.byId(id));
  }
}
