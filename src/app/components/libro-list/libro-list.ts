import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Libro } from '../../models/libro.model';
import { LibroService } from '../../services/libro.service';

// CONTROLADOR (MVC): conecta la vista (libro-list.html) con el modelo (LibroService)
@Component({
  selector: 'app-libro-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './libro-list.html',
  styleUrl: './libro-list.css',
})
export class LibroList implements OnInit {
  private readonly libroService = inject(LibroService);

  // Observer: la vista se suscribe con el pipe async y se actualiza sola
  protected readonly libros$ = this.libroService.libros$;
  protected readonly error = signal('');

  ngOnInit(): void {
    this.libroService.cargarLibros().subscribe({
      error: () => this.error.set('No se pudo conectar con el microservicio de libros.'),
    });
  }

  eliminar(libro: Libro): void {
    if (!libro.id || !confirm(`¿Eliminar el libro "${libro.titulo}"?`)) {
      return;
    }
    this.libroService.eliminar(libro.id).subscribe({
      error: () => this.error.set('No se pudo eliminar el libro.'),
    });
  }
}
