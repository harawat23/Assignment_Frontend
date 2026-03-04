import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../api.config';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DeviceModel } from '../models/Device';
import { pipe, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private http: HttpClient;
  private readonly devicesSubject = new BehaviorSubject<DeviceModel[]>([]);
  public readonly devices$ = this.devicesSubject.asObservable();

  private readonly numberOfDevicesSubject = new BehaviorSubject<number>(0);
  public readonly numberOfDevices$ = this.numberOfDevicesSubject.asObservable();

  constructor(http: HttpClient) {
    this.http = http;
  }

  private update_insert_device(device: DeviceModel): void {
    const currentDevices = this.devicesSubject.value;
    const existingIndex = currentDevices.findIndex((currentDevice) => currentDevice.deviceId === device.deviceId);

    if (existingIndex === -1) {
      this.devicesSubject.next([device, ...currentDevices]);
      return;
    }

    const updateDevices = [...currentDevices];
    updateDevices[existingIndex] = device;
    this.devicesSubject.next(updateDevices);
  }

  private mergeDevices(devices: DeviceModel[]): void {
    const mergedMap = new Map<string, DeviceModel>();

    for (const device of this.devicesSubject.value) {
      mergedMap.set(device.deviceId, device);
    }

    for (const device of devices) {
      mergedMap.set(device.deviceId, device);
    }

    this.devicesSubject.next(Array.from(mergedMap.values()));
  }

  updateNumberOfDevices() {
    this.http.get<number>(API_ENDPOINTS.device.getNumberOfDevices).pipe(
      tap((n) => { this.numberOfDevicesSubject.next(n); })
    ).subscribe();
  }

  getAllDevices(pageNum: number): Observable<DeviceModel[]> {
    return this.http.get<DeviceModel[]>(API_ENDPOINTS.device.getDevices(pageNum)).pipe(
      tap((devices) => { this.devicesSubject.next(devices); this.updateNumberOfDevices() })
    );
  }

  getDeviceById(id: string): Observable<DeviceModel> {
    return this.http.get<DeviceModel>(API_ENDPOINTS.device.byId(id)).pipe(tap((device) => { this.update_insert_device(device); }));
  }

  saveDevices(deviceName: string, deviceType: string, buildingName: string, partNumber: string): Observable<DeviceModel> {
    return this.http.post<DeviceModel>(API_ENDPOINTS.device.save, { deviceName: deviceName, deviceType: deviceType, buildingName: buildingName, partNumber: partNumber }).pipe(tap((createdDevice) => { this.update_insert_device(createdDevice); this.updateNumberOfDevices(); }))
  }

  updateDevice(deviceId: string, deviceName: string, deviceType: string, buildingName: string, partNumber: string): Observable<DeviceModel> {
    const requestBody = {
      "deviceName": deviceName,
      "deviceType": deviceType,
      "buildingName": buildingName,
      "partNumber": partNumber,
    };

    console.log('Request Body:', requestBody);

    const headers = { 'Content-Type': 'application/json' };

    return this.http.put<DeviceModel>(API_ENDPOINTS.device.updateById(deviceId), requestBody, { headers }).pipe(tap((updatedDvice) => { this.update_insert_device(updatedDvice); }));
  }

  deleteDevice(id: string) {
    return this.http.delete<boolean>(API_ENDPOINTS.device.deleteById(id)).pipe(tap((isDeleted) => {
      if (!isDeleted) {
        return;
      }

      const filteredDevices = this.devicesSubject.value.filter((device) => device.deviceId !== id);
      this.devicesSubject.next(filteredDevices);
      this.updateNumberOfDevices();
    }));
  }

  searchDevices(searchType: string, searchValue: string): Observable<DeviceModel[]> {
    if (searchType === "deviceId") {
      const url = API_ENDPOINTS.device.byId(searchValue);
      return this.http.get<DeviceModel>(url).pipe(
        map((device) => [device])
      );
    } else if (searchType === "deviceName") {
      const url = API_ENDPOINTS.device.getByDeviceName(searchValue);
      return this.http.get<DeviceModel[]>(url);
    } else if (searchType === "deviceType") {
      const url = API_ENDPOINTS.device.getByDeviceType(searchValue);
      return this.http.get<DeviceModel[]>(url);
    } else if (searchType === "buildingName") {
      const url = API_ENDPOINTS.device.getByBuildingName(searchValue);
      return this.http.get<DeviceModel[]>(url);
    } else {
      const url = API_ENDPOINTS.device.getDeviceByPartNumber(searchValue)
      return this.http.get<DeviceModel[]>(url);
    }
  }
}