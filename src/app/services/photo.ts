import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo as CameraPhoto } from '@capacitor/camera';
import { Filesystem, Directory, ReadFileResult } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  public PHOTO_STORAGE: string = 'photos';

  constructor(private platform: Platform) {}

  // Captura y guarda la foto
  public async addNewToGallery(note?: string) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto, note);

    this.photos.unshift(savedImageFile);
  }
  

  //Guardar foto en filesystem y Preferences
  private async savePicture(cameraPhoto: CameraPhoto, note?: string): Promise<UserPhoto> {
    const base64Data = await this.readAsBase64(cameraPhoto);

    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    const newPhoto: UserPhoto = {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
      note: note || ''
    };

    //Guardar en Preferences
    const photos = [newPhoto, ...this.photos];
    await Preferences.set({ key: this.PHOTO_STORAGE, value: JSON.stringify(photos) });

    return newPhoto;
  }

  //Convertir CameraPhoto a base64
  private async readAsBase64(cameraPhoto: CameraPhoto): Promise<string> {
    if (this.platform.is('hybrid')) {
      const file: ReadFileResult = await Filesystem.readFile({
        path: cameraPhoto.path!
      });
      return file.data as string; // forzamos a string
    } else {
      // En navegador
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob);
    }
  }

  private convertBlobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  // Cargar fotos al iniciar la app
  public async loadSaved() {
    const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = photoList.value ? JSON.parse(photoList.value) : [];
  }

  // Eliminar una foto
  public async deletePhoto(photo: UserPhoto) {
    // Eliminar del array
    this.photos = this.photos.filter(p => p.filepath !== photo.filepath);

    // Actualizar storage
    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    // Eliminar archivo
    await Filesystem.deleteFile({
      path: photo.filepath,
      directory: Directory.Data
    });
  }

  // Actualizar nota de una foto
  public async updatePhotoNote(photo: UserPhoto, note: string) {
    const index = this.photos.findIndex(p => p.filepath === photo.filepath);
    if (index !== -1) {
      this.photos[index].note = note;
      await Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos)
      });
    }
  }
}

// Interfaz para cada foto
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  note?: string; 
}