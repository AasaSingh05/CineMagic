import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
const supabaseKey: string | undefined = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

interface RecommendedMovies{
  recommended_movies : string[];
};

export async function POST(req: Request) {
  try {
    const { movie, year }: { movie: string; year: string } = await req.json();
    
    const fullMovieName = `${movie.trim()} (${year.trim()})`;
    console.log("Querying for:", JSON.stringify(fullMovieName)); // Debug exact format
    
    const { data , error } = await supabase
  .from('movie_recommendations')
  .select('*')
  .eq('movie_title', fullMovieName)
  .returns<RecommendedMovies>()
  .maybeSingle();
    
    if (error) {
      console.error("Supabase Error Details:", {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }
    
    if (!data) {
      return NextResponse.json({
        error: `No recommendations found for ${fullMovieName}`,
        type: "NO_RESULTS"
      }, { status: 404 });
    }

    return NextResponse.json({
      recommendations: data?.recommended_movies || [] // Handle null case
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      error: "Database error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}