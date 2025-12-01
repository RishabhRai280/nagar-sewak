import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
        )}&addressdetails=1&limit=5&polygon_geojson=1`;

        const response = await fetch(nominatimUrl, {
            headers: {
                'User-Agent': 'NagarSewak-CivicPlatform/1.0 (rishabhrai280@gmail.com)', // Replace with valid app info
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        if (!response.ok) {
            throw new Error(`Nominatim API responded with ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Geocoding error:', error);
        return NextResponse.json({ error: 'Failed to fetch location data' }, { status: 500 });
    }
}
