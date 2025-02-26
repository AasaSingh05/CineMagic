import { NextResponse } from "next/server"
import { kv } from '@vercel/kv'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  const { movie, year } = await req.json()

  try {
    // Query movie recommendations from Supabase
    const { data: recommendations, error } = await supabase
      .from('movie_recommendations')
      .select('recommended_movies')
      .eq('movie_title', `${movie} (${year})`)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ 
        error: "Failed to fetch recommendations",
        details: error.message
      }, { status: 500 })
    }

    if (!recommendations) {
      return NextResponse.json({ 
        error: "No recommendations found",
        type: "NO_RESULTS"
      }, { status: 404 })
    }

    return NextResponse.json({ 
      recommendations: recommendations.recommended_movies 
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ 
      error: "An error occurred while processing your request.",
      details: error instanceof Error ? error.message : String(error),
      type: "EXECUTION_ERROR"
    }, { status: 500 })
  }
}