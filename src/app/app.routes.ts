import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Devices } from './pages/devices/devices';
import { Pagenotfound } from './pages/pagenotfound/pagenotfound';
import { Shelf } from './pages/shelf/shelf';
import { ShelfCreation } from './pages/shelf-creation/shelf-creation';
import { DeviceCreation } from './pages/device-creation/device-creation';
import { DeviceSummary } from './pages/device-summary/device-summary';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "searchdevices", component: Devices },
    { path: "searchshelf", component: Shelf },
    { path: "saveshelf", component: ShelfCreation },
    {path: "savedevice", component:DeviceCreation},
    { path: 'device-summary/:deviceId', component: DeviceSummary },
    { path: "**", component: Pagenotfound },
];
