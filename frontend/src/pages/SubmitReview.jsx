import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient, createReview } from '../services/api';

function SubmitReview() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState({
    name: '',
    company: '',
    industry: ''
  });
  const [reviewData, setReviewData] = useState({
    rating: 3,
    title: '',
    description: '',
    red_flags: [],
    would_work_again: null,
    payment_promptness: null,
    communication_quality: null,
    scope_creep_issue: null
  });
  const [redFlagInput, setRedFlagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleClientSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const addRedFlag = () => {
    if (redFlagInput.trim()) {
      setReviewData({
        ...reviewData,
        red_flags: [...reviewData.red_flags, redFlagInput.trim()]
      });
      setRedFlagInput('');
    }
  };

  const removeRedFlag = (index) => {
    setReviewData({
      ...reviewData,
      red_flags: reviewData.red_flags.filter((_, i) => i !== index)
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // First create or find the client
      const clientResponse = await createClient(clientData);
      const clientId = clientResponse.data.id;
      
      // Then create the review
      await createReview({
        ...reviewData,
        client_id: clientId,
        red_flags: reviewData.red_flags.length > 0 ? reviewData.red_flags : null
      });
      
      alert('Review submitted successfully!');
      navigate(`/client/${clientId}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Review</h1>
        <p className="text-gray-600 mb-6">
          All reviews are anonymous. Help other freelancers avoid red flag clients.
        </p>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Client Info</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div className={`h-full ${step >= 2 ? 'bg-indigo-600' : ''}`}></div>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Step 1: Client Information */}
        {step === 1 && (
          <form onSubmit={handleClientSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientData.name}
                  onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter client or contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={clientData.company}
                  onChange={(e) => setClientData({ ...clientData, company: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry (Optional)
                </label>
                <input
                  type="text"
                  value={clientData.industry}
                  onChange={(e) => setClientData({ ...clientData, industry: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Tech, Finance, Marketing"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Next: Write Review
            </button>
          </form>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <form onSubmit={handleReviewSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overall Rating <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-indigo-600">{reviewData.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reviewData.title}
                  onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Brief summary of your experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Review <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  value={reviewData.description}
                  onChange={(e) => setReviewData({ ...reviewData, description: e.target.value })}
                  rows={5}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Share your experience working with this client..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Red Flags (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={redFlagInput}
                    onChange={(e) => setRedFlagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRedFlag())}
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Late payments, Poor communication"
                  />
                  <button
                    type="button"
                    onClick={addRedFlag}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Add
                  </button>
                </div>
                {reviewData.red_flags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {reviewData.red_flags.map((flag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-sm px-3 py-1 rounded"
                      >
                        {flag}
                        <button
                          type="button"
                          onClick={() => removeRedFlag(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Promptness
                  </label>
                  <select
                    value={reviewData.payment_promptness || ''}
                    onChange={(e) => setReviewData({ ...reviewData, payment_promptness: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Very Poor</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Communication Quality
                  </label>
                  <select
                    value={reviewData.communication_quality || ''}
                    onChange={(e) => setReviewData({ ...reviewData, communication_quality: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Very Poor</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Would you work with them again?
                  </label>
                  <select
                    value={reviewData.would_work_again === null ? '' : reviewData.would_work_again}
                    onChange={(e) => setReviewData({ ...reviewData, would_work_again: e.target.value === '' ? null : e.target.value === 'true' })}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Did they have scope creep issues?
                  </label>
                  <select
                    value={reviewData.scope_creep_issue === null ? '' : reviewData.scope_creep_issue}
                    onChange={(e) => setReviewData({ ...reviewData, scope_creep_issue: e.target.value === '' ? null : e.target.value === 'true' })}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SubmitReview;
