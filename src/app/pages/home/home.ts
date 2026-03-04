import { Component, signal } from '@angular/core';
import { DeviceModel } from '../../models/Device';
import { ShelfModel } from '../../models/Shelf';
import { DevicesService } from '../../services/devices.service';
import { ShelfService } from '../../services/shelf.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  page_device = signal(0);
  page_shelf = signal(0);
  loading = signal(false);
  deviceList = signal<DeviceModel[] | null>(null);
  shelfList = signal<ShelfModel[] | null>(null);
  deviceOrShelf = signal('device');
  saveDevice = signal(false);

  saveShelf = signal(false);

  newDevice = {
    deviceName: signal(''),
    deviceType: signal(''),
    buildingName: signal(''),
    partNumber: signal(''),
  };

  newShelf = {
    partNumber: signal(''),
    shelfName: signal('')
  };
  formErrors = signal({
    deviceName: '',
    deviceType: '',
    buildingName: '',
    partNumber: '',
  });

  totalDevices = signal(0);
  totalShelves = signal(0);

  constructor(public router: Router, private deviceService: DevicesService, private shelfService: ShelfService) {
  }

  ngOnInit() {
    this.shelfService.shelfData$.subscribe((data) => {
      console.log("change detected");
      this.shelfList.set(data);
      console.log(data);
    });

    this.deviceService.devices$.subscribe((devices) => {
      this.deviceList.set(devices);
    });

    this.deviceService.numberOfDevices$.subscribe((count) => {
      this.totalDevices.set(count);
    });

    this.shelfService.numberOfShelves$.subscribe((count) => {
      this.totalShelves.set(count);
    })

    this.deviceService.updateNumberOfDevices();
    this.shelfService.updatenumberOfShelves();

    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    forkJoin([
      this.deviceService.getAllDevices(this.page_device()),
      this.shelfService.getAllShelfs(this.page_shelf())
    ]).subscribe({
      next: (result) => {
        console.log(result);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

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

    this.formErrors.set(errors);
    return isValid;
  }

  validateShelfForm(): boolean {
    const errors: any = {};
    let isValid = true;

    if (!this.newShelf.partNumber().trim()) {
      errors.partNumber = 'Part Number is Required';
      isValid = false;
    }

    if (!this.newShelf.shelfName().trim()) {
      errors.shelfName = 'Shelf Name is Required';
      isValid = false;
    }

    return isValid;
  }

  saveDeviceData() {
    if (this.validateDeviceForm()) {

      this.deviceService.saveDevices(this.newDevice.deviceName(), this.newDevice.buildingName(), this.newDevice.deviceType(), this.newDevice.partNumber()).subscribe({
        next: (result) => {
          console.log('Device saved successfully:', result);
          this.saveDevice.set(false);
          this.newDevice.deviceName.set('');
          this.newDevice.deviceType.set('');
          this.newDevice.buildingName.set('');
          this.newDevice.partNumber.set('');
          this.formErrors.set({
            deviceName: '',
            deviceType: '',
            buildingName: '',
            partNumber: '',
          });
        },
        error: (error) => {
          console.error('Error saving device:', error);
        },
      });
    }
  }

  saveShelfData() {
    this.shelfService.saveShelf(this.newShelf.shelfName(), this.newShelf.partNumber()).subscribe({
      next: (result) => {
        if (this.validateShelfForm()) {
          console.log("shelf saved successfully")
          console.log(result);
          this.saveShelf.set(false);
          this.newShelf.shelfName.set('');
          this.newShelf.partNumber.set('');
        }
      },
      error: (error) => {
        console.error("error Saving the shelf:", error)
      }
    })
  }

  navigateToDeviceSummaryPage(id: string) {
    this.router.navigate(['/device-summary', id]);
  }

  navigateToShelfSummaryPage(shelf: ShelfModel) {
    this.router.navigate(['shelf-summary', shelf.shelfId]);
  }

  nextDeviceList() {
    const currentPage = this.page_device();
    console.log(currentPage, "   ", Math.ceil(this.totalDevices()) / 50)

    if (currentPage + 1 === Math.ceil(this.totalDevices() / 50)) {
      alert("this is last page");
      return;
    }
    this.page_device.set(this.page_device() + 1);
    this.deviceService.getAllDevices(this.page_device()).subscribe((result) => { console.log(result); this.loading.set(false); });

  }

  previousDeviceList() {
    if (this.page_device() === 0) {
      alert("this is the first page");
      return;
    }
    this.page_device.set(this.page_device() - 1);
    this.deviceService.getAllDevices(this.page_device()).subscribe((result) => { console.log(result); this.loading.set(false); });
  }

  nextShelfList() {
    const currentPage = this.page_shelf();
    console.log(currentPage, "   ", Math.ceil(this.totalShelves() / 50));

    if (currentPage + 1 === Math.ceil(this.totalShelves() / 50)) {
      alert("this is last page");
      return;
    }
    this.page_device.set(this.page_shelf() + 1);
    this.shelfService.getAllShelfs(this.page_shelf()).subscribe((result) => { console.log(result); this.loading.set(false); });
  }

  previousShelfList() {
    if (this.page_shelf() === 0) {
      alert("this is the first page");
      return;
    }
    this.page_device.set(this.page_shelf() + 1);
    this.shelfService.getAllShelfs(this.page_shelf()).subscribe((result) => { console.log(result); this.loading.set(false); });
  }
}