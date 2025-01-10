'use client';

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 
        prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg prose-strong:text-gray-900 prose-strong:font-semibold
        prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700
        prose-blockquote:text-gray-700 prose-blockquote:border-blue-500"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 