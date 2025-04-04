import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define the expected response type
interface MovieRecommendation {
  recommended_movies: string[];
}

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { movie, year } = await req.json();
    const fullMovieName = `${movie} (${year})`;

    // Query without .returns()
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

    // Type assertion if needed
    const recommendations = (data as MovieRecommendation).recommended_movies || [];
    
    return NextResponse.json({
      recommendations
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      error: "Database error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}