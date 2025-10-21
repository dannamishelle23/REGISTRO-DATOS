import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../app/services/photo';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  mostrarCalendario = false;
  fechaFiltro: string | null = null;
  gastosporFecha: any[]= [];
  busquedaRealizada = false;
  constructor(public photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.loadSaved();
  }

  abrirCalendario() {
    this.mostrarCalendario = true;
  }

  cerrarCalendario() {
    this.mostrarCalendario = false;
  }

  filtrarPorFecha() {
    if (!this.fechaFiltro) return;

    //Extrae solo la parte YYYY-MM-DD
    const fecha = this.fechaFiltro.split('T')[0];

    this.gastosporFecha = this.photoService.photos.filter(photo =>
      (photo.note || '').includes(fecha)
    );

    this.busquedaRealizada = true;
    this.cerrarCalendario();
  }

  // Obtener el monto de la nota
  getMonto(note: string): string {
    const montoLinea = note?.split('\n').find(line => line.includes('Monto:'));
    return montoLinea || 'Sin monto registrado';
  }

  // Obtener la descripción (primera línea)
  getDescripcion(note: string): string {
    return note?.split('\n')[0] || 'Sin descripción';
  }

  // Obtener quién pagó
  getPagador(note: string): string {
    const pagadorLinea = note?.split('\n').find(line => line.includes('Pagó:'));
    return pagadorLinea?.replace('Pagó:', '').trim() || 'No especificado';
  }

  //Obtener la fecha del registro
  getFecha(note: string): string {
    if (!note) return 'No especificado';
    const lineaFecha = note.split('\n').find(line =>
    line.toLowerCase().includes('fecha')
  );

  if (!lineaFecha) return 'No especificada';

  const valor = lineaFecha.split(':')[1]?.trim();
  if (!valor) return 'No especificada';

  // Si la fecha es ISO (ej. 2025-12-24T21:24:00)
  if (valor.includes('T')) {
    const fecha = new Date(valor);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return valor;
  }
}
