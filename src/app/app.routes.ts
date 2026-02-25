import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import { Devices } from './pages/devices/devices';
import { Pagenotfound } from './pages/pagenotfound/pagenotfound';

export const routes: Routes = [
    {path:"",component:Home},
    {path:"devices",component:Devices},
    {path:"**",component:Pagenotfound}
];
