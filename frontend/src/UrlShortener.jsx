import React, { useState, useEffect } from "react";

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [urls, setUrls] = useState([]);

  // Fetch all URLs on page load
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/url`);
        if (!response.ok) {
          throw new Error("Failed to fetch URLs");
        }
        const data = await response.json();
        setUrls(data);
      } catch (err) {
        setError("Failed to load URLs. Please try again.");
      }
    };

    fetchUrls();
  }, []);

  const handleShorten = async () => {
    if (!originalUrl) {
      setError("Please enter a URL");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/url/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setUrls((prev) => [...prev, data]);
      setError("");
      setOriginalUrl(""); // Clear input

      // // ✅ Open the original URL in a new tab right after shortening
      // window.open(data.originalUrl, "_blank");

    } catch (err) {
      setError("Failed to shorten the URL. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/url/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }

      setUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
    } catch (err) {
      setError("Failed to delete URL. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg text-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-6">URL Shortener</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter Long URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full p-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          onClick={handleShorten}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Shorten
        </button>

        {error && (
          <div className="mt-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {shortUrl && (
          <div className="mt-6">
            <p className="text-white text-lg mb-2">Short URL:</p>
            <button
              onClick={() => window.open(urls[urls.length - 1].originalUrl, "_blank")}
              className="text-green-400 text-lg break-all hover:underline"
            >
              {shortUrl}
            </button>
          </div>
        )}

        {urls.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-white mb-4">All URLs</h2>
            <table className="w-full text-left divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-sm text-gray-400 uppercase">Original URL</th>
                  <th className="px-4 py-2 text-sm text-gray-400 uppercase">Short URL</th>
                  <th className="px-4 py-2 text-sm text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {urls.map((url) => (
                  <tr key={url._id}>
                    <td className="px-4 py-2 text-gray-300 break-all">
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                        {url.originalUrl}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-gray-300 break-all">
                      <button
                        onClick={() => window.open(url.originalUrl, "_blank")}
                        className="text-green-400 hover:underline"
                      >
                        {url.shortUrl}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(url._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UrlShortener;
