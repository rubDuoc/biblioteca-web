import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Libro } from '../../models/libro.model';
import { LibroService } from '../../services/libro.service';

// CONTROLADOR (MVC): formulario para crear (POST) o editar (PUT) un libro
@Component({
  selector: 'app-libro-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './libro-form.html',
  styleUrl: './libro-form.css',
})
export class LibroForm implements OnInit {
  private readonly libroService = inject(LibroService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // ID tomado de la ruta /libros/:id/editar (no existe al crear)
  readonly id = input<string>();
  protected readonly error = signal('');
  protected readonly anioMaximo = new Date().getFullYear();

  protected readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(200)]],
    autor: ['', [Validators.required, Validators.maxLength(150)]],
    anioPublicacion: [null as number | null, [Validators.min(0), Validators.max(this.anioMaximo)]],
    genero: ['', Validators.maxLength(100)],
  });

  get esEdicion(): boolean {
    return !!this.id();
  }

  ngOnInit(): void {
    if (this.esEdicion) {
      this.libroService.obtenerPorId(Number(this.id())).subscribe({
        next: (libro) => this.form.patchValue(libro),
        error: () => this.error.set('No se encontró el libro a editar.'),
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const libro = this.form.getRawValue() as Libro;
    const peticion = this.esEdicion
      ? this.libroService.actualizar(Number(this.id()), libro)
      : this.libroService.crear(libro);

    peticion.subscribe({
      next: () => this.router.navigate(['/libros']),
      error: () => this.error.set('No se pudo guardar el libro.'),
    });
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }
}
