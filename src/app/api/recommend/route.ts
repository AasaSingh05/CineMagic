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

    console.log(`Executing script with: movie="${movie}", year="${year}"`)
    
    // Use 'py' instead of 'python' for Windows
    const command = `py "${scriptPath}" "${movie.trim()}" ${year}`
    console.log(`Executing command: ${command}`)
    
    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      console.error("Python stderr:", stderr)
      return NextResponse.json({ 
        error: "Python script error",
        details: stderr
      }, { status: 500 })
    }

    const output = stdout.trim()
    console.log("Python output:", output)

    if (output.startsWith("ERROR:")) {
      return NextResponse.json({ 
        error: output,
        type: "PYTHON_ERROR"
      }, { status: 400 })
    }

    if (!output) {
      return NextResponse.json({ 
        error: "No recommendations returned",
        type: "NO_RESULTS"
      }, { status: 404 })
    }

    const recommendations = output.split("\n")
    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error executing Python script:", error)
    return NextResponse.json({ 
      error: "An error occurred while processing your request.",
      details: error instanceof Error ? error.message : String(error),
      type: "EXECUTION_ERROR"
    }, { status: 500 })
  }
}