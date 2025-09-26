import { useEffect, useState } from 'react';
import axios from 'axios';
import HostelCard from '../components/HostelCard';

const api_url = import.meta.env.VITE_API_BASE_URL;

const HostelsPage = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await axios.get(`${api_url}/hostels`);
        console.log(res.data);
        setHostels(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch hostels');
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  if (loading) return <div>Loading hostels...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {hostels.length === 0 ? (
        <div>No hostels found.</div>
      ) : (
        hostels.map((hostel) => (
          <HostelCard key={hostel._id} hostel={hostel} />
        ))
      )}
    </div>
  );
};

export default HostelsPage;