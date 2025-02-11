import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from 'fs'

const execAsync = promisify(exec)

export async function POST(req: Request) {
  const { movie, year } = await req.json()

  try {
    // Get the absolute path to the Python script
    const scriptPath = path.join(process.cwd(), 'scripts', 'MovieRecommender.py')
    
    // Debug: Check if file exists
    if (!fs.existsSync(scriptPath)) {
      console.error(`Script not found at path: ${scriptPath}`)
      return NextResponse.json({ 
        error: "Python script not found",
        details: `Script path: ${scriptPath}`
      }, { status: 500 })
    }

    console.log(`Executing script at: ${scriptPath}`)
    
    // Use 'py' instead of 'python' for Windows
    const { stdout, stderr } = await execAsync(`py "${scriptPath}" "${movie}" ${year}`)

    if (stderr) {
      console.error("stderr:", stderr)
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
    }

    // Check if stdout starts with "ERROR:"
    if (stdout.trim().startsWith("ERROR:")) {
      return NextResponse.json({ error: stdout.trim() }, { status: 400 })
    }

    const recommendations = stdout.trim().split("\n")
    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ 
      error: "An error occurred while processing your request.",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}