"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import type { Bin, Route, Edge } from "@/lib/types"

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface MapComponentProps {
  bins: Bin[]
  routes: Route[]
  mst: Edge[]
  mapCenter: [number, number]
  selectedLocation: [number, number] | null
  onMapClick: (lat: number, lng: number) => void
  predictedFillLevels: { [key: number]: number }
}

export default function MapWithLeaflet({
  bins,
  routes,
  mst,
  mapCenter,
  selectedLocation,
  onMapClick,
  predictedFillLevels,
}: MapComponentProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Fix for Leaflet icon in Next.js
  const customIcon = new Icon({
    iconUrl: "/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  // High priority bin icon
  const highPriorityIcon = new Icon({
    iconUrl: "/high-priority-marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  // Function to get the appropriate icon based on bin fill level
  const getBinIcon = (fillLevel: number) => {
    return fillLevel > 80 ? highPriorityIcon : customIcon
  }

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Choose tile layer based on theme
  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  const attribution =
    theme === "dark"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <div className="h-[600px] rounded-md overflow-hidden border border-purple-200 dark:border-purple-900 shadow-md">
      <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url={tileUrl} attribution={attribution} />

        <MapClickHandler onMapClick={onMapClick} />

        {bins.map((bin) => (
          <Marker key={bin.id} position={bin.location} icon={getBinIcon(bin.fillLevel)}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-purple-700 dark:text-purple-400">Bin #{bin.id}</h3>
                <p
                  className={`${
                    bin.fillLevel > 80
                      ? "text-red-500 font-bold"
                      : bin.fillLevel > 50
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  Fill Level: {bin.fillLevel}%
                </p>
                <p>Capacity: {bin.capacity} kg</p>
                <p>Priority: {bin.fillLevel > 80 ? "High" : bin.fillLevel > 50 ? "Medium" : "Low"}</p>

                {predictedFillLevels[bin.id] && (
                  <p className="mt-2 text-purple-600 dark:text-purple-400 font-semibold">
                    Predicted: {predictedFillLevels[bin.id].toFixed(0)}%
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Show MST edges */}
        {mst.map((edge, idx) => {
          const sourceBin = bins.find((b) => b.id === edge.source)
          const targetBin = bins.find((b) => b.id === edge.target)
          if (sourceBin && targetBin) {
            return (
              <Polyline
                key={`mst-${idx}`}
                positions={[sourceBin.location, targetBin.location]}
                color={theme === "dark" ? "#a1a1aa" : "gray"}
                weight={2}
                dashArray="5,10"
              />
            )
          }
          return null
        })}

        {/* Show routes */}
        {routes.map((route, idx) => {
          const positions = route.binSequence
            .map((binId) => {
              const bin = bins.find((b) => b.id === binId)
              return bin ? bin.location : [0, 0]
            })
            .filter((pos) => pos[0] !== 0 || pos[1] !== 0)

          return (
            <Polyline
              key={`route-${idx}`}
              positions={positions}
              color={`hsl(${(idx * 137 + 270) % 360}, 70%, 50%)`}
              weight={4}
            />
          )
        })}

        {/* Show selected location */}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={customIcon}>
            <Popup>
              <div>
                <h3 className="font-bold text-purple-700 dark:text-purple-400">Selected Location</h3>
                <p>Latitude: {selectedLocation[0].toFixed(6)}</p>
                <p>Longitude: {selectedLocation[1].toFixed(6)}</p>
                <p className="text-sm text-muted-foreground mt-2">Fill in the form to add a bin here</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
