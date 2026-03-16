import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from './Card'; // Assuming you have a reusable Card component

// Component to display the itineraries/sub-destinations for a single country
const DestinationDetail = ({ countries }) => {
    // 1. Get the dynamic parameter (countryName) from the URL
    const { countryName } = useParams();

    // 2. Find the matching country data from the loaded state
    const countryData = countries.find(
        (c) => c.country.toLowerCase() === countryName.toLowerCase()
    );

    // 3. Handle case where data is not found (e.g., direct URL access before data loads)
    if (!countryData) {
        return <div>Loading or Destination not found...</div>;
    }

    // Extract the list of destinations (itineraries) for the country
    const itineraries = countryData.destinations || [];

    return (
        <div className="destination-detail-page container py-5">
            <Link to="/" className="text-decoration-none mb-4 d-inline-block">
                &larr; Back to Home
            </Link>
            
            <h2 className="mb-4">Itineraries for {countryData.country}</h2>
            
            <div className="row">
                {itineraries.map((destination, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        {/* 4. Render the Card component for each itinerary */}
                        <Card 
                            name={destination.name}
                            detail={destination.detail}
                            image={destination.image} // Use the image for the specific destination
                            linkText="View Itineraries &rarr;"
                            // Add props for the specific colors shown in your wireframe
                            // You might need to add a 'color' property to your seed_data
                        />
                    </div>
                ))}
            </div>
            
            {/* Optional: Placeholder to match the structure in image_77c8c2.jpg */}
            {/* The actual implementation would use your existing Card component styles */}
        </div>
    );
};

export default DestinationDetail;