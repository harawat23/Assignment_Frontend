import { Component, signal, WritableSignal } from '@angular/core';
import { DeviceModel } from '../../models/Device';
import { ShelfModel } from '../../models/Shelf';
import { DevicesService } from '../../services/devices.service'; import { ActivatedRoute, Router } from '@angular/router';
;

@Component({
  selector: 'app-device-update',
  imports: [],
  templateUrl: './device-summary.html',
  styleUrl: './device-summary.css',
})
export class DeviceSummary {
  newDevice = signal({
    deviceName: '',
    deviceType: '',
    buildingName: '',
    partNumber: '',
  });

  deviceId = '';

  device = signal<DeviceModel | null>(null);

  constructor(private deviceService: DevicesService, public router: ActivatedRoute) { }

  validateDeviceForm(): boolean {
    const errors: any = {};
    let isValid = true;

    if (!this.newDevice().deviceName.trim()) {
      errors.deviceName = 'Device Name is required';
      isValid = false;
    }

    if (!this.newDevice().deviceType.trim()) {
      errors.deviceType = 'Device Type is required';
      isValid = false;
    }

    if (!this.newDevice().buildingName.trim()) {
      errors.buildingName = 'Building Name is required';
      isValid = false;
    }

    if (!this.newDevice().partNumber.trim()) {
      errors.partNumber = 'Part Number is required';
      isValid = false;
    }
    return isValid;
  }

  updateDevice() {
    if (this.validateDeviceForm() && (this.device() !== null)) {
      this.deviceService.updateDevice(this.device()?.deviceId as string, this.newDevice().deviceName, this.newDevice().deviceType,
        this.newDevice().buildingName, this.newDevice().partNumber).subscribe({
          next: (result: DeviceModel) => {
            console.log("device updated successfully");
            console.log(result);
          }, error: (error) => {
            console.log(error);
          }
        });

    } else {
      console.log(this.newDevice());
    }
  }

  ngOnInit() {
    this.router.params.subscribe({
      next: (params) => {
        console.log(params);
        const deviceId = params['deviceId'];
        if (deviceId) {
          this.deviceService.getDeviceById(deviceId).subscribe({
            next: (d: DeviceModel) => {
              this.device.set(d);
              console.log(JSON.stringify(d));
              this.newDevice().deviceName = this.device()?.deviceName as string;
              this.newDevice().deviceType = this.device()?.deviceType as string;
              this.newDevice().buildingName = this.device()?.buildingName as string;
              this.newDevice().partNumber = this.device()?.partNumber as string;
            },
            error: (error) => {
              console.error('Error fetching device:', error);
            },
          });
        } else {
          console.error('deviceId parameter is missing');
        }
      },
      error: (error) => {
        console.error('Error fetching route params:', error);
      },
    });
  }
}
