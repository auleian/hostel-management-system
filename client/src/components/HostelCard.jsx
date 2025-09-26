import React from 'react';

const HostelCard = ({ hostel }) => {
  if (!hostel) return null;

  return (
    <div className="hostel-card" >
      {hostel.image && (
        <img
          src={hostel.image}
          alt={hostel.name}
          style={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 8 }}
        />
      )}
      <h2>{hostel.name}</h2>
      <p><b>Location:</b> {hostel.location}</p>
      <p><b>Price:</b> {hostel.price}</p>
     
    </div>
  );
};

export default HostelCard;