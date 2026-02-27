import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import { Devices } from './pages/devices/devices';
import { Pagenotfound } from './pages/pagenotfound/pagenotfound';
import { Shelf } from './pages/shelf/shelf';

export const routes: Routes = [
    {path:"",component:Home},
    {path:"searchdevices",component:Devices},
    {path:"searchshelf",component:Shelf},
    {path:"**",component:Pagenotfound}
];
