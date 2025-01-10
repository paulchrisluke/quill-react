const BASE_URL = 'https://tiffycooks.com/wp-json/wp/v2';

export interface Author {
  id: number;
  name: string;
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  link: string;
}

export interface Post {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    author?: Author[];
  };
}

export interface Page {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export const WordPressService = {
  // Fetch all posts with featured media and author information
  getPosts: async (): Promise<Post[]> => {
    try {
      const response = await fetch(`${BASE_URL}/posts?_embed&per_page=12`, {
        next: { revalidate: 3600 } // Revalidate every hour
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }
      
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  // Fetch a single post by slug with author information
  getPostBySlug: async (slug: string): Promise<Post | null> => {
    try {
      const response = await fetch(`${BASE_URL}/posts?slug=${slug}&_embed`, {
        next: { revalidate: 3600 } // Revalidate every hour
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
      }
      
      const posts = await response.json();
      return posts[0] || null;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  // Fetch all pages
  getPages: async (): Promise<Page[]> => {
    try {
      const response = await fetch(`${BASE_URL}/pages`, {
        next: { revalidate: 3600 } // Revalidate every hour
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
  },

  // Fetch categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        next: { revalidate: 3600 } // Revalidate every hour
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Search posts
  searchPosts: async (searchTerm: string): Promise<Post[]> => {
    try {
      const response = await fetch(`${BASE_URL}/posts?search=${encodeURIComponent(searchTerm)}&_embed`, {
        next: { revalidate: 60 } // Revalidate search results more frequently
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search posts: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  },
}; 