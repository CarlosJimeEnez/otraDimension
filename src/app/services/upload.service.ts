import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Import the Cloudinary classes.
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  baseUrl: string = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload`;
  uploadUrl: string = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;
  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const form_data = new FormData();

    form_data.append('file', file);
    form_data.append('upload_preset', environment.cloudinary.uploadPreset);
    form_data.append('cloud_name', environment.cloudinary.cloudName);

    // const transformation = this.buildBackgroundTransformation(backgroundPrompt);
    // form_data.append('transformation', transformation);

    return this.http.post(this.uploadUrl, form_data);
  }

  // Método para generar la URL con transformaciones AI
  getAiTransformedUrl(
    publicId: string,
    backgroundPrompt: string,
    options: {
      blackAndWhite?: boolean;
      negate?: boolean;
      saturation?: boolean;
      graySacale?: boolean;
      contrast?: boolean;
    } = {}
  ): string {
    const encodedPrompt = encodeURIComponent(backgroundPrompt);
    const transformations = [
      `e_gen_background_replace:prompt_${encodedPrompt}`,
    ];

    if (options.graySacale) {
      transformations.push('e_grayscale');
    }

    if (options.blackAndWhite) {
      console.log('e_blackwhite');
      transformations.push('e_blackwhite');
    }

    if (options.negate) {
      transformations.push('e_negate');
    }

    if (options.contrast) {
      transformations.push('e_contrast');
    }

    if (options.saturation) {
      console.log('e_saturation');
      transformations.push('e_saturation');
    }

    transformations.push('w_300,h_300,c_fill');

    const transformationString = transformations.join('/');

    return `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/${transformationString}/${publicId}`;
  }
}
