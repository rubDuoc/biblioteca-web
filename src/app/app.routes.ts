import { Routes } from '@angular/router';

import { LibroDetail } from './components/libro-detail/libro-detail';
import { LibroForm } from './components/libro-form/libro-form';
import { LibroList } from './components/libro-list/libro-list';

export const routes: Routes = [
  { path: '', redirectTo: 'libros', pathMatch: 'full' },
  { path: 'libros', component: LibroList },
  { path: 'libros/nuevo', component: LibroForm },
  { path: 'libros/:id', component: LibroDetail },
  { path: 'libros/:id/editar', component: LibroForm },
  { path: '**', redirectTo: 'libros' },
];
