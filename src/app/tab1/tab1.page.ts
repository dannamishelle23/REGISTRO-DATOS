import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../app/services/photo';

interface MonthlyTotal {
  mes: string;
  total: number;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  mostrarCalendario = false;
  fechaFiltro: string | null = null;
  gastosporFecha: any[] = [];
  busquedaRealizada = false;
  gastoTotalPorMes: MonthlyTotal[] = [];

  constructor(public photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.loadSaved().then(() => {
      this.calculoGastoMes();
    });
  }

  ionViewWillEnter() {
    this.calculoGastoMes();
  }

  // Calcula el total de gastos ingresados por el usuario por mes
    calculoGastoMes() {
    const totales: { [mesKey: string]: number } = {};

    for (const photo of this.photoService.photos) {
      const note = photo.note || '';
      const monto = this.extraerMonto(note);
      const fechaStr = this.extraerFecha(note);

      if (!fechaStr || monto <= 0) continue;

      const dateObj = new Date(fechaStr);
      if (isNaN(dateObj.getTime())) continue;

      // Clave segura para agrupar: YYYY-MM
      const mesKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      totales[mesKey] = (totales[mesKey] || 0) + monto;
    }

    // Convertimos a array y formateamos el mes sin tocar la zona horaria
    this.gastoTotalPorMes = Object.entries(totales)
      .map(([mesKey, total]) => {
        const [year, month] = mesKey.split('-').map(Number);
        return {
          year,
          month,
          mes: new Date(year, month - 1, 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
          total
        };
      })
      // Ordenamos usando año y mes numéricos
      .sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month));
  }


  // Extrae el monto ingresado por el usuario de la nota
  extraerMonto(note: string): number {
    const linea = note.split('\n').find(l => l.includes('Monto:'));
    if (!linea) return 0;
    const valor = linea.replace('Monto:', '').replace('$', '').trim();
    return parseFloat(valor) || 0;
  }

  // Extrae la fecha del registro de la nota
  extraerFecha(note: string): string | null {
    const linea = note.split('\n').find(l => l.includes('Fecha registro:'));
    if (!linea) return null;
    return linea.replace('Fecha registro:', '').trim();
  }

  abrirCalendario() {
    this.mostrarCalendario = true;
  }

  cerrarCalendario() {
    this.mostrarCalendario = false;
  }

  filtrarPorFecha() {
    if (!this.fechaFiltro) return;

    const fecha = this.fechaFiltro.split('T')[0];

    this.gastosporFecha = this.photoService.photos.filter(photo =>
      (photo.note || '').includes(fecha)
    );

    this.busquedaRealizada = true;
    this.cerrarCalendario();
  }

  // Obtener el monto de la nota para mostrar
  getMonto(note: string): string {
    const montoLinea = note?.split('\n').find(line => line.includes('Monto:'));
    return montoLinea || 'Sin monto registrado';
  }

  // Obtener la descripción de la nota (primera línea)
  getDescripcion(note: string): string {
    return note?.split('\n')[0] || 'Sin descripción';
  }

  // Obtener quién pagó
  getPagador(note: string): string {
    const pagadorLinea = note?.split('\n').find(line => line.includes('Pagó:'));
    return pagadorLinea?.replace('Pagó:', '').trim() || 'No especificado';
  }

  // Obtener la fecha en formato legible
  getFecha(note: string): string {
    if (!note) return 'No especificado';
    const lineaFecha = note.split('\n').find(line =>
      line.toLowerCase().includes('fecha')
    );
    if (!lineaFecha) return 'No especificada';

    const valor = lineaFecha.split(':')[1]?.trim();
    if (!valor) return 'No especificada';

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
