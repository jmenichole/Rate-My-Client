import { useState } from 'react';
import { analyzeJobPost } from '../services/api';

function AIAnalyzer() {
  const [jobPostText, setJobPostText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!jobPostText.trim()) {
      alert('Please enter a job post to analyze');
      return;
    }

    try {
      setAnalyzing(true);
      const response = await analyzeJobPost(jobPostText);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing job post:', error);
      alert('Error analyzing job post. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score) => {
    if (score > 60) return 'text-red-600';
    if (score > 40) return 'text-orange-600';
    if (score > 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Job Post Analyzer</h1>
        <p className="text-gray-600">
          Paste a job posting and let our AI analyze it for common red flags that freelancers should watch out for.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleAnalyze}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Post Text
            </label>
            <textarea
              value={jobPostText}
              onChange={(e) => setJobPostText(e.target.value)}
              rows={15}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
              placeholder="Paste the job posting here..."
            />
            
            <button
              type="submit"
              disabled={analyzing || !jobPostText.trim()}
              className="mt-4 w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 font-semibold"
            >
              {analyzing ? 'Analyzing...' : '🤖 Analyze Job Post'}
            </button>
          </form>

          {/* Example */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Try it with this example:</h3>
            <button
              type="button"
              onClick={() => setJobPostText(`Looking for a passionate web developer for our exciting startup! We need someone who can work 24/7 and is willing to go the extra mile. This is a great opportunity for exposure and to build your portfolio. We're offering equity in the company instead of upfront payment. Must be available immediately for urgent tasks. We need unlimited revisions until we're happy. Low budget but tons of potential!`)}
              className="text-sm text-blue-700 hover:text-blue-900 underline"
            >
              Click to load example (contains multiple red flags)
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {!analysis ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg">Analysis results will appear here</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Results</h2>

              {/* Risk Score */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Red Flag Score</span>
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      analysis.score > 60 ? 'bg-red-600' :
                      analysis.score > 40 ? 'bg-orange-500' :
                      analysis.score > 20 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${analysis.score}%` }}
                  />
                </div>
                <div className={`mt-3 inline-block px-3 py-1 rounded-full border-2 ${getRiskColor(analysis.riskLevel)}`}>
                  <span className="font-semibold">{analysis.riskLevel} Risk</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700">{analysis.summary}</p>
              </div>

              {/* Red Flags Detected */}
              {analysis.flags && analysis.flags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">🚩 Red Flags Detected</h3>
                  <ul className="space-y-2">
                    {analysis.flags.map((flag, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 p-2 bg-red-50 rounded border-l-4 border-red-500"
                      >
                        <span className="text-red-600 mt-0.5">⚠️</span>
                        <span className="text-sm text-gray-800">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">💡 Recommendations</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 p-2 bg-blue-50 rounded"
                      >
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span className="text-sm text-gray-800">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-indigo-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-3">How does this work?</h3>
        <p className="text-indigo-800 mb-3">
          Our AI analyzes job postings for common red flags that experienced freelancers have identified as warning signs:
        </p>
        <ul className="space-y-2 text-indigo-800">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>Exposure/Portfolio mentions:</strong> Clients offering "exposure" instead of payment</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>24/7 availability:</strong> Unrealistic availability expectations</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>Urgent/ASAP language:</strong> Pressure tactics and unrealistic timelines</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>Budget concerns:</strong> Emphasis on low cost or unpaid work</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>Unlimited revisions:</strong> Scope creep indicators</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span><strong>Deferred payment:</strong> Payment based on equity or future success</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AIAnalyzer;
