import React, { useState, useEffect } from "react";
import CampusNavigation from "../components/CampusNavigation";
import { Shield, MapPin, Users } from "lucide-react";

const SafeMeetups = () => {
  const [viewState, setViewState] = useState({
    longitude: 90.4043,
    latitude: 23.8223,
    zoom: 15,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [routeStart, setRouteStart] = useState(null);
  const [routeEnd, setRouteEnd] = useState(null);
  const [safeMeetupLocations] = useState([
    {
      id: 1,
      name: "Central Library",
      type: "library",
      coordinates: [23.8223, 90.4043],
      description: "Main library entrance - Well-lit and staffed 24/7",
      hours: "Open 24/7",
      securityFeatures: ["Security Guards", "CCTV", "Help Point"],
    },
    {
      id: 2,
      name: "Student Center",
      type: "academic",
      coordinates: [23.8225, 90.4045],
      description: "Main student hub with cafeteria and study spaces",
      hours: "7:00 AM - 10:00 PM",
      securityFeatures: ["Security Desk", "High Traffic Area", "CCTV"],
    },
    {
      id: 3,
      name: "Campus Security Office",
      type: "security",
      coordinates: [23.822, 90.404],
      description: "24/7 security office with emergency services",
      hours: "Open 24/7",
      securityFeatures: ["Security Staff", "Emergency Services", "CCTV"],
    },
  ]);

  useEffect(() => {
    // Get user's location if permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
          setRouteStart(location); // Set initial route start to user location
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedBuilding(location);
    setRouteEnd(location.coordinates);
    setViewState({
      ...viewState,
      latitude: location.coordinates[0],
      longitude: location.coordinates[1],
      zoom: 17,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-500" />
          Safe Meetup Locations
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Choose from verified safe meeting points on campus for your
          marketplace exchanges
        </p>
      </div>

      <div className="flex flex-1 gap-4 p-4">
        <div className="w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Safe Locations
          </h2>

          {safeMeetupLocations.map((location) => (
            <div
              key={location.id}
              className={`mb-4 p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors ${
                selectedBuilding?.id === location.id
                  ? "border-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => handleLocationSelect(location)}
            >
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {location.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {location.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {location.hours}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {location.securityFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <CampusNavigation
            buildings={safeMeetupLocations}
            selectedBuilding={selectedBuilding}
            userLocation={userLocation}
            onBuildingSelect={handleLocationSelect}
            viewState={viewState}
            onViewStateChange={setViewState}
            routeStart={routeStart}
            routeEnd={routeEnd}
          />
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-gray-900 p-4">
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <Users className="w-5 h-5" />
          <h3 className="font-semibold">Safety Tips</h3>
        </div>
        <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
          <li>
            Always meet in well-lit, public locations during daytime hours
          </li>
          <li>Bring a friend or let someone know about your meetup plans</li>
          <li>Stay near security cameras and emergency help points</li>
          <li>Trust your instincts - if something feels off, don't proceed</li>
        </ul>
      </div>
    </div>
  );
};

export default SafeMeetups;
