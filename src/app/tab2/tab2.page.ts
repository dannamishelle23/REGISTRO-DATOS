import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../app/services/photo';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  // Modelo para el formulario
  gasto = {
    descripcion: '',
    monto: 0,
    pagador: '',
    fecha: new Date().toISOString(),
    foto: null as string | null
  };

  constructor(public photoService: PhotoService, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.photoService.loadSaved();
  }

  async guardarGasto() {
    if (!this.gasto.foto) {
      const alert = await this.alertCtrl.create({
        header: 'Foto requerida',
        message: 'Por favor, toma una foto del recibo antes de guardar.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      // Actualizamos la última foto con los detalles del gasto
      if (this.photoService.photos.length > 0) {
        const detalles = `${this.gasto.descripcion}\nMonto: $${this.gasto.monto}\nPagó: ${this.gasto.pagador}\nFecha registro: ${this.gasto.fecha.split('T')[0]}`;
        await this.photoService.updatePhotoNote(this.photoService.photos[0], detalles);
        
        await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Gasto guardado correctamente',
          buttons: ['OK']
        }).then(alert => alert.present());

        this.limpiarFormulario();
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo guardar el gasto',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }

  async addPhotoToGallery() {
    try {
      await this.photoService.addNewToGallery('');
      const photos = this.photoService.photos;
      if (photos.length > 0) {
        this.gasto.foto = photos[0].webviewPath || null;
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo capturar la foto',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  limpiarFormulario() {
    this.gasto = {
      descripcion: '',
      monto: 0,
      pagador: '',
      fecha: new Date().toISOString(),
      foto: null
    };
  }

}
