/// <reference types="vite/client" />

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
    setCenter(latlng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    fitBounds(bounds: LatLngBounds): void;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
    addListener(eventName: string, handler: Function): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class LatLngBounds {
    constructor();
    extend(point: LatLng): void;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeId?: MapTypeId;
    styles?: MapTypeStyle[];
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon | Symbol;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface Icon {
    url: string;
    scaledSize?: Size;
    anchor?: Point;
  }

  interface Symbol {
    path: string;
    scale?: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  enum MapTypeId {
    ROADMAP = 'roadmap',
    SATELLITE = 'satellite',
    HYBRID = 'hybrid',
    TERRAIN = 'terrain'
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: Array<{
      visibility?: string;
      color?: string;
      weight?: number;
      gamma?: number;
      hue?: string;
      lightness?: number;
      saturation?: number;
    }>;
  }
}
