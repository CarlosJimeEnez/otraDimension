import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private mapInstance: mapboxgl.Map | null = null;
  private mapSubject = new BehaviorSubject<mapboxgl.Map | null>(null);
  map$ = this.mapSubject.asObservable();

  private defaultConfig = {
    accessToken:
      'pk.eyJ1IjoiY2FlbG9zZGV2IiwiYSI6ImNtMjVxZzJjbTB1aXMybG9pN2gzZTU2ZHEifQ.iEZQ-BTw9GLmRXyQB8L3mA',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-74.5, 40] as [number, number],
    zoom: 12,
    pitch: 26,
    bearing: -60,
    antialias: true,
  };

  initializeMap(
    containerId: string,
    config: Partial<typeof this.defaultConfig> = {}
  ): mapboxgl.Map {
    if (this.mapInstance) {
      return this.mapInstance;
    }

    const mapConfig = {
      ...this.defaultConfig,
      ...config,
      container: containerId,
    };

    this.mapInstance = new mapboxgl.Map(mapConfig);
    this.mapInstance.addControl(new mapboxgl.NavigationControl());

    this.mapSubject.next(this.mapInstance);
    return this.mapInstance;
  }

  getMap(): mapboxgl.Map | null {
    return this.mapInstance;
  }

  destroyMap(): void {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
      this.mapSubject.next(null);
      console.log('mapa Destruido');
    }
  }
}
