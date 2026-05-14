import { useState, useEffect } from "react";

const MentorResources = ({ currentUser }) => {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("resources") || "[]");
    setResources(saved);
  }, []);

  const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleAdd = async () => {
  if (!title) {
    alert("Title required");
    return;
  }

  console.log("Adding resource...");
  console.log("File:", file);

  let fileData = null;

  try {
    if (file) {
      fileData = await convertToBase64(file);
      console.log("Base64 done");
    }

    const newResource = {
      id: Date.now(),
      title,
      url,
      file: fileData,
      subject: currentUser.subject,
      mentorId: currentUser.id,
    };

    const updated = [...resources, newResource];

    setResources(updated);
    localStorage.setItem("resources", JSON.stringify(updated));

    console.log("Saved:", newResource);

    setTitle("");
    setUrl("");
    setFile(null);

  } catch (err) {
    console.error("Error:", err);
  }
};

  const handleDelete = (id) => {
    const updated = resources.filter(r => r.id !== id);
    setResources(updated);
    localStorage.setItem("resources", JSON.stringify(updated));
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-white">Resources</h2>

      {/* INPUTS */}
      <div className="flex gap-2 flex-wrap">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 rounded bg-black/30 border text-white"
        />

        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-3 py-2 rounded bg-black/30 border text-white"
        />

        {/* FILE UPLOAD */}
        <label className="px-4 py-2 bg-white/10 border border-white/20 rounded text-white cursor-pointer hover:bg-white/20 transition">
  📎 Upload PDF
  <input
    type="file"
    accept=".pdf"
    onChange={(e) => {
      console.log("Selected file:", e.target.files[0]); // DEBUG
      setFile(e.target.files[0]);
    }}
    className="hidden"
  />
</label>
{file && (
  <p className="text-xs text-gray-400">
    Selected: {file.name}
  </p>
)}

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-emerald-600 rounded text-white cursor-pointer"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {resources.map((r) => (
          <div
            key={r.id}
            className="p-3 bg-white/5 rounded flex justify-between items-center"
          >
            <div>
              <p className="text-white">{r.title}</p>

              {r.url && (
                <a href={r.url} target="_blank" className="text-blue-400 text-sm block">
                  Open Link
                </a>
              )}

            {r.file && (
  <a
    href={r.file}
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-400 text-sm"
  >
    📄 Open File
  </a>
)}
            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDelete(r.id)}
              className="text-red-400 text-sm cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorResources;