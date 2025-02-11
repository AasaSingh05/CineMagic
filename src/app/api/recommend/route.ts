import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import { readFileSync } from 'fs'
import { join } from 'path'

const execAsync = promisify(exec)

export async function POST(req: Request) {
  const { movie, year } = await req.json()

  try {
    // Get the root directory of the project
    const rootDir = process.cwd()
    // Construct the full path to the Python script
    const scriptPath = path.join(rootDir, 'scripts', 'MovieRecommender.py')
    const command = `python "${scriptPath}" "${movie}" ${year}`
    console.log('Executing command:', command)
    
    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error("stderr:", stderr)
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
    }

    // Handle potential error messages from Python script
    if (stdout.startsWith("ERROR:")) {
      return NextResponse.json({ error: stdout.trim() }, { status: 400 })
    }

    const recommendations = stdout.trim().split("\n")
    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ 
      error: "Failed to process movie recommendation request. Please ensure the movie exists in our database." 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'favicon.ico')
    const fileBuffer = readFileSync(filePath)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    return new NextResponse('Favicon not found', { status: 404 })
  }
}