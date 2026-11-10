// MODELO (MVC): mismos atributos que la entidad Libro del microservicio
export interface Libro {
  id?: number;
  titulo: string;
  autor: string;
  anioPublicacion: number | null;
  genero: string;
}
