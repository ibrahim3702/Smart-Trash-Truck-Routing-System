"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Cloud, CloudRain, Snowflake, Sun, Wind, AlertTriangle, Clock, Car, Construction, Droplets } from "lucide-react"

interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy"
  temperature: number
  precipitation: number
  windSpeed: number
  humidity: number
}

interface TrafficData {
  congestionLevel: number
  incidents: {
    type: "accident" | "construction" | "closure"
    location: string
    severity: number
  }[]
  averageSpeed: number
}

export default function WeatherTraffic() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [traffic, setTraffic] = useState<TrafficData | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulate fetching weather and traffic data
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, you would fetch from an API
      // For demo purposes, we'll generate mock data

      // Mock weather data
      const weatherConditions: WeatherData["condition"][] = ["sunny", "cloudy", "rainy", "snowy", "windy"]
      const mockWeather: WeatherData = {
        condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
        temperature: Math.round(5 + Math.random() * 25),
        precipitation: Math.round(Math.random() * 100),
        windSpeed: Math.round(5 + Math.random() * 30),
        humidity: Math.round(30 + Math.random() * 70),
      }

      // Mock traffic data
      const incidentTypes: TrafficData["incidents"][0]["type"][] = ["accident", "construction", "closure"]
      const mockTraffic: TrafficData = {
        congestionLevel: Math.round(Math.random() * 100),
        incidents: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
          type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
          location: `Street ${Math.floor(Math.random() * 100)}`,
          severity: Math.floor(Math.random() * 5) + 1,
        })),
        averageSpeed: Math.round(10 + Math.random() * 50),
      }

      setWeather(mockWeather)
      setTraffic(mockTraffic)
      setLoading(false)
    }

    fetchData()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (condition: WeatherData["condition"]) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-10 w-10 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-10 w-10 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-10 w-10 text-blue-500" />
      case "snowy":
        return <Snowflake className="h-10 w-10 text-blue-300" />
      case "windy":
        return <Wind className="h-10 w-10 text-teal-500" />
    }
  }

  const getWeatherDescription = (condition: WeatherData["condition"]) => {
    switch (condition) {
      case "sunny":
        return "Clear skies, optimal for waste collection."
      case "cloudy":
        return "Overcast conditions, good visibility for operations."
      case "rainy":
        return "Precipitation may slow down collection. Bins might be heavier due to water."
      case "snowy":
        return "Snow may obstruct access to some bins. Drive carefully."
      case "windy":
        return "Strong winds may affect lightweight waste. Secure loads properly."
    }
  }

  const getTrafficImpact = (congestionLevel: number) => {
    if (congestionLevel < 30) return "Low impact on routes. Good conditions for waste collection."
    if (congestionLevel < 70) return "Moderate traffic may cause slight delays in some areas."
    return "Heavy traffic will significantly impact collection times. Consider route adjustments."
  }

  const getIncidentIcon = (type: TrafficData["incidents"][0]["type"]) => {
    switch (type) {
      case "accident":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "construction":
        return <Construction className="h-5 w-5 text-yellow-500" />
      case "closure":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
    }
  }

  if (loading) {
    return (
      <Card className="border-purple-200 dark:border-purple-900">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Weather Conditions</span>
              <Badge
                variant="outline"
                className={`${
                  weather?.condition === "sunny" || weather?.condition === "cloudy"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                }`}
              >
                {weather?.precipitation ?? 0}% Precipitation
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {weather && getWeatherIcon(weather.condition)}
                <div>
                  <h3 className="text-2xl font-bold">{weather?.temperature}°C</h3>
                  <p className="text-muted-foreground capitalize">{weather?.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <span>{weather?.windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <span>{weather?.humidity}%</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium mb-2">Impact on Waste Collection</h4>
              <p className="text-sm text-muted-foreground">{weather && getWeatherDescription(weather.condition)}</p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Weather Impact on Operations</span>
                <span className="text-sm font-medium">
                  {weather?.condition === "sunny" || weather?.condition === "cloudy" ? "Low" : "Moderate"}
                </span>
              </div>
              <Progress
                value={
                  weather?.condition === "sunny"
                    ? 20
                    : weather?.condition === "cloudy"
                      ? 40
                      : weather?.condition === "windy"
                        ? 60
                        : weather?.condition === "rainy"
                          ? 80
                          : 90
                }
                className="h-2"
                indicatorClassName={
                  weather?.condition === "sunny" || weather?.condition === "cloudy"
                    ? "bg-green-500"
                    : weather?.condition === "windy"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-purple-200 dark:border-purple-900 transition-all duration-300 hover:shadow-md h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Traffic Conditions</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{new Date().toLocaleTimeString()}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Car
                  className={`h-10 w-10 ${
                    traffic && traffic.congestionLevel < 30
                      ? "text-green-500"
                      : traffic && traffic.congestionLevel < 70
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                />
                <div>
                  <h3 className="text-2xl font-bold">{traffic?.averageSpeed} km/h</h3>
                  <p className="text-muted-foreground">Average Speed</p>
                </div>
              </div>
              <div>
                <Badge
                  variant={
                    traffic && traffic.congestionLevel < 30
                      ? "outline"
                      : traffic && traffic.congestionLevel < 70
                        ? "outline"
                        : "destructive"
                  }
                  className={
                    traffic && traffic.congestionLevel < 30
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : traffic && traffic.congestionLevel < 70
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : ""
                  }
                >
                  {traffic && traffic.congestionLevel < 30
                    ? "Light Traffic"
                    : traffic && traffic.congestionLevel < 70
                      ? "Moderate Traffic"
                      : "Heavy Traffic"}
                </Badge>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Congestion Level</span>
                <span className="text-sm font-medium">{traffic?.congestionLevel}%</span>
              </div>
              <Progress
                value={traffic?.congestionLevel}
                className="h-2"
                indicatorClassName={
                  traffic && traffic.congestionLevel < 30
                    ? "bg-green-500"
                    : traffic && traffic.congestionLevel < 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              />
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium mb-2">Traffic Impact</h4>
              <p className="text-sm text-muted-foreground">{traffic && getTrafficImpact(traffic.congestionLevel)}</p>
            </div>

            {traffic && traffic.incidents.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Incidents</h4>
                <div className="space-y-2">
                  {traffic.incidents.map((incident, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        {getIncidentIcon(incident.type)}
                        <span className="capitalize">{incident.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{incident.location}</span>
                        <Badge
                          variant={incident.severity > 3 ? "destructive" : "outline"}
                          className={
                            incident.severity <= 2
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : incident.severity === 3
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : ""
                          }
                        >
                          Level {incident.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
