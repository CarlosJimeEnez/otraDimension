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
  url: string = `${environment.apiUrl}/v1_1/demo/image/upload`;
  constructor(private http: HttpClient) {}

  uploadImage(data: any): Observable<any> {
    return this.http.post(this.url, data);
  }
}
