import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface Cookie {
  name: string;
  value: string;
  options: Record<string, unknown>;
}

export async function createClient() {
  // Récupère les cookies côté serveur dans Next.js
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();  // Récupère tous les cookies
        },
        setAll(cookiesToSet: Cookie[]) {
          try {
            // Définit tous les cookies
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)  // Définit chaque cookie
            );
          } catch (error) {
            console.error('Error while setting cookies:', error);
          }
        },
      },
    }
  );
}
