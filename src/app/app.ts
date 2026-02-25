import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Devices } from './pages/devices/devices';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Assignment_Frontend');
}
