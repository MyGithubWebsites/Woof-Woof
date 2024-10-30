import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

function ImageGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchDogs = async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random/20');
      const data = await response.json();
      if (data.status === 'success') {
        setImages(prev => [...prev, ...data.message]);
      } else {
        throw new Error('Failed to fetch dogs');
      }
    } catch (err) {
      setError('Failed to fetch more dogs. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDogs();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          fetchDogs();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDogs();
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Infinite Dogs Gallery
      </h1>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 max-w-7xl mx-auto">
        {images.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
          >
            <img
              src={url}
              alt={`Dog ${index + 1}`}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div
        ref={loaderRef}
        className="flex justify-center p-4"
      >
        {loadingMore && (
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        )}
      </div>
    </div>
  );
}

export default ImageGallery;