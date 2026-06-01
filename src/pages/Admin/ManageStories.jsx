/*import { useEffect, useState } from "react";
import api from "../../services/api";
import { deleteStoryByAdmin } from "../../services/adminApi";

const ManageStories = () => {
  const [stories, setStories] = useState([]);

  const loadStories = async () => {
    const res = await api.get("/stories");
    setStories(res.data);
  };

  useEffect(() => {
    loadStories();
  }, []);

  return (
    <div>
      <h2>Manage Stories</h2>

      {stories.map((story) => (
        <div key={story._id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
          <p><b>{story.title}</b></p>
          <p>Author: {story.author?.username}</p>

          <button
            style={{ color: "red" }}
            onClick={() => deleteStoryByAdmin(story._id)}
          >
            Delete Story
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManageStories;
*/

export default function ManageStories({ stories = [] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📚 Manage Stories</h1>

      <div className="grid gap-5">
        {stories.map((story) => (
          <div
            key={story._id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{story.title}</h2>
              <p className="text-gray-500">Author: {story.author}</p>
            </div>

            <div className="flex gap-3">
              <button className="bg-blue-500 text-white px-4 py-1 rounded">
                View
              </button>
              <button className="bg-yellow-400 text-white px-4 py-1 rounded">
                Edit
              </button>
              <button className="bg-red-500 text-white px-4 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
