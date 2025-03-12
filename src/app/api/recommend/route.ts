import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
const supabaseKey: string | undefined = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

interface RequestBody {
  movie: string;
  year: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { movie, year }: RequestBody = await req.json();

    if (!movie || !year) {
      return NextResponse.json({
        error: "Missing movie or year in request body",
        type: "INVALID_INPUT"
      }, { status: 400 });
    }

    const fullMovieName: string = `${movie} (${year})`;
    console.log("Full Movie Name:", fullMovieName);

    // Query movie recommendations from Supabase
    const { data: recommendations, error } = await supabase
      .from('movie_recommendations')
      .select('recommended_movies')
      .eq('movie_title', fullMovieName);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({
        error: "Failed to fetch recommendations",
        details: error.message
      }, { status: 500 });
    }

    if (!recommendations) {
      return NextResponse.json({
        error: "No recommendations found",
        type: "NO_RESULTS"
      }, { status: 404 });
    }

    console.log("Recommendations from Supabase:", recommendations);

    return NextResponse.json({
      recommendations: recommendations.recommended_movies
    });
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    if (error instanceof Error) {
      return NextResponse.json({
        error: "An error occurred while processing your request.",
        details: error.message
      }, { status: 500 });
    } else {
      return NextResponse.json({
        error: "An unknown error occurred.",
      }, { status: 500 });
    }
  }
}