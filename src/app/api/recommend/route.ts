import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { movie, year } = await req.json();
    const fullMovieName = `${movie} (${year})`;

    // Query with proper typing
    const { data, error } = await supabase
      .from('movie_recommendations')
      .select('recommended_movies')
      .eq('movie_title', fullMovieName)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) {
      return NextResponse.json({
        error: "No recommendations found",
        type: "NO_RESULTS"
      }, { status: 404 });
    }

    // Now TypeScript knows data has recommended_movies
    return NextResponse.json({
      recommendations: data?.recommended_movies // Fallback to empty array
    });

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({
      error: "Database error",
      details: error.message || "Unknown error"
    }, { status: 500 });
  }
}