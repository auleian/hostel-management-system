import React from 'react';

const HostelCard = ({ hostel }) => {
  if (!hostel) return null;

  return (
    <div className="hostel-card" style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, margin: 16, maxWidth: 400 }}>
      {hostel.image && (
        <img
          src={hostel.image}
          alt={hostel.name}
          style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
        />
      )}
      <h2>{hostel.name}</h2>
      <p><strong>Location:</strong> {hostel.location}</p>
      <p><strong>Price:</strong> ₦{hostel.price}</p>
      {hostel.description && <p>{hostel.description}</p>}
      {hostel.amenities && hostel.amenities.length > 0 && (
        <div>
          <strong>Amenities:</strong>
          <ul>
            {hostel.amenities.map((amenity, idx) => (
              <li key={idx}>{amenity}</li>
            ))}
          </ul>
        </div>
      )}
      {hostel.rules && (
        <p><strong>Rules:</strong> {hostel.rules}</p>
      )}
      <p><strong>Gender Policy:</strong> {hostel.genderPolicy}</p>
      {hostel.contactInfo && (
        <p><strong>Contact:</strong> {hostel.contactInfo}</p>
      )}
    </div>
  );
};

export default HostelCard;