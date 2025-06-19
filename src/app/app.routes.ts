import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  // { path: 'data', component: DataPageComponent },
  // { path: 'analysis', component: AnalysisPageComponent },
  // { path: 'monitor', component: MonitorPageComponent },
  { path: '**', redirectTo: '/' }
];
