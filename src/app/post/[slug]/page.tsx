import { WordPressService } from '../../../services/wordpress';
import Link from 'next/link';
import BlogPostContent from './BlogPostContent';
import Header from '../../../components/Header';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const post = await WordPressService.getPostBySlug(params.slug);

    if (!post) {
      return (
        <div className="min-h-screen" style={{ backgroundColor: '#fff9f2' }}>
          <Header />
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-2xl text-red-600 scrapbook-text">Post not found</p>
            <Link href="/" className="block mt-4 text-center text-blue-600 hover:underline scrapbook-text">
              Return to Home
            </Link>
          </div>
        </div>
      );
    }

    const author = post._embedded?.author?.[0];
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const content = post.content?.rendered || '';
    const title = post.title?.rendered || 'Untitled Post';

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff9f2' }}>
        <Header />
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 group scrapbook-text text-lg"
          >
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
          
          <article className="paper-texture rounded-2xl overflow-hidden relative">
            <div className="tape tape-top-left" />
            <div className="tape tape-top-right" />

            {featuredMedia?.source_url && (
              <div className="relative scrapbook-image mx-8 mt-8 overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden blob-shape">
                  <img
                    src={featuredMedia.source_url}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              <h1 
                className="text-4xl sm:text-5xl mb-6 scrapbook-title"
                style={{ color: '#2d3748' }}
                dangerouslySetInnerHTML={{ __html: title }}
              />

              {author && (
                <div className="flex items-center mb-8 border-t border-b border-dashed border-gray-300 py-4">
                  {author.avatar_urls && (
                    <img
                      src={author.avatar_urls['96']}
                      alt={author.name}
                      className="w-16 h-16 rounded-full ring-2 ring-white shadow-md"
                    />
                  )}
                  <div className="ml-4">
                    <p className="text-xl scrapbook-text" style={{ color: '#2d3748' }}>
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

              <BlogPostContent content={content} />
            </div>
          </article>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error rendering blog post:', error);
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fff9f2' }}>
        <Header />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-2xl text-red-600 scrapbook-text">
            Something went wrong while loading this post. Please try again later.
          </p>
          <Link href="/" className="block mt-4 text-center text-blue-600 hover:underline scrapbook-text">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
} 