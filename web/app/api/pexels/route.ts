import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.PEXELS_API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!apiKey) {
    console.warn("PEXELS_API_KEY is missing.");
    return NextResponse.json({
        error: "Missing API Key",
        photos: []
    }, { status: 200 }); 
  }

  const headers = {
    Authorization: apiKey,
  };

  // 1. Case: Custom Search Query
  if (query) {
    try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`, { headers });
        if (!res.ok) throw new Error(`Pexels Error: ${res.status}`);
        const data = await res.json();
        
        // Map to standard format for UI
        const mappedPhotos = data.photos?.map((p: any) => ({
          id: p.id,
          urls: {
            regular: p.src.large2x || p.src.large,
            small: p.src.medium
          },
          user: {
            name: p.photographer,
            url: p.photographer_url
          },
          alt_description: p.alt || query
        })) || [];

        return NextResponse.json({ photos: mappedPhotos });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Search failed", photos: [] }, { status: 500 });
    }
  }

  // 2. Case: Default behavior (Random categories for onboarding/suggestions)
  const randomPage = () => Math.floor(Math.random() * 20) + 1;

  const fetchPexels = async (q: string, count: number) => {
    try {
        const page = randomPage();
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${count}&page=${page}`, { headers });
        if (!res.ok) throw new Error(`Pexels Error: ${res.status}`);
        const data = await res.json();
        return data.photos?.map((p: any) => ({
          url: p.src.large2x || p.src.large,
          photographer: p.photographer,
          photographer_url: p.photographer_url
        })) || [];
    } catch (e) {
        console.error(e);
        return [];
    }
  };

  const [portraits, banners, products] = await Promise.all([
    fetchPexels('diverse professional headshot portrait profile', 10),
    fetchPexels('abstract dark neon gradient 3d render', 10), 
    fetchPexels('minimalist tech desk setup dark mode', 10) 
  ]);

  return NextResponse.json({
    portraits,
    banners,
    products
  });
}
