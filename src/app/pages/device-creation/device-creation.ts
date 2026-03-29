import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DevicesService } from '../../services/devices.service';
import { DeviceFieldsForm , DeviceFormValue} from '../../components/device-fields-form/device-fields-form';
import { HttpErrorResponse } from '@angular/common/http';
 
@Component({
  selector: 'app-device-creation',
  imports: [DeviceFieldsForm],
  templateUrl: './device-creation.html',
  styleUrl: './device-creation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceCreation {
  private readonly destroyRef = inject(DestroyRef);
  private readonly deviceService = inject(DevicesService);
 
  readonly newDevice = signal<DeviceFormValue>({
    deviceName: '',
    deviceType: '',
    buildingName: '',
    partNumber: '',
  });
 
  validateDeviceForm(): boolean {
    const formValue = this.newDevice();
    return !!(
      formValue.deviceName.trim() &&
      formValue.deviceType.trim() &&
      formValue.buildingName.trim() &&
      formValue.partNumber.trim()
    );
  }
 
  saveDeviceData(): void {
    if (this.validateDeviceForm()) {
      const formValue = this.newDevice();
      this.deviceService
        .saveDevices(formValue.deviceName, formValue.deviceType, formValue.buildingName, formValue.partNumber)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result) => {
            console.log('Device saved successfully:', result);
            this.newDevice.set({
              deviceName: '',
              deviceType: '',
              buildingName: '',
              partNumber: '',
            });
          },
          error: (error:HttpErrorResponse) => {
            console.error('Error saving device:', error);
            alert(error.error)
          },
        });
    }
  }
 
  onDeviceChange(updatedDevice: DeviceFormValue): void {
    this.newDevice.set(updatedDevice);
  }
}