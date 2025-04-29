import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function GroupPage() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [entries, setEntries] = useState([]);
const [formValues, setFormValues] = useState({});
const userToken = localStorage.getItem("token");
const [selectedDate, setSelectedDate] = useState(() => {
  return new Date().toISOString().split("T")[0]; // default to today
});
const BASE_URL = import.meta.env.VITE_BACKEND_URL;


function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

useEffect(() => {
  if (!group) return;

  // RESET formValues when the date changes:
  setFormValues({});

  const fetchEntries = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/group/${group._id}/entries?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );
      const data = await res.json();
      setEntries(data);

      const currentUserId = parseJwt(userToken)?.id;
      const myEntry = data.find(e => e.user._id === currentUserId);
      if (myEntry) {
        const initialFormValues = {};
        Object.keys(myEntry.values).forEach((metricName) => {
          initialFormValues[`${currentUserId}_${metricName}`] = myEntry.values[metricName];
        });
        setFormValues(initialFormValues);
      }
    } catch (err) {
      console.error("Failed to load entries", err);
    }
  };

  fetchEntries();
}, [group, selectedDate]);




  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchGroup = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/group/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.error("Failed to load group", err);
      }
    };

    fetchGroup();
  }, [id]);

  if (!group) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading group info...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
      <p className="text-gray-400 mb-6">
        Invite code: <span className="text-green-400">{group.inviteCode}</span>
      </p>  <Link
              to={`/group/${group._id}/chat`}
              className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Go to Chat 💬
            </Link>

      <h2 className="text-xl font-semibold mb-2">Members</h2>
      <ul className="list-disc ml-6 text-gray-300">
        {group.members?.map((m, idx) => (
          <li key={idx}>{typeof m === "string" ? m : m.email || "User"}</li>
        ))}
      </ul>
      {/* Metric Add Form */}
      <div className="mt-10 max-w-md">
        <h2 className="text-xl font-semibold mb-2">Add a New Metric</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const name = e.target.metricName.value.trim();
            const type = e.target.metricType.value;
            const token = localStorage.getItem("token");

            if (!name || !type || !token) return;

            try {
              const res = await fetch(
                `${BASE_URL}/api/group/${group._id}/metrics`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ name, type }),
                }
              );
            
              const data = await res.json();

              if (res.ok) {
                const refetch = await fetch(`${BASE_URL}/api/group/${group._id}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  const fullData = await refetch.json();
                  setGroup(fullData);
                e.target.reset();
              } else {
                alert(data.msg || "Error adding metric");
              }
            } catch (err) {
              alert("Server error");
              console.error(err);
            }
          }}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <input
            name="metricName"
            type="text"
            placeholder="Metric name (e.g. DSA)"
            className="px-3 py-2 rounded bg-gray-800 text-sm text-white"
            required
          />
          <select
            name="metricType"
            className="px-3 py-2 rounded bg-gray-800 text-sm text-white"
            required
          >
            <option value="">Select type</option>
            <option value="number">Number</option>
            <option value="boolean">Yes/No</option>
            <option value="text">Text</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
          >
            Add Metric
          </button>
        </form>
      </div>

{/* Display Existing Metrics */}
{group.metrics?.length > 0 && (
  <div className="mt-10">
    <h2 className="text-xl font-semibold mb-2">Metrics in this group:</h2>
    <ul className="list-disc ml-6 text-gray-300">
      {group.metrics.map((metric, idx) => (
        <li key={idx}>
          {metric.name} — <span className="italic text-gray-400">{metric.type}</span>
        </li>
      ))}
    </ul>
  </div>
)}
  {/* Grind Table */}
<div className="mt-10 overflow-x-auto">

<div className="flex items-center gap-4 mb-4">
    <h2 className="text-xl font-semibold">Grind Table 📅</h2>
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="bg-gray-800 text-white px-3 py-2 rounded text-sm"
    />
  </div>

  <table className="min-w-full bg-gray-800 rounded text-sm">
    <thead>
      <tr>
        <th className="text-left p-2">Member</th>
        {group.metrics.map((metric) => (
          <th key={metric.name} className="text-left p-2">{metric.name}</th>
        ))}
        <th className="p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {group.members.map((member) => {
        const entry = entries.find(e => e.user._id === member._id);
        const isYou = parseJwt(userToken)?.id === member._id;
        return (
          <tr key={member._id} className="border-t border-gray-700">
            <td className="p-2">{member.email}</td>
            {group.metrics.map((metric) => {
              const valKey = `${member._id}_${metric.name}`;
              const value = isYou
  ? (formValues.hasOwnProperty(valKey)
      ? formValues[valKey]
      : entry?.values?.[metric.name] ?? "")
  : entry?.values?.[metric.name] ?? "-";


              return (
                <td key={metric.name} className="p-2">
                  {isYou ? (
                    metric.type === "boolean" ? (
                      <input
                        type="checkbox"
                        checked={!!formValues[valKey]}
                        onChange={(e) =>
                          setFormValues({ ...formValues, [valKey]: e.target.checked })
                        }
                      />
                    ) : (
                      <input
                        type={metric.type === "number" ? "number" : "text"}
                        className="bg-gray-700 p-1 rounded w-full"
                        value={formValues[valKey] ?? ""}
                        onChange={(e) =>
                          setFormValues({ ...formValues, [valKey]: e.target.value })
                        }
                      />
                    )
                  ) : (
                    <span>{value.toString()}</span>
                  )}
                </td>
                
              );
            })}
            <td className="p-2">
              {isYou && (
                <button
                  className="bg-green-600 px-2 py-1 rounded text-xs"
                  onClick={async () => {
                    const values = {};
                    group.metrics.forEach((m) => {
                      const valKey = `${member._id}_${m.name}`;
                      const entryValue = formValues.hasOwnProperty(valKey)
                        ? formValues[valKey]
                        : entry?.values?.[m.name] ?? ""; // 🟢 fallback to actual DB entry if formValues missing
                      values[m.name] = entryValue;
                    });
                  
                    try {
                      const res = await fetch(`${BASE_URL}/api/group/${group._id}/entry?date=${selectedDate}`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${userToken}`,
                        },
                        body: JSON.stringify({ values }),
                      });
                  
                      if (res.ok) {
                        const updated = await res.json();
                        const newEntries = [...entries.filter(e => e.user._id !== member._id), updated];
                        setEntries(newEntries);
                        alert("Saved!");
                      } else {
                        alert("Failed to save");
                      }
                    } catch (err) {
                      console.error("Save failed", err);
                      alert("Error");
                    }
                  }}
                  
                >
                  Save
                </button>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

      {/* Metrics section will go here next */}
    </div>
    
  );
}
