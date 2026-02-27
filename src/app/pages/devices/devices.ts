import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DevicesService } from '../../services/devices.service';
import { DeviceModel } from '../../models/Device';
import { ShelfPosition } from '../../models/ShelfPosition';

@Component({
  selector: 'app-devices',
  standalone: true,
  templateUrl: './devices.html',
  styleUrls: ['./devices.css'],
  imports: [CommonModule, FormsModule],
})
export class Devices {
  deviceData = signal<DeviceModel | null>(null);
  errorMessage = "";
  deviceId = signal<string>("");
  loading = signal<boolean>(false);
  shelfPositions = signal<ShelfPosition[] | null>(null);

  constructor(private devicesService: DevicesService) { }

  onSubmit() {
    this.loading.set(true);
    this.devicesService.getDeviceById(this.deviceId()).subscribe({
      next: (result: DeviceModel) => {
        console.log(result);
        this.deviceData.set(result);
        this.loading.set(false);
        this.shelfPositions.set(this.deviceData()?.shelfPosition || null);
      },
      error: (error) => {
        console.error("Error occurred:", error);
        this.errorMessage = "Failed to fetch device data.";
        this.loading.set(false);
      },
    });
  }

  setValue(val: string) {
    this.deviceId.set(val);
    console.log(this.deviceId());
  }
}