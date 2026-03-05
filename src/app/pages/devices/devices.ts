import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DevicesService } from '../../services/devices.service';
import { DeviceModel } from '../../models/Device';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-devices',
  standalone: true,
  templateUrl: './devices.html',
  styleUrls: ['./devices.css'],
  imports: [CommonModule, FormsModule],
})
export class Devices {
  deviceList = signal<DeviceModel[]>([]);
  errorMessage = "";
  searchType = signal("deviceId"); 
  searchValue = signal("");
  loading = signal<boolean>(false);

  constructor(private devicesService: DevicesService,public router:Router) { }

  onSearch() {
    if (!this.searchValue().trim()) {
      this.errorMessage = "Search value cannot be empty.";
      return;
    }

    this.loading.set(true);
    this.devicesService
      .searchDevices(this.searchType(), this.searchValue())
      .subscribe({
        next: (result: DeviceModel[]) => {
          console.log(result);
          this.deviceList.set(result);
          this.loading.set(false);
        },
        error: (error:HttpErrorResponse) => {
          console.error("Error occurred:", error);
          alert(error.error.message);
          this.loading.set(false);
        },
      });
  }

  navigateToDeviceSummaryPage(deviceId: string) {
    console.log(`Navigating to device summary page for Device ID: ${deviceId}`);
    this.router.navigate(['/device-summary', deviceId]);
  }

  onSearchTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement; 
    if (target) {
      this.searchType.set(target.value); 
      console.log('Search type changed to:', this.searchType);
    }
  }
}