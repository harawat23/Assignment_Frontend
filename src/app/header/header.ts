import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, Route, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports:[CommonModule,RouterLink,RouterLinkActive],
  styleUrls:['./header.css']
})
export class Header {
  routes: Route[];

  constructor(private router: Router) {
    // Include empty path (Home) but exclude wildcards
    this.routes = this.router.config.filter(route => route.path !== '**');
  }
}