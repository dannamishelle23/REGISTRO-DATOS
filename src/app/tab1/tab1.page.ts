import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../app/services/photo';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  constructor(public photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.loadSaved();
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
}
