import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'biks-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatTabLink, MatToolbar, MatTabNav, MatTabNavPanel, NgOptimizedImage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
