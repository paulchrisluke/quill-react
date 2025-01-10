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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {posts.map((post) => {
            const author = post._embedded?.author?.[0];
            const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
            
            return (
              <Link 
                href={`/post/${post.slug}`}
                key={post.id}
                className="block group"
              >
                <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {featuredMedia?.source_url && (
                    <div className="relative aspect-[16/9]">
                      <img
                        src={featuredMedia.source_url}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-8">
                    <h2 
                      className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <div 
                      className="text-gray-600 mb-6 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                    
                    {author && (
                      <div className="flex items-center">
                        {author.avatar_urls && (
                          <img
                            src={author.avatar_urls['48']}
                            alt={author.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{author.name}</p>
                          <p className="text-sm text-gray-500">
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
