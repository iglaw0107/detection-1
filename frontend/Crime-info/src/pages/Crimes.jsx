import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCrimes } from "../api/crimes";
import Badge from "../components/ui/Badge";

export default function Crimes() {
  const [crimes, setCrimes] = useState([]);

  useEffect(() => {
    getCrimes()
      .then((res) => {
        const data = res?.data;

        // ✅ normalize response safely
        if (Array.isArray(data)) {
          setCrimes(data);
        } else if (Array.isArray(data?.data)) {
          setCrimes(data.data);
        } else if (Array.isArray(data?.crimes)) {
          setCrimes(data.crimes);
        } else {
          setCrimes([]); // fallback
        }
      })
      .catch(() => {
        setCrimes([]); // prevent crash
      });
  }, []);

  return (
    <DashboardLayout title="Crimes">
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="text-gray-500">
            <th>Type</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(crimes) &&
            crimes.map((c) => (
              <tr key={c._id} className="border-t border-white/10">
                <td>{c.type}</td>
                <td>
                  <Badge variant="danger">{c.severity}</Badge>
                </td>
                <td>{c.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}