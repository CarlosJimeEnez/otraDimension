import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-home',
  standalone: true,
  imports: [],
  templateUrl: './map-home.component.html',
})
export class MapHomeComponent implements OnInit, AfterViewInit {
  private map: L.Map | undefined;
  private bounds: L.LatLngBounds | undefined;

  @ViewChild('fountainSvg', { static: true })
  fountainSvg!: ElementRef<SVGElement>;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    //TODO Vista inicial del mapa:
    const svgUrl = this.fountainSvg.nativeElement;
    console.log(svgUrl);

    this.map = L.map('map').setView(
      [19.047494523789826, -98.18321684482034],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    const escala = 0.1;
    const center = [19.047494523789826, -98.18321684482034];
    const der = [center[0] + escala, center[1] - escala];
    const izd = [center[0] - escala, center[1] + escala];

    this.bounds = L.latLngBounds([
      [der[0], der[1]],
      [izd[0], izd[1]],
    ]);
    this.map.fitBounds(this.bounds);

    L.marker([19.047494523789826, -98.18321684482034])
      .addTo(this.map)
      .bindPopup('La fuente de los Muñecos ')
      .openPopup();

    this.map.on('zoomend', () => {
      const zoom = this.map!.getZoom();
      console.log(zoom);
      const escala = this.calcularZoom(zoom);
      const center = [19.047494523789826, -98.18321684482034];
      const der = [center[0] + escala, center[1] - escala];
      const izd = [center[0] - escala, center[1] + escala];

      this.bounds = L.latLngBounds([
        [der[0], der[1]],
        [izd[0], izd[1]],
      ]);
      console.log(this.bounds);

      L.svgOverlay(svgUrl, this.bounds!).addTo(this.map!);
    });

    L.svgOverlay(svgUrl, this.bounds!).addTo(this.map);
    this.map.fitBounds(this.bounds!);
  }

  calcularZoom(zoom: number): number {
    const zoomCalaculado = 0.0001 * Math.pow(20 - zoom, 2);
    return zoomCalaculado;
  }
}
