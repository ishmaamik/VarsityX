import React, { useState, useEffect } from "react";
import CampusNavigation from "../components/CampusNavigation";
import { Shield, MapPin, Users, Search, Filter } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [customStartPoint, setCustomStartPoint] = useState(null);

  const [safeMeetupLocations] = useState([
    {
      id: 1,
      name: "Central Library",
      type: "library",
      coordinates: [23.8223, 90.4043],
      description: "Main library entrance - Well-lit and staffed 24/7",
      hours: "Open 24/7",
      securityFeatures: ["Security Guards", "CCTV", "Help Point"],
      crowdLevel: "High",
    },
    {
      id: 2,
      name: "Student Center",
      type: "academic",
      coordinates: [23.8225, 90.4045],
      description: "Main student hub with cafeteria and study spaces",
      hours: "7:00 AM - 10:00 PM",
      securityFeatures: ["Security Desk", "High Traffic Area", "CCTV"],
      crowdLevel: "Very High",
    },
    {
      id: 3,
      name: "Campus Security Office",
      type: "security",
      coordinates: [23.822, 90.404],
      description: "24/7 security office with emergency services",
      hours: "Open 24/7",
      securityFeatures: ["Security Staff", "Emergency Services", "CCTV"],
      crowdLevel: "Medium",
    },
    {
      id: 4,
      name: "Main Cafeteria",
      type: "academic",
      coordinates: [23.8228, 90.4048],
      description: "Busy dining area with security presence",
      hours: "6:00 AM - 11:00 PM",
      securityFeatures: ["Security Cameras", "High Traffic", "Help Point"],
      crowdLevel: "Very High",
    },
    {
      id: 5,
      name: "Science Building Lobby",
      type: "academic",
      coordinates: [23.8218, 90.4038],
      description: "Main entrance of Science Building",
      hours: "7:00 AM - 9:00 PM",
      securityFeatures: ["Security Desk", "CCTV", "ID Card Access"],
      crowdLevel: "High",
    },
    {
      id: 6,
      name: "Sports Complex",
      type: "security",
      coordinates: [23.823, 90.405],
      description: "Indoor sports facility with security staff",
      hours: "6:00 AM - 10:00 PM",
      securityFeatures: ["Security Staff", "CCTV", "Emergency Phone"],
      crowdLevel: "Medium",
    },
    {
      id: 7,
      name: "Engineering Library",
      type: "library",
      coordinates: [23.8215, 90.4035],
      description: "Engineering department library with study areas",
      hours: "8:00 AM - 11:00 PM",
      securityFeatures: ["Librarian Desk", "CCTV", "Security Guard"],
      crowdLevel: "Medium",
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

  const handleStartPointSelect = (point) => {
    setCustomStartPoint(point);
    setRouteStart(point);
  };

  const filteredLocations = safeMeetupLocations
    .filter(
      (location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((location) =>
      selectedType === "all" ? true : location.type === selectedType
    );

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
        <div className="w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search locations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="library">Libraries</option>
                <option value="academic">Academic Buildings</option>
                <option value="security">Security Points</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className={`p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-all ${
                  selectedBuilding?.id === location.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {location.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      location.crowdLevel === "Very High"
                        ? "bg-red-100 text-red-800"
                        : location.crowdLevel === "High"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {location.crowdLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
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
            onStartPointSelect={handleStartPointSelect}
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
