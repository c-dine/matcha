import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GoogleMediaItem } from '@shared-models/picture.model';
import { firstValueFrom } from 'rxjs';
import { PictureService } from 'src/app/service/picture.service';

@Component({
	selector: 'app-google-library',
	templateUrl: './google-library.component.html',
	styleUrls: ['./google-library.component.css', '../../styles/dialog.css']
})
export class GoogleLibraryComponent {

    pictures!: GoogleMediaItem[];
    isLoading = false;

    constructor(
        private pictureService: PictureService,
        private dialogRef: MatDialogRef<GoogleLibraryComponent>
    ) {}

    ngOnInit() {
        this.isLoading = true;
        this.pictureService.getGooglePhotos().subscribe({
            next: data => {
                this.pictures = data;
                this.isLoading = false;
            },
            error: () => {
                this.dialogRef.close();
            }
        });
    }

    async addPicture(id: string, fileName: string) {
        const photoBuffer: ArrayBuffer = await firstValueFrom(this.pictureService.getGooglePhotoFile(id));
        const file = new File([
            new Blob([new Uint8Array(photoBuffer)], { type: 'image/jpeg' })
        ], fileName, { type: 'image/jpeg' });
        this.dialogRef.close(file);
    }
}
