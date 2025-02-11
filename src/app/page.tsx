"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Popcorn, Ticket } from "lucide-react"

export default function Home() {
  const [movie, setMovie] = useState("")
  const [year, setYear] = useState("")
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie, year }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('API Error:', data)
        // Show error to user
        setRecommendations([])
        return
      }

      if (data.error) {
        console.error('API Error:', data.error)
        // Show error to user
        setRecommendations([])
        return
      }

      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error("Error:", error)
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-cinema bg-cover bg-center flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-black/80 text-white border-2 border-yellow-400 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-yellow-400">🎬🍿 CineMagic 🍿🎬</CardTitle>
            <CardDescription className="text-gray-300">Your Personal Movie Usher </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="movie" className="text-sm font-medium text-gray-300">
                  Feature Presentation
                </label>
                <Input
                  id="movie"
                  type="text"
                  placeholder="Enter a movie title"
                  value={movie}
                  onChange={(e) => setMovie(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium text-gray-300">
                  Release Year
                </label>
                <Input
                  id="year"
                  type="number"
                  placeholder="Enter release year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rolling the Film...
                  </>
                ) : (
                  <>
                    <Popcorn className="mr-2 h-4 w-4" />
                    Get Showtime Suggestions
                  </>
                )}
              </Button>
            </form>
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Recommendations:</h3>
                <ul className="space-y-2">
                  {recommendations.map((movie, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center bg-gray-800 p-3 rounded-md shadow"
                    >
                      <Ticket className="mr-2 h-5 w-5 text-yellow-400" />
                      <span className="text-gray-200">{movie}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}

