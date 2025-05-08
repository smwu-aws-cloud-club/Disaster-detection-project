"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import "leaflet/dist/leaflet.css"

interface Location {
  id: number
  name: string
  lat: number
  lng: number
  status: "normal" | "disaster"
}

interface MapProps {
  locations: Location[]
  onSelectCamera: (location: Location) => void
}

// Default center for Seoul
const DEFAULT_CENTER: [number, number] = [37.5665, 126.9780]

// Fix Leaflet marker icon issue
const markerIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const fireIcon = L.icon({
  iconUrl: "/fire-marker.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
  className: "fire-marker"
})

// Map controller component
function MapController() {
  const map = useMap()

  useEffect(() => {
    map.setView(DEFAULT_CENTER, 13)
  }, [map])

  return null
}

// Disaster simulator component
function DisasterSimulator() {
  const map = useMap()

  const simulateDisaster = () => {
    // Randomly select a location to mark as disaster
    const locations: Location[] = []
    map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        const latLng = layer.getLatLng()
        locations.push({
          id: Math.random(),
          name: "현재 위치",
          lat: latLng.lat,
          lng: latLng.lng,
          status: "normal"
        })
      }
    })

    if (locations.length > 0) {
      const disasterIndex = Math.floor(Math.random() * locations.length)
      const disasterLocation = locations[disasterIndex]

      // Update the global state
      window.dispatchEvent(
        new CustomEvent("disasterDetected", {
          detail: { locations: [{ ...disasterLocation, status: "disaster" }] },
        }),
      )

      // Pan to the disaster location
      map.flyTo([disasterLocation.lat, disasterLocation.lng], 13, { duration: 2 })
    }
  }

  return (
    <div className="absolute z-[1000] bottom-4 right-4">
      <Button variant="destructive" onClick={simulateDisaster} className="flex items-center gap-2">
        <AlertTriangle size={16} />
        재난 시뮬레이션
      </Button>
    </div>
  )
}

export default function Map({ locations, onSelectCamera }: MapProps) {
  return (
    <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={location.status === "disaster" ? fireIcon : markerIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{location.name}</h3>
              <p className={cn("text-sm", location.status === "disaster" ? "text-red-600 font-bold" : "text-gray-600")}>
                상태: {location.status === "disaster" ? "재난 감지됨!" : "정상"}
              </p>
              <Button size="sm" className="mt-2 w-full" onClick={() => onSelectCamera(location)}>
                CCTV 연결
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapController />
      <DisasterSimulator />
    </MapContainer>
  )
} 