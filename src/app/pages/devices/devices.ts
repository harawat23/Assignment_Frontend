import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { DevicesService } from '../../services/devices.service';
import { DeviceModel } from '../../models/Device';
import { SearchFormCard } from '../../components/search-form-card/search-form-card';
import { Router } from '@angular/router';
 
type DeviceSearchField = 'deviceName' | 'deviceType' | 'buildingName' | 'partNumber' | 'deviceId';
 
@Component({
  selector: 'app-devices',
  templateUrl: './devices.html',
  styleUrls: ['./devices.css'],
  imports: [CommonModule, SearchFormCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Devices {
  private readonly destroyRef = inject(DestroyRef);
  private readonly devicesService = inject(DevicesService);
 
  readonly searchField = signal<DeviceSearchField>('deviceName');
  readonly searchValue = signal('');
  readonly searchFieldOptions = [
    { label: 'Device Name', value: 'deviceName' },
    { label: 'Device Type', value: 'deviceType' },
    { label: 'Building Name', value: 'buildingName' },
    { label: 'Part Number', value: 'partNumber' },
    { label: 'Device Id', value:'deviceId'}
  ];
 
  readonly filteredDevices = signal<DeviceModel[]>([]);
  readonly errorMessage = signal('');
  readonly loading = signal(false);

  constructor(public router:Router){}
 
  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set('');
 
    this.devicesService.searchDevices(this.searchField(),this.searchValue()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (devices: DeviceModel[]) => {
        this.filteredDevices.set(devices);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error occurred:', error);
        this.errorMessage.set('Failed to fetch device data.');
        this.filteredDevices.set([]);
        this.loading.set(false);
      },
    });
  }
 
  onSearchValueChange(value: string): void {
    this.searchValue.set(value);
  }
 
  onSearchFieldChange(value: string): void {
    this.searchField.set(value as DeviceSearchField);
  }

  navigate(id:string){
    this.router.navigate(['/device-summary', id]);
  }
}