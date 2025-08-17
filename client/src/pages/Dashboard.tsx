
import { useEffect, useState } from "react"
import { api } from "@/api/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BookOpen, CheckCircle, Clock } from "lucide-react"

interface Bookmark {
  _id: string;
  title: string;
  url?: string;
  difficulty?: string;
}


export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [progress, setProgress] = useState<string[]>([])
  const [totalProblems, setTotalProblems] = useState<number>(136)
  const [loading, setLoading] = useState(true)
  let isLoggedIn = false;
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      isLoggedIn = !!parsed.token;
    }
  } catch(err){
    console.log(err)
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    async function fetchDashboard() {
      setLoading(true)
      try {
        const bmRes = await api.post("/user/getBookmarks")
        setBookmarks(bmRes.data.bookmarks || [])
        const prRes = await api.get("/user/progress")
        setProgress(prRes.data.progress || [])
      } catch (e) {
        console.log(e)
        setBookmarks([])
        setProgress([])
        setTotalProblems(0)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="max-w-md w-full p-8 bg-card border border-border rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Sign up or log in to track your progress!</h2>
          <p className="mb-6 text-muted-foreground">Create an account to save your progress, bookmarks, and more.</p>
          <a href="/login" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition">Sign Up / Log In</a>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const completedCount = progress.length
  const pct = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0

  return (
  <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Progress</h1>
          <p className="text-muted-foreground">Track your coding journey and achievements</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-card border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Solved</CardTitle>
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">problems completed</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bookmarked</CardTitle>
              <BookOpen className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.length}</div>
              <p className="text-xs text-muted-foreground">saved for later</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pct}%</div>
              <p className="text-xs text-muted-foreground">completion rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Coding Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
              <div className="text-sm text-muted-foreground">
                {completedCount} out of {totalProblems} problems solved
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Bookmarked problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookmarks.length > 0 ? (
                  bookmarks.slice(0, 5).map((q) => (
                    <div
                      key={q._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                        <div>
                          <a
                            className="font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                            href={q.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {q.title}
                          </a>
                        </div>
                      </div>
                      <Badge
                        variant={
                          q.difficulty === "Easy" ? "default" : q.difficulty === "Medium" ? "secondary" : "destructive"
                        }
                        className={
                          q.difficulty === "Easy"
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400"
                            : q.difficulty === "Medium"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


