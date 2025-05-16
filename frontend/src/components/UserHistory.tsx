import { useEffect, useState } from "react";
import { getUserHistory } from "../services/authService";
import { useAuthStore } from "../stores/useAuthStore";


const getBadgeColor = (label: string) => {
  switch (label) {
    case "NEGATIVE":
      return "bg-red-100 text-red-700 border border-red-400";
    case "POSITIVE":
      return "bg-green-100 text-green-700 border border-green-400";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-400";
  }
};

export default function UserHistory() {
  const user = useAuthStore((state) => state.user);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user?.id) return;
        const data = await getUserHistory(user.id);
        setHistory(data);
      } catch (e) {
        console.error("History load failed:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) return <div className="text-gray-500 p-4">Loading...</div>;
  if (!history.length) return <div className="text-gray-200 p-4">No analysis history found.</div>;

 return (
  <div className="p-6 bg-gray-50">
    <h2 className="text-2xl font-bold text-blue-700 mb-6">Your Sentiment Analysis History</h2>

    <div className="overflow-x-auto rounded-lg shadow-md ring-1 ring-gray-200">
      <table className="min-w-full text-sm text-left bg-white">
        {/* HEADER */}
        <thead className="bg-blue-600 text-white text-xs uppercase font-semibold">
          <tr>
            <th className="px-4 py-3 border-b border-blue-700">#</th>
            <th className="px-4 py-3 border-b border-blue-700">Date</th>
            <th className="px-4 py-3 border-b border-blue-700">Input Text</th>
            <th className="px-4 py-3 border-b border-blue-700">Sentiment</th>
            <th className="px-4 py-3 border-b border-blue-700">Score</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {history.map((item, index) => (
            <tr
              key={item._id}
              className="even:bg-gray-50 hover:bg-blue-50 transition-colors duration-150"
            >
              <td className="px-4 py-3 border-b text-gray-700 font-medium">
                {index + 1}
              </td>

              <td className="px-4 py-3 border-b text-gray-600">
                {new Date(item.createdAt).toLocaleString()}
              </td>

              <td className="px-4 py-3 border-b max-w-sm overflow-hidden">
                <p className="text-blue-800 line-clamp-2">{item.text}</p>
              </td>

              <td className="px-4 py-3 border-b">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(
                    item.label
                  )}`}
                >
                  {item.label}
                </span>
              </td>

              <td className="px-4 py-3 border-b text-gray-800 font-semibold">
                {(item.score * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


}
