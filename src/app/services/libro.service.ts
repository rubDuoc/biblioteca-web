import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Libro } from '../models/libro.model';

// MODELO (MVC): servicio que consume el CRUD del microservicio.
// Singleton: providedIn 'root' crea una sola instancia para toda la aplicacion.
// Observer: la lista de libros se publica en un BehaviorSubject; los componentes se suscriben
// a libros$ y se actualizan solos cada vez que se crea, edita o elimina un libro.
@Injectable({ providedIn: 'root' })
export class LibroService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly librosSubject = new BehaviorSubject<Libro[]>([]);
  readonly libros$ = this.librosSubject.asObservable();

  // GET /libros: obtiene todos los libros y notifica a los suscriptores
  cargarLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl).pipe(tap((libros) => this.librosSubject.next(libros)));
  }

  // GET /libros/{id}: obtiene un libro por su ID
  obtenerPorId(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }

  // POST /libros: agrega un libro y lo suma a la lista
  crear(libro: Libro): Observable<Libro> {
    return this.http
      .post<Libro>(this.apiUrl, libro)
      .pipe(tap((nuevo) => this.librosSubject.next([...this.librosSubject.value, nuevo])));
  }

  // PUT /libros/{id}: actualiza un libro y reemplaza su version en la lista
  actualizar(id: number, libro: Libro): Observable<Libro> {
    return this.http
      .put<Libro>(`${this.apiUrl}/${id}`, libro)
      .pipe(
        tap((actualizado) =>
          this.librosSubject.next(
            this.librosSubject.value.map((l) => (l.id === id ? actualizado : l)),
          ),
        ),
      );
  }

  // DELETE /libros/{id}: elimina un libro y lo quita de la lista
  eliminar(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.librosSubject.next(this.librosSubject.value.filter((l) => l.id !== id))),
      );
  }
}
