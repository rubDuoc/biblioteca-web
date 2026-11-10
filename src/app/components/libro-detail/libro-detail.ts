import { AsyncPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap } from 'rxjs';

import { LibroService } from '../../services/libro.service';

// CONTROLADOR (MVC): obtiene un libro por su ID y lo entrega a la vista
@Component({
  selector: 'app-libro-detail',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './libro-detail.html',
})
export class LibroDetail {
  private readonly libroService = inject(LibroService);

  // ID tomado de la ruta /libros/:id
  readonly id = input.required<string>();
  protected readonly error = signal('');

  // Observer: cada vez que cambia el ID de la ruta se vuelve a consultar el libro
  protected readonly libro$ = toObservable(this.id).pipe(
    switchMap((id) =>
      this.libroService.obtenerPorId(Number(id)).pipe(
        catchError(() => {
          this.error.set('No se encontró el libro solicitado.');
          return EMPTY;
        }),
      ),
    ),
  );
}
