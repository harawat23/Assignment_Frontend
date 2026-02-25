import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DevicesService } from '../../services/devices.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.html',
  styleUrl: './devices.css',
})
export class Devices{
  private deviceService: DevicesService = inject(DevicesService);
  public response: WritableSignal<string> = signal('');

  deviceForm: FormGroup; 
  deviceData: any = null; 
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private devicesService: DevicesService) {
    this.deviceForm = this.fb.group({
      deviceId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]*$')]],
    });
   }

  fetchDeviceById() {
    if (this.deviceForm.valid) {
      const deviceId = this.deviceForm.value.deviceId;
      this.devicesService.getDeviceById(deviceId).subscribe(
        (response: any) => {
          this.deviceData = response; 
          console.log('Device fetched successfully:', this.deviceData);
        },
        (error) => {
          this.errorMessage = 'Failed to fetch device.';
          console.error('Error fetching device:', error);
        }
      );
    } else {
      this.errorMessage = 'Invalid Device ID. Please check and try again.';
    }
  }
}