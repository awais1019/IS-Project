import React, { useState, type FormEvent} from 'react';


export const TwoFactorForm: React.FC = () => {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-orbitron">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Enter your 2FA Code</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="token"
            placeholder="6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Verify
          </button>
        </form>
        {status && (
          <p
            className={`mt-4 text-center font-medium ${
              status.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};


