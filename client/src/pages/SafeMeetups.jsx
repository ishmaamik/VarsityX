import React, { useState, useEffect } from "react";
import CampusNavigation from "../components/CampusNavigation";
import {
  Shield,
  MapPin,
  Users,
  Search,
  Filter,
  Navigation2,
} from "lucide-react";

const SafeMeetups = () => {
  // Initial view centered on IUT
  const [viewState, setViewState] = useState({
    longitude: 90.2673,
    latitude: 23.9633,
    zoom: 16,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [routeStart, setRouteStart] = useState(null);
  const [routeEnd, setRouteEnd] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [customStartPoint, setCustomStartPoint] = useState(null);

  // IUT-specific locations
  const [safeMeetupLocations] = useState([
    {
      id: 1,
      name: "IUT Main Gate",
      type: "security",
      coordinates: [23.9632, 90.2673],
      description: "Main entrance with 24/7 security",
      hours: "Open 24/7",
      securityFeatures: ["Security Guards", "CCTV", "Visitor Log"],
      crowdLevel: "High",
    },
    {
      id: 2,
      name: "Academic Building",
      type: "academic",
      coordinates: [23.9633, 90.2675],
      description: "Main academic building with classrooms and labs",
      hours: "7:00 AM - 10:00 PM",
      securityFeatures: ["Security Desk", "ID Card Access", "CCTV"],
      crowdLevel: "Very High",
    },
    {
      id: 3,
      name: "Central Library",
      type: "library",
      coordinates: [23.9634, 90.2674],
      description: "Main library with study areas",
      hours: "8:00 AM - 11:00 PM",
      securityFeatures: ["Librarian", "CCTV", "Security Guard"],
      crowdLevel: "Medium",
    },
    {
      id: 4,
      name: "Cafeteria",
      type: "academic",
      coordinates: [23.9635, 90.2676],
      description: "Student dining area",
      hours: "7:00 AM - 9:00 PM",
      securityFeatures: ["High Traffic Area", "CCTV"],
      crowdLevel: "Very High",
    },
    {
      id: 5,
      name: "Central Mosque",
      type: "security",
      coordinates: [23.9636, 90.2677],
      description: "Main prayer area",
      hours: "Open 24/7",
      securityFeatures: ["Well-lit Area", "Security Guards"],
      crowdLevel: "Varies",
    },
    {
      id: 6,
      name: "Sports Ground",
      type: "security",
      coordinates: [23.9631, 90.2678],
      description: "Open sports ground with track",
      hours: "6:00 AM - 9:00 PM",
      securityFeatures: ["Open Space", "Lighting", "Security Patrols"],
      crowdLevel: "Medium",
    },
    {
      id: 7,
      name: "Student Center",
      type: "academic",
      coordinates: [23.9637, 90.2676],
      description: "Student activities and club meeting point",
      hours: "8:00 AM - 8:00 PM",
      securityFeatures: ["Security Desk", "CCTV"],
      crowdLevel: "High",
    },
  ]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
          setRouteStart(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Set IUT main gate as default starting point if location access is denied
          setRouteStart([23.9632, 90.2673]);
        }
      );
    }
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedBuilding(location);
    setRouteEnd(location.coordinates);
  };

  const handleStartPointSelect = (point) => {
    setCustomStartPoint(point);
    setRouteStart(point);
  };

  const filteredLocations = safeMeetupLocations.filter(
    (location) =>
      (location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedType === "all" || location.type === selectedType)
  );

  return (
    <div className="flex h-screen">
      {/* Left side - Large Map */}
      <div className="w-2/3 h-full">
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

      {/* Right side - Controls and Info */}
      <div className="w-1/3 h-full overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4 space-y-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
          <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <Shield className="w-6 h-6 text-green-500" />
            Safe Meetup Locations
          </h1>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="academic">Academic</option>
            <option value="library">Library</option>
            <option value="security">Security</option>
          </select>
        </div>

        {/* Starting Point Selection */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
            <Navigation2 className="w-5 h-5 text-blue-500" />
            Select Starting Point
          </h2>
          <select
            className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            onChange={(e) => {
              if (e.target.value === "current") {
                handleStartPointSelect(userLocation);
              } else {
                const location = safeMeetupLocations.find(
                  (loc) => loc.id === parseInt(e.target.value)
                );
                if (location) {
                  handleStartPointSelect(location.coordinates);
                }
              }
            }}
          >
            <option value="">Choose starting point...</option>
            <option value="current">Current Location</option>
            {safeMeetupLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location List */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
            <MapPin className="w-5 h-5 text-red-500" />
            Available Destinations
          </h2>
          <div className="space-y-3">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedBuilding?.id === location.id
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {location.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      location.crowdLevel === "Very High"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : location.crowdLevel === "High"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
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
                <div className="mt-2 flex flex-wrap gap-1">
                  {location.securityFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeMeetups;
