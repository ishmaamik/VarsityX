import React, { useEffect, useState } from "react";
import ReactMapGL, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  ScaleControl,
} from "react-map-gl";
import MapboxDirections from "../Map/MapboxDirections";
import { MapPin, Navigation2 } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

const CampusNavigation = ({
  buildings,
  selectedBuilding,
  userLocation,
  onBuildingSelect,
  viewState,
  onViewStateChange,
  routeStart,
  routeEnd,
  onStartPointSelect,
}) => {
  const [mapError, setMapError] = useState(null);
  const [selectedMapStyle, setSelectedMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v12"
  );

  const mapStyles = {
    streets: "mapbox://styles/mapbox/streets-v12",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
    light: "mapbox://styles/mapbox/light-v11",
    dark: "mapbox://styles/mapbox/dark-v11",
    outdoors: "mapbox://styles/mapbox/outdoors-v12",
    navigation: "mapbox://styles/mapbox/navigation-day-v1",
  };

  useEffect(() => {
    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      setMapError("Mapbox token is missing");
      console.error("Mapbox token is not configured");
    }
  }, []);

  const handleMapClick = (event) => {
    if (event.originalEvent.shiftKey) {
      const [longitude, latitude] = event.lngLat.toArray();
      onStartPointSelect([latitude, longitude]);
    }
  };

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900">
        <p className="text-red-600 dark:text-red-200">{mapError}</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full h-full">
      <ReactMapGL
        {...viewState}
        onMove={(evt) => onViewStateChange(evt.viewState)}
        onClick={handleMapClick}
        style={{ width: "100%", height: "100%" }}
        mapStyle={selectedMapStyle}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onError={(e) => {
          console.error("Mapbox Error:", e);
          setMapError("Failed to load map");
        }}
      >
        <div className="absolute top-2 left-2 z-10 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
          <select
            className="text-sm p-1 rounded border dark:bg-gray-700 dark:text-white"
            value={selectedMapStyle}
            onChange={(e) => setSelectedMapStyle(e.target.value)}
          >
            <option value={mapStyles.streets}>Street View</option>
            <option value={mapStyles.satellite}>Satellite View</option>
            <option value={mapStyles.light}>Light Mode</option>
            <option value={mapStyles.dark}>Dark Mode</option>
            <option value={mapStyles.outdoors}>Outdoor View</option>
            <option value={mapStyles.navigation}>Navigation View</option>
          </select>
        </div>

        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          showUserHeading
        />
        <ScaleControl position="bottom-right" />

        {routeStart && routeEnd && (
          <MapboxDirections start={routeStart} end={routeEnd} />
        )}

        {routeStart && (
          <Marker
            longitude={routeStart[1]}
            latitude={routeStart[0]}
            anchor="center"
            draggable
            onDragEnd={(e) => {
              const [longitude, latitude] = e.lngLat.toArray();
              onStartPointSelect([latitude, longitude]);
            }}
          >
            <div className="relative group">
              <div className="absolute -inset-6 bg-blue-500/10 rounded-full animate-ping"></div>
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Navigation2 className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Drag to move start point
              </div>
            </div>
          </Marker>
        )}

        {buildings?.map((building) => (
          <Marker
            key={building.id}
            longitude={building.coordinates[1]}
            latitude={building.coordinates[0]}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onBuildingSelect(building);
            }}
          >
            <div className="cursor-pointer transform hover:scale-110 transition-transform group">
              <div
                className={`w-8 h-8 rounded-full ${
                  building.type === "academic"
                    ? "bg-red-500"
                    : building.type === "library"
                    ? "bg-green-500"
                    : "bg-purple-500"
                } shadow-lg border-2 border-white flex items-center justify-center`}
              >
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {building.name}
              </div>
            </div>
          </Marker>
        ))}

        {selectedBuilding && (
          <Popup
            longitude={selectedBuilding.coordinates[1]}
            latitude={selectedBuilding.coordinates[0]}
            anchor="bottom"
            onClose={() => onBuildingSelect(null)}
            closeOnClick={false}
            className="max-w-sm"
          >
            <div className="p-3">
              <h3 className="font-bold text-lg text-gray-800">
                {selectedBuilding.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedBuilding.description}
              </p>
              <div className="mt-2 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-semibold">Hours:</span>{" "}
                  {selectedBuilding.hours}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedBuilding.securityFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Shift + Click anywhere on map to set custom start point
              </div>
            </div>
          </Popup>
        )}
      </ReactMapGL>

      <div className="absolute bottom-4 left-4 bg-black/75 text-white text-xs px-3 py-2 rounded-full">
        Shift + Click to set custom start point | Click markers to select
        destination
      </div>
    </div>
  );
};

export default CampusNavigation;
