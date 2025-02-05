import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  const { movie, year } = await req.json()

  try {
    const { stdout, stderr } = await execAsync(`python recommend.py "${movie}" ${year}`)

    if (stderr) {
      console.error("stderr:", stderr)
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
    }

    const recommendations = stdout.trim().split("\n")
    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
  }
}

