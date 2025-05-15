import React, { useState, useRef, useEffect } from 'react';
import { analyzeText } from '../services/authService';

export type ResultProps = {
  label: string;
  score: number;
};

const AnalyzeText: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ResultProps | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const output = await analyzeText(inputText);
      setResult(output);
    } catch (err) {
      console.error('❌ Failed to analyze text.', err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (label: string) => {
    switch (label) {
      case 'NEGATIVE':
        return 'bg-red-100 text-red-700 border-red-400';
      case 'POSITIVE':
        return 'bg-green-100 text-green-700 border-green-400';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-400';
    }
  };

  const scorePercentage = result ? (result.score * 100).toFixed(1) + '%' : '0%';

  return (
    <div className="mt-10  w-full px-5 py-2 pb-10 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">Sentiment Analyzer</h2>

      <label htmlFor="text-input" className="block mb-2 font-medium text-gray-700">
        Enter your text
      </label>
      <textarea
        ref={textareaRef}
        id="text-input"
        className="w-full border border-gray-300 p-3 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        rows={5}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type something to analyze..."
        disabled={loading}
      />

      <button
        className={`w-[20%] flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 disabled:bg-gray-400`}
        onClick={handleAnalyze}
        disabled={loading || !inputText.trim()}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          'Analyze'
        )}
      </button>

      {result && (
        <div className="mt-6 bg-gray-50 border border-gray-200 text-black p-4 rounded space-y-4 shadow-inner">
       
          <div className={`inline-block px-3 py-1 text-sm font-semibold rounded border ${getBadgeColor(result.label)}`}>
            {result.label}
          </div>

     
          <div className="text-sm">
            <strong>Confidence:</strong> {scorePercentage}
          </div>

    
          <div className="w-[20%] h-4 bg-gray-300 rounded overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500 ease-in-out"
              style={{ width: scorePercentage }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzeText;
