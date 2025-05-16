import { useEffect, useState } from "react";
import { getAllHistories, type HistoryItem } from "../services/authService";



export default function AllUsersData() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllHistories()
      .then(setData)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">All User Histories</h2>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-blue-600 text-white text-xs uppercase font-semibold">
            <tr>
              <th className="px-4 py-3 border-b border-blue-700">#</th>
              <th className="px-4 py-3 border-b border-blue-700">User</th>
              <th className="px-4 py-3 border-b border-blue-700">Email</th>
              <th className="px-4 py-3 border-b border-blue-700">Date</th>
              <th className="px-4 py-3 border-b border-blue-700">Input Text</th>
              <th className="px-4 py-3 border-b border-blue-700">Sentiment</th>
              <th className="px-4 py-3 border-b border-blue-700">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item:HistoryItem, index: number) => (
              <tr
                key={item.id}
                className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <td className="px-4 py-3 border-b text-gray-700 font-medium">{index + 1}</td>
                <td className="px-4 py-3 border-b text-blue-800 font-medium">
                  {item.userId?.name || "Unknown"}
                </td>
                <td className="px-4 py-3 border-b text-gray-600">{item.userId?.email}</td>
                <td className="px-4 py-3 border-b text-gray-600">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 border-b max-w-sm truncate text-blue-700">{item.text}</td>
                <td className="px-4 py-3 border-b">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(item.label)}`}>
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

const getBadgeColor = (label: string) => {
  switch (label) {
    case "NEGATIVE":
      return "bg-red-100 text-red-700 border border-red-300";
    case "POSITIVE":
      return "bg-green-100 text-green-700 border border-green-300";
    default:
      return "bg-gray-200 text-gray-700 border border-gray-300";
  }
};
