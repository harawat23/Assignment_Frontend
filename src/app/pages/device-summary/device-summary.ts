import { Component, signal } from '@angular/core';
import { DeviceModel } from '../../models/Device';
import { DevicesService } from '../../services/devices.service';
import { ActivatedRoute } from '@angular/router';
import { ShelfPosition } from '../../models/ShelfPosition';
import { ShelfPositionService } from '../../services/shelfposition.service';
import { RegularExpressionLiteralExpr } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-device-update',
  templateUrl: './device-summary.html',
  styleUrls: ['./device-summary.css'],
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
  shelfPositions = signal<ShelfPosition[] | null>(null);
  getForm = signal(false);
  shelfId = signal('');

  constructor(
    private deviceService: DevicesService,
    private shelfPositionService: ShelfPositionService,
    private router: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  validateDeviceForm(): boolean {
    let isValid = true;

    if (!this.newDevice().deviceName.trim()) {
      console.error('Device Name is required');
      isValid = false;
    }

    if (!this.newDevice().deviceType.trim()) {
      console.error('Device Type is required');
      isValid = false;
    }

    if (!this.newDevice().buildingName.trim()) {
      console.error('Building Name is required');
      isValid = false;
    }

    if (!this.newDevice().partNumber.trim()) {
      console.error('Part Number is required');
      isValid = false;
    }

    return isValid;
  }

  updateDevice() {
    if (this.validateDeviceForm() && this.device() !== null) {
      const deviceId = this.device()?.deviceId as string;
      const { deviceName, deviceType, buildingName, partNumber } = this.newDevice();

      this.deviceService.updateDevice(deviceId, deviceName, deviceType, buildingName, partNumber).subscribe({
        next: (result: DeviceModel) => {
          console.log('Device updated successfully:', result);
          this.device.set(result);
        },
        error: (error) => {
          console.error('Error updating device:', error);
        },
      });
    } else {
      console.error('Validation failed or device is null:', this.newDevice());
    }
  }

  ngOnInit() {
    this.router.params.subscribe({
      next: (params) => {
        const deviceId = params['deviceId'];
        if (deviceId) {
          this.deviceId = deviceId;
          this.fetchDeviceDetails(deviceId);
          console.log(this.device()?.shelfPosition)
        } else {
          console.error('deviceId parameter is missing');
        }
      },
      error: (error) => {
        console.error('Error fetching route params:', error);
      },
    });
  }

  private fetchDeviceDetails(deviceId: string) {
    this.deviceService.getDeviceById(deviceId).subscribe({
      next: (device: DeviceModel) => {
        this.device.set(device);
        this.newDevice.set({
          deviceName: device.deviceName,
          deviceType: device.deviceType,
          buildingName: device.buildingName,
          partNumber: device.partNumber,
        });
        this.shelfPositions.set(device.shelfPosition || []);
        console.log('Device details fetched:', device);
      },
      error: (error) => {
        console.error('Error fetching device:', error);
      },
    });
  }

  attachShelf(index: number) {
    console.log(this.shelfId());
    if (this.shelfId() != '' && this.shelfPositions() !== null) {
      const shelfPosition = this.shelfPositions() as ShelfPosition[];
      this.shelfPositionService.attachShelf(shelfPosition[index].shelfPosId, this.shelfId()).subscribe({
        next: (updatedShelf: ShelfPosition) => {

          if (shelfPosition) {
            shelfPosition[index] = updatedShelf;
            this.shelfPositions.set([...shelfPosition]);
          }
          console.log('Shelf attached successfully:', updatedShelf);

          this.getForm.set(false);
        },
        error: (error) => {
          console.error('Error attaching shelf:', error);
        },
      });
    }
  }

  detachShelf(index: number, shelf: string) {
    const shelfPosition = this.shelfPositions() as ShelfPosition[];
    this.shelfPositionService.detachShelf(shelfPosition[index].shelfPosId, shelf).subscribe({
      next: (updatedShelf: ShelfPosition) => {

        if (shelfPosition) {
          shelfPosition[index] = updatedShelf;
          this.shelfPositions.set([...shelfPosition]);
        }
        console.log('Shelf detached successfully:', updatedShelf);
      },
      error: (error) => {
        console.error('Error attaching shelf:', error);
      },
    });
  }

  addShelfPosition() {
    if (this.device() !== null) {
      const id = this.device()?.deviceId as string;
      this.shelfPositionService.addShelfPosition(id).subscribe({
        next: (sp: ShelfPosition) => {
          const shelfPosition = this.shelfPositions() as ShelfPosition[];
          shelfPosition.push(sp);
          this.shelfPositions.set([...shelfPosition]);
          console.log(sp);

          const d = this.device() as DeviceModel;
          this.fetchDeviceDetails(d.deviceId);
        },
        error: (error) => {
          console.log("failed to add device : ", error);
        }
      });
    } else {
      console.log("device is null");
    }
  }

  deleteShelf(index: number) {
    const shelfPosition = this.shelfPositions() as ShelfPosition[];
    const del = shelfPosition[index];
    const d = this.device() as DeviceModel;

    this.shelfPositionService.deleteShelf(shelfPosition[index].shelfPosId).subscribe({
      next: (successfully: Boolean) => {
        if (!successfully) {
          console.log("data deleted successfully")
          this.fetchDeviceDetails(d.deviceId);

          const s = this.device()?.shelfPosition as ShelfPosition[];

          this.shelfPositions.set([...s]);
        }
      },
      error: (error) => {
        console.log("failed to delete : ", error);
      }
    });
  }

  deleteDevice() {
    if (this.device() !== null) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const d = this.device() as DeviceModel;
          this.deviceService.deleteDevice(d.deviceId).subscribe({
            next: (deleted: boolean) => {
              if (!deleted) {
                alert('Device deleted successfully');
                this.device.set(null); 
                this.shelfPositions.set(null); 
                this.newDevice.set({
                  deviceName: '',
                  deviceType: '',
                  buildingName: '',
                  partNumber: '',
                });
              } else {
                alert('Device failed to delete');
              }
            },
            error: (error) => {
              console.error('Failed to delete device', error);
            },
          });
        } else {
          console.log('Deletion canceled');
        }
      });
    }
  }

}