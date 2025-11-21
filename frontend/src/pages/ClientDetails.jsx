import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClient, getClientReviews, getClientStats } from '../services/api';

function ClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const [clientRes, reviewsRes, statsRes] = await Promise.all([
        getClient(id),
        getClientReviews(id),
        getClientStats(id)
      ]);
      setClient(clientRes.data);
      setReviews(reviewsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return '—';
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">Client not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Client Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.name}</h1>
        {client.company && <p className="text-xl text-gray-600 mb-2">{client.company}</p>}
        {client.industry && (
          <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded">
            {client.industry}
          </span>
        )}
      </div>

      {/* Statistics */}
      {stats && stats.total_reviews > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {stats.average_rating ? stats.average_rating.toFixed(1) : '—'}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="flex justify-center mt-1">
                {renderStars(stats.average_rating)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.total_reviews}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.would_work_again_count}
              </div>
              <div className="text-sm text-gray-600">Would Work Again</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {stats.scope_creep_count}
              </div>
              <div className="text-sm text-gray-600">Scope Creep Reports</div>
            </div>
          </div>
          {stats.avg_payment_promptness && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Payment Promptness</div>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(stats.avg_payment_promptness)}</div>
                  <span className="text-sm font-semibold">
                    {stats.avg_payment_promptness.toFixed(1)}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Communication Quality</div>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(stats.avg_communication_quality)}</div>
                  <span className="text-sm font-semibold">
                    {stats.avg_communication_quality.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet for this client.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="font-semibold text-gray-900">{review.rating}/5</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>
                <p className="text-gray-700 mb-3">{review.description}</p>
                
                {review.red_flags && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-red-600 mb-1">🚩 Red Flags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(review.red_flags).map((flag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {review.would_work_again !== null && (
                    <div>
                      <span className="text-gray-600">Would work again: </span>
                      <span className={review.would_work_again ? 'text-green-600' : 'text-red-600'}>
                        {review.would_work_again ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {review.scope_creep_issue !== null && (
                    <div>
                      <span className="text-gray-600">Scope creep: </span>
                      <span className={review.scope_creep_issue ? 'text-red-600' : 'text-green-600'}>
                        {review.scope_creep_issue ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDetails;
