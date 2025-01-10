import { WordPressService } from '../../../services/wordpress';
import Link from 'next/link';
import BlogPostContent from './BlogPostContent';
import Header from '../../../components/Header';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await WordPressService.getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xl text-red-600">Post not found</p>
          <Link href="/" className="block mt-4 text-center text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const author = post._embedded?.author?.[0];
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 group">
          <svg 
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Recipes
        </Link>
        
        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {featuredMedia?.source_url && (
            <div className="relative aspect-[16/9]">
              <img
                src={featuredMedia.source_url}
                alt={post.title.rendered}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <h1 
              className="text-3xl sm:text-4xl font-bold mb-6"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {author && (
              <div className="flex items-center mb-8 border-b border-gray-100 pb-8">
                {author.avatar_urls && (
                  <img
                    src={author.avatar_urls['96']}
                    alt={author.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{author.name}</p>
                  <p className="text-gray-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            <BlogPostContent content={post.content.rendered} />
          </div>
        </article>
      </main>
    </div>
  );
} 