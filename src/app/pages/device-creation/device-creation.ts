import { Component, signal } from '@angular/core';
import { DeviceModel } from '../../models/Device';
import { DevicesService } from '../../services/devices.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-device-creation',
  imports: [],
  templateUrl: './device-creation.html',
  styleUrl: './device-creation.css',
})
export class DeviceCreation {
  page_device: number = 0;
  page_shelf: number = 0;
  loading = signal(false);
  deviceList = signal<DeviceModel[] | null>(null);
  deviceOrShelf = signal('device');

  newDevice = {
    deviceName: signal(''),
    deviceType: signal(''),
    buildingName: signal(''),
    partNumber: signal(''),
  };

  constructor(private deviceService:DevicesService,private cdr:ChangeDetectorRef){}

  validateDeviceForm(): boolean {
    const errors: any = {};
    let isValid = true;

    if (!this.newDevice.deviceName().trim()) {
      errors.deviceName = 'Device Name is required';
      isValid = false;
    }

    if (!this.newDevice.deviceType().trim()) {
      errors.deviceType = 'Device Type is required';
      isValid = false;
    }

    if (!this.newDevice.buildingName().trim()) {
      errors.buildingName = 'Building Name is required';
      isValid = false;
    }

    if (!this.newDevice.partNumber().trim()) {
      errors.partNumber = 'Part Number is required';
      isValid = false;
    }

    return isValid;
  }

  saveDeviceData() {
    if (this.validateDeviceForm()) {

      this.deviceService.saveDevices(this.newDevice.deviceName(), this.newDevice.buildingName(), this.newDevice.deviceType(), this.newDevice.partNumber()).subscribe({
        next: (result) => {
          console.log('Device saved successfully:', result);
          this.newDevice.deviceName.set('');
          this.newDevice.deviceType.set('');
          this.newDevice.buildingName.set('');
          this.newDevice.partNumber.set('');
        },
        error: (error:HttpErrorResponse) => {
          alert(error.error.message);
        },
      });
    }
  }
}
