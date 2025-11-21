import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClients, searchClients } from '../services/api';

function BrowseClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchClients();
      return;
    }

    try {
      setLoading(true);
      const response = await searchClients(searchQuery);
      setClients(response.data);
    } catch (error) {
      console.error('Error searching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">Browse Client Reviews</h1>
          <p className="mt-2 text-gray-600">Search for clients and read anonymous reviews</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name or company..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>
      </form>

      {/* Client List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No clients found. Be the first to submit a review!</p>
          <Link
            to="/submit"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Submit a Review →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link
              key={client.id}
              to={`/client/${client.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{client.name}</h3>
              {client.company && (
                <p className="text-gray-600 mb-2">{client.company}</p>
              )}
              {client.industry && (
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mb-3">
                  {client.industry}
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {client.average_rating ? renderStars(client.average_rating) : '—'}
                </div>
                {client.average_rating && (
                  <span className={`font-semibold ${getRatingColor(client.average_rating)}`}>
                    {client.average_rating.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {client.review_count || 0} {client.review_count === 1 ? 'review' : 'reviews'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseClients;
