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
  // Initial view centered on IUT (updated coordinates)
  const [viewState, setViewState] = useState({
    longitude: 90.37925253472153,
    latitude: 23.948114973032546,
    zoom: 16,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [routeStart, setRouteStart] = useState(null);
  const [routeEnd, setRouteEnd] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [customStartPoint, setCustomStartPoint] = useState(null);

  // Updated IUT-specific locations
  const [safeMeetupLocations] = useState([
    {
      id: 1,
      name: "Administrative Building",
      type: "administrative",
      coordinates: [23.948114973032546, 90.37925253472153],
      description:
        "The central hub for university administration and management.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/8/8e/Structure_of_the_administrative_building.jpg",
      hours: "8:00 AM - 4:00 PM",
      securityFeatures: ["Security Desk", "CCTV", "Visitor Log"],
      crowdLevel: "Medium",
    },
    {
      id: 2,
      name: "Central Library",
      type: "library",
      coordinates: [23.94814173569619, 90.37964298257778],
      description:
        "A comprehensive library offering extensive resources and study spaces.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/A_view_of_IUT.jpg",
      hours: "8:00 AM - 10:00 PM",
      securityFeatures: ["Librarian", "CCTV", "Security Guard"],
      crowdLevel: "High",
    },
    {
      id: 3,
      name: "First Academic Building",
      type: "academic",
      coordinates: [23.94848295916611, 90.37917932573376],
      description:
        "Houses classrooms and laboratories for various engineering departments.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/A_view_of_IUT.jpg",
      hours: "8:00 AM - 6:00 PM",
      securityFeatures: ["Security Desk", "ID Card Access", "CCTV"],
      crowdLevel: "Very High",
    },
    {
      id: 4,
      name: "CDS",
      type: "recreational",
      coordinates: [23.948175189019622, 90.38036531117172],
      description:
        "A place for student activities, dining, and social gatherings.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/A_view_of_IUT.jpg",
      hours: "9:00 AM - 9:00 PM",
      securityFeatures: ["High Traffic Area", "CCTV", "Security Guard"],
      crowdLevel: "Very High",
    },
    {
      id: 5,
      name: "Masjid E Zainab, IUT",
      type: "religious",
      coordinates: [23.9475316499381, 90.37927741662267],
      description:
        "A serene place for prayer and reflection within the campus.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwhmTOTfTjifLtc54zp4J4YxT2XKiIHHXI2UuUnvr3V9WSW3ZCG6pNQzHh7htqrk7V9MI&usqp=CAU",
      hours: "Open during prayer times",
      securityFeatures: ["Well-lit Area", "Security Guards"],
      crowdLevel: "Varies",
    },
    {
      id: 6,
      name: "Second Academic Building",
      type: "academic",
      coordinates: [23.948937940662567, 90.37922477970379],
      description:
        "A modern facility equipped with advanced laboratories and lecture halls.",
      image:
        "https://www.iutoic-dhaka.edu/assets/images/second_academic_building.jpg",
      hours: "8:00 AM - 6:00 PM",
      securityFeatures: ["Security Desk", "CCTV", "ID Card Access"],
      crowdLevel: "High",
    },
    {
      id: 7,
      name: "Third Academic Building",
      type: "academic",
      coordinates: [23.949017989978323, 90.3777367955881],
      description:
        "Dedicated to research and postgraduate studies with specialized facilities.",
      image:
        "https://www.iutoic-dhaka.edu/assets/images/third_academic_building.jpg",
      hours: "8:00 AM - 6:00 PM",
      securityFeatures: ["Security Desk", "CCTV", "Restricted Access"],
      crowdLevel: "Medium",
    },
    {
      id: 9,
      name: "North Hall of Residence",
      type: "residential",
      coordinates: [23.94854241625172, 90.38013575271341],
      description:
        "Accommodation facility for male students with fully furnished rooms.",
      image: "https://www.iutoic-dhaka.edu/assets/images/north_hall.jpg",
      hours: "24/7",
      securityFeatures: [
        "Security Guards",
        "CCTV",
        "ID Card Access",
        "Visitor Log",
      ],
      crowdLevel: "High",
    },
    {
      id: 10,
      name: "South Hall of Residence",
      type: "residential",
      coordinates: [23.94700090458333, 90.38009004610988],
      description:
        "Another accommodation facility for male students with modern amenities.",
      image: "https://www.iutoic-dhaka.edu/assets/images/south_hall.jpg",
      hours: "24/7",
      securityFeatures: [
        "Security Guards",
        "CCTV",
        "ID Card Access",
        "Visitor Log",
      ],
      crowdLevel: "High",
    },
    {
      id: 11,
      name: "Female Hall of Residence",
      type: "residential",
      coordinates: [23.947147274302093, 90.37726046429204],
      description:
        "Accommodation facility for female students with secure and comfortable living spaces.",
      image: "https://www.iutoic-dhaka.edu/assets/images/female_hall.jpg",
      hours: "24/7",
      securityFeatures: [
        "24/7 Security",
        "CCTV",
        "Biometric Access",
        "Strict Visitor Policy",
      ],
      crowdLevel: "High",
    },
  ]);

  // Update the default starting point to match new coordinates
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
          // Set Administrative Building as default starting point
          setRouteStart([23.948114973032546, 90.37925253472153]);
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
