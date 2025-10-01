import React from 'react';
import './HostelCard.css';

const HostelCard = ({ hostel }) => {
  if (!hostel) return null;

  return (
    <div className="hostel-card" >
      {hostel.image && (
        <img
          src={`http://localhost:3100/${hostel.image}`}
          alt={hostel.name}
          style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
        />
      )}
      <div className='hostel-info'>
        <h2>{hostel.name}</h2>
        <p><b>Location:</b> {hostel.location}</p>
        <p><b>Price:</b> {hostel.price}</p>
        <h3 className='view-details' >view details</h3>
      </div>
      <button className='book'>Book Now</button>
    </div>
  );
};

export default HostelCard;