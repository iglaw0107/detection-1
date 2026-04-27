// import { useEffect, useState } from "react";
// import DashboardLayout from "../components/layout/DashboardLayout";
// import { getAlerts } from "../api/alerts.api";
// import Badge from "../components/ui/Badge";

// export default function Alerts() {
//   const [alerts, setAlerts] = useState([]);

//   useEffect(() => {
//     getAlerts()
//       .then((res) => {
//         const data = res?.data;

//         // ✅ normalize response safely
//         if (Array.isArray(data)) {
//           setAlerts(data);
//         } else if (Array.isArray(data?.data)) {
//           setAlerts(data.data);
//         } else if (Array.isArray(data?.alerts)) {
//           setAlerts(data.alerts);
//         } else {
//           setAlerts([]); // fallback
//         }
//       })
//       .catch(() => {
//         setAlerts([]); // prevent crash
//       });
//   }, []);

//   return (
//     <DashboardLayout title="Alerts">
//       <table className="w-full text-gray-300">
//         <thead>
//           <tr className="text-gray-500">
//             <th>Type</th>
//             <th>Severity</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.isArray(alerts) &&
//             alerts.map((a) => (
//               <tr key={a._id} className="border-t border-white/10">
//                 <td>{a.type}</td>
//                 <td>
//                   <Badge variant="danger">{a.severity}</Badge>
//                 </td>
//                 <td>{a.status}</td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </DashboardLayout>
//   );
// }


import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getAlerts } from "../api/alerts.api";
import { socket } from "../socket/socket";
import Badge from "../components/ui/Badge";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 INITIAL FETCH
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts();
      const data = res?.data;

      if (Array.isArray(data)) {
        setAlerts(data);
      } else if (Array.isArray(data?.data)) {
        setAlerts(data.data);
      } else if (Array.isArray(data?.alerts)) {
        setAlerts(data.alerts);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error("Alert fetch error:", err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SOCKET REAL-TIME
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("new-alert", (alert) => {
      console.log("🚨 New alert:", alert);

      // add new alert at top
      setAlerts((prev) => [alert, ...prev]);

      // 🔥 optional browser alert
      // window.alert(`${alert.crimeType} detected at ${alert.location}`);
    });

    return () => {
      socket.off("new-alert");
    };
  }, []);

  return (
    <DashboardLayout title="Alerts">

      {loading ? (
        <p className="text-gray-400">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-gray-400">No alerts found</p>
      ) : (
        <table className="w-full text-gray-300">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Location</th>
              <th className="text-left p-2">Severity</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((a, index) => (
              <tr key={a._id || index} className="border-t border-white/10">

                {/* 🔥 FIXED FIELD */}
                <td className="p-2 capitalize">
                  {a.crimeType || "unknown"}
                </td>

                <td className="p-2 text-gray-400">
                  {a.location || "N/A"}
                </td>

                <td className="p-2">
                  <Badge
                    variant={
                      a.severity === "high"
                        ? "danger"
                        : a.severity === "medium"
                        ? "warning"
                        : "success"
                    }
                  >
                    {a.severity}
                  </Badge>
                </td>

                <td className="p-2 capitalize">
                  {a.status || "active"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
}