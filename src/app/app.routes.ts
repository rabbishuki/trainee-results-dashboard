import { Routes } from '@angular/router';
import { DataPageComponent } from './pages/data-page/data-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/data', pathMatch: 'full' },
  { path: 'data', component: DataPageComponent },
  // { path: 'analysis', component: AnalysisPageComponent },
  // { path: 'monitor', component: MonitorPageComponent },
  { path: '**', redirectTo: '/data' }
];
