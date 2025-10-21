import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../app/services/photo';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  constructor(public photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.loadSaved();  // cargar fotos al inicio
  }

  async eliminarRecibo(photo: any) {
    await this.photoService.deletePhoto(photo);
  }
}
