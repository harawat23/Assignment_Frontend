import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeviceModel } from '../../models/Device';
import { DevicesService } from '../../services/devices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShelfPosition } from '../../models/ShelfPosition';
import { ShelfPositionService } from '../../services/shelfposition.service';
import { DeviceFieldsForm , DeviceFormValue, DeviceMetaData} from '../../components/device-fields-form/device-fields-form';
import { ShelfPositionsTable } from '../../components/shelf-positions-table/shelf-positions-table';
import { catchError, of, switchMap } from 'rxjs';
 
@Component({
  selector: 'app-device-update',
  imports: [DeviceFieldsForm, ShelfPositionsTable],
  templateUrl: './device-summary.html',
  styleUrl: './device-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceSummary {
  private readonly destroyRef = inject(DestroyRef);
  private readonly deviceService = inject(DevicesService);
  private readonly shelfPositionService = inject(ShelfPositionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
 
  readonly newDevice = signal<DeviceFormValue>({
    deviceName: '',
    deviceType: '',
    buildingName: '',
    partNumber: '',
  });
 
  readonly deviceId = signal('');
  readonly device = signal<DeviceModel | null>(null);
  readonly shelfPositions = signal<ShelfPosition[] | null>(null);
 
  readonly deviceMetadata = signal<DeviceMetaData>({
    deviceId: '',
    createdAt: '',
    updatedAt: '',
    numberOfShelfPositions: 0,
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
 
  updateDevice(): void {
    if (this.validateDeviceForm() && this.device() !== null) {
      const deviceId = this.device()?.deviceId as string;
      const { deviceName, deviceType, buildingName, partNumber } = this.newDevice();
 
      this.deviceService
        .updateDevice(deviceId, deviceName, deviceType, buildingName, partNumber)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: (result: DeviceModel) => {
            this.device.set(result);
            this.updateMetadata(result);
          },
          error: (error) => {
            console.error('Error updating device:', error);
          },
        });
    } else {
      console.error('Validation failed or device is null');
    }
  }
 
  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => {
        const deviceId = params['deviceId'];
        if (deviceId) {
          this.deviceId.set(deviceId);
          this.fetchDeviceDetails(deviceId);
        } else {
          console.error('deviceId parameter is missing');
        }
      },
      error: (error) => {
        console.error('Error fetching route params:', error);
      },
    });
  }
 
  deleteDevice(): void {
    const currentDevice = this.device();
    if (!currentDevice) {
      console.error('Device is not loaded');
      return;
    }
 
    this.deviceService
      .deleteDevice(currentDevice.deviceId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error deleting device:', error);
        },
      });
  }
 
  private fetchDeviceDetails(deviceId: string): void {
    this.deviceService.getDeviceById(deviceId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (device: DeviceModel) => {
        this.device.set(device);
        this.newDevice.set({
          deviceName: device.deviceName,
          deviceType: device.deviceType,
          buildingName: device.buildingName,
          partNumber: device.partNumber,
        });
        this.shelfPositions.set(device.shelfPosition || []);
        this.updateMetadata(device);
      },
      error: (error) => {
        console.error('Error fetching device:', error);
      },
    });
  }
 
  attachShelf(payload: { index: number; shelfId: string }): void {
    if (this.shelfPositions() !== null) {
      const shelfPosition = this.shelfPositions() as ShelfPosition[];
      this.shelfPositionService
        .attachShelf(shelfPosition[payload.index].shelfPosId, payload.shelfId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updatedShelf: ShelfPosition) => {
            this.updateShelfPosition(payload.index, updatedShelf);
          },
          error: (error) => {
            console.error('Error attaching shelf:', error);
            alert(error.error);
          },
        });
    }
  }
 
  detachShelf(payload: { index: number; shelfId: string }): void {
    const shelfPosition = this.shelfPositions() as ShelfPosition[];
    this.shelfPositionService
      .detachShelf(shelfPosition[payload.index].shelfPosId, payload.shelfId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedShelf: ShelfPosition) => {
          this.updateShelfPosition(payload.index, updatedShelf);
        },
        error: (error) => {
          console.error('Error attaching shelf:', error);
        },
      });
  }
 
  addShelfPosition(): void {
    if (this.device() !== null) {
      const id = this.device()?.deviceId as string;
      this.shelfPositionService.addShelfPosition(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (sp: ShelfPosition) => {
          this.shelfPositions.update((positions) => [...(positions || []), sp]);
 
          const currentDevice = this.device() as DeviceModel;
          this.fetchDeviceDetails(currentDevice.deviceId);
        },
        error: (error) => {
          console.log('failed to add device : ', error);
        }
      });
    } else {
      console.log('device is null');
    }
  }
  deleteShelf(index: number): void {
    const shelfPosition = this.shelfPositions() as ShelfPosition[];
    const currentDevice = this.device() as DeviceModel;
 
    this.shelfPositionService.deleteShelf(shelfPosition[index].shelfPosId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (successfully: Boolean) => {
        if (!successfully) {
          this.fetchDeviceDetails(currentDevice.deviceId);
        }
      },
      error: (error) => {
        console.log('failed to delete : ', error);
      }
    });
  }
 
  onDeviceChange(updatedDevice: DeviceFormValue): void {
    this.newDevice.set(updatedDevice);
  }
 
  private updateShelfPosition(index: number, updatedShelf: ShelfPosition): void {
    this.shelfPositions.update((positions) => {
      const next = [...(positions || [])];
      next[index] = updatedShelf;
      return next;
    });
  }
 
  private updateMetadata(device: DeviceModel): void {
    this.deviceMetadata.set({
      deviceId: device.deviceId,
      createdAt: String(device.createdAt),
      updatedAt: String(device.updatedAt),
      numberOfShelfPositions: device.numberOfShelfPositions,
    });
  }
}
 