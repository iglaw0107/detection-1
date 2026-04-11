import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getAlerts } from "../api/alerts";
import Badge from "../components/ui/Badge";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts().then((res) => setAlerts(res.data));
  }, []);

  return (
    <DashboardLayout title="Alerts">
      <table className="w-full text-gray-300">
        <thead>
          <tr className="text-gray-500">
            <th>Type</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a._id} className="border-t border-white/10">
              <td>{a.type}</td>
              <td>
                <Badge variant="danger">{a.severity}</Badge>
              </td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}