import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    setEmail(decoded?.email || "User");

    const fetchGroups = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/group/my-groups`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setGroups(data);
      } catch (err) {
        console.error("Failed to load groups", err);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: groupName }),
      });

      const data = await res.json();

      if (res.ok) {
        setGroups((prev) => [...prev, data]);
        setGroupName("");
        setCreating(false);
      } else {
        console.log("Error:", data.msg);
      }
    } catch (err) {
      console.error("Server error", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">
        👋 Welcome back{email ? `, ${email}` : ""}!
      </h1>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Groups</h2>
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm"
          >
            + Create Group
          </button>
        ) : (
          <form onSubmit={handleCreateGroup} className="flex gap-2">
            <input
              type="text"
              className="bg-gray-700 px-2 py-1 rounded text-sm"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
            >
              Create
            </button>
            <button
              onClick={() => setCreating(false)}
              className="text-sm text-gray-400 hover:text-white"
              type="button"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {groups.map((group, idx) => (
  <Link to={`/group/${group._id}`} key={idx}>
    <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
      <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
      <p className="text-sm text-gray-400">
        {group.members?.length || 1} member
        {group.members?.length !== 1 ? "s" : ""}
      </p>
    </div>
  </Link>
))}

      </div>

      {/* JOIN GROUP SECTION */}
      <div className="mt-10 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">Join a Group</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const code = e.target.code.value.trim();
            const token = localStorage.getItem("token");
            if (!token || !code) return;

            try {
              const res = await fetch(`${BASE_URL}/api/group/join/${code}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              });

              const data = await res.json();

              if (res.ok) {
                setGroups((prev) => [...prev, data]);
                e.target.reset();
              } else {
                alert(data.msg || "Join failed");
              }
            } catch (err) {
              alert("Server error");
              console.error(err);
            }
          }}
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <input
            name="code"
            type="text"
            placeholder="Enter invite code"
            className="flex-1 px-3 py-2 rounded bg-gray-700 placeholder-gray-400 text-sm"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
