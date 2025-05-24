import React, { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl";

const MapboxDirections = ({ start, end }) => {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!start || !end) return;

    const getDirections = async () => {
      try {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${start[1]},${
            start[0]
          };${end[1]},${end[0]}?steps=true&geometries=geojson&access_token=${
            import.meta.env.VITE_MAPBOX_TOKEN
          }`
        );
        const json = await query.json();

        if (json.routes && json.routes[0]) {
          setRoute({
            type: "Feature",
            properties: {},
            geometry: json.routes[0].geometry,
          });
          setDistance(Math.round(json.routes[0].distance));
          setDuration(Math.round(json.routes[0].duration / 60));
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    getDirections();
  }, [start, end]);

  if (!route) return null;

  return (
    <>
      <Source id="route" type="geojson" data={route}>
        <Layer
          id="route"
          type="line"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "#3b82f6",
            "line-width": 4,
            "line-opacity": 0.75,
            "line-dasharray": [1, 1],
          }}
        />
      </Source>
      {distance && duration && (
        <div className="absolute bottom-20 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg min-w-[200px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm font-medium">
                Distance:{" "}
                {distance < 1000
                  ? `${distance}m`
                  : `${(distance / 1000).toFixed(1)}km`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Walking time: {duration} min
              </p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Walking directions are in beta. Use caution.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapboxDirections;
