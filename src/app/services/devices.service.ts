import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../api.config';
import { Observable } from 'rxjs';
import { DeviceModel } from '../models/Device';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getAllDevices(pageNum: number): Observable<DeviceModel[]> {
    return this.http.get<DeviceModel[]>(API_ENDPOINTS.device.getDevices(pageNum));
  }

  getDeviceById(id: string): Observable<DeviceModel> {
    return this.http.get<DeviceModel>(API_ENDPOINTS.device.byId(id));
  }

  saveDevices(deviceName: string, deviceType: string, buildingName: string, partNumber: string): Observable<DeviceModel> {
    return this.http.post<DeviceModel>(API_ENDPOINTS.device.save, { deviceName: deviceName, deviceType: deviceType, buildingName: buildingName, partNumber: partNumber })
  }

  updateDevice(deviceId: string, deviceName: string, deviceType: string, buildingName: string, partNumber: string): Observable<DeviceModel> {
    const requestBody = {
      "deviceName":deviceName,
      "deviceType":deviceType,
      "buildingName":buildingName,
      "partNumber":partNumber,
    };

    console.log('Request Body:', requestBody);

    const headers = { 'Content-Type': 'application/json' };

    return this.http.put<DeviceModel>(API_ENDPOINTS.device.updateById(deviceId), requestBody,{headers});
  }

  deleteDevice(id:string){
    return this.http.delete<boolean>(API_ENDPOINTS.device.deleteById(id));
  }
}