'use client';

import { useEffect, useState } from 'react';
import { WordPressService, Post } from '../services/wordpress';
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await WordPressService.getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff9f2' }}>
        <Header />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-2xl scrapbook-text">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff9f2' }}>
        <Header />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-2xl text-red-600 scrapbook-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2' }}>
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {posts.map((post, index) => {
            const author = post._embedded?.author?.[0];
            const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
            const isEven = index % 2 === 0;
            
            return (
              <Link 
                href={`/post/${post.slug}`}
                key={post.id}
                className="block group"
              >
                <article 
                  className="paper-texture rounded-2xl overflow-hidden relative"
                  style={{ 
                    transform: isEven ? 'rotate(1deg)' : 'rotate(-1deg)',
                    animation: `float ${8 + index % 4}s ease-in-out infinite`
                  }}
                >
                  <div className="tape tape-top-left" />
                  <div className="tape tape-top-right" />
                  
                  <div className="p-6 sm:p-8">
                    {featuredMedia?.source_url && (
                      <div className="relative mb-6 scrapbook-image overflow-hidden">
                        <div className="aspect-[16/9] overflow-hidden blob-shape">
                          <img
                            src={featuredMedia.source_url}
                            alt={post.title.rendered}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}

                    <h2 
                      className="text-3xl mb-4 scrapbook-title group-hover:text-blue-600 transition-colors"
                      style={{ color: '#2d3748' }}
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    
                    <div 
                      className="text-gray-600 mb-6 line-clamp-3 scrapbook-text"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                    
                    {author && (
                      <div className="flex items-center mt-6 border-t border-dashed border-gray-300 pt-4">
                        {author.avatar_urls && (
                          <img
                            src={author.avatar_urls['48']}
                            alt={author.name}
                            className="w-12 h-12 rounded-full ring-2 ring-white shadow-md"
                          />
                        )}
                        <div className="ml-4">
                          <p className="text-lg font-medium scrapbook-text" style={{ color: '#2d3748' }}>
                            {author.name}
                          </p>
                          <p className="text-gray-500 scrapbook-text">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
