declare module 'react-leaflet' {
  import { ComponentType, ReactNode } from 'react'
  import { LatLngExpression, Icon } from 'leaflet'

  export interface MapContainerProps {
    center: LatLngExpression
    zoom: number
    style?: React.CSSProperties
    zoomControl?: boolean
    children?: ReactNode
  }

  export interface TileLayerProps {
    attribution?: string
    url: string
  }

  export interface MarkerProps {
    position: LatLngExpression
    icon?: Icon
    children?: ReactNode
  }

  export const MapContainer: ComponentType<MapContainerProps>
  export const TileLayer: ComponentType<TileLayerProps>
  export const Marker: ComponentType<MarkerProps>
  export const Popup: ComponentType<{ children?: ReactNode }>
  export const useMap: () => any
} 