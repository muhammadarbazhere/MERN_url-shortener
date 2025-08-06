import React, { useState, useEffect } from "react";

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [urls, setUrls] = useState([]);

  // Fetch URLs on initial load
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
      setUrls([...urls, { originalUrl, shortUrl: data.shortUrl }]); // Update URLs list
      setError("");
    } catch (err) {
      setError("Failed to shorten the URL. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting URL with id:", id); // Debugging
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/url/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }

      // Update local state to remove the deleted URL
      setUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
    } catch (err) {
      setError("Failed to delete URL. Please try again.");
      console.error(err); // Debugging
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-6">URL Shortener</h1>
        <div className="mb-6 ">
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
            <a
              href={shortUrl}
              className="text-green-400 text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortUrl}
            </a>
          </div>
        )}
        {urls.length > 0 && (
          <div className="mt-8 p-8 bg-gray-800 rounded-lg shadow-lg text-center">
            <h1 className="text-3xl font-bold text-white mb-6">All URLs</h1>
            {error && (
              <div className="mb-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
            <table className=" divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {urls.map((url) => (
                  <tr key={url._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">
                      <a
                        href={url.originalUrl}
                        className="text-green-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {url.originalUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <a
                        href={url.originalUrl}
                        className="text-green-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {url.shortUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <button
                        onClick={() => handleDelete(url._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
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
