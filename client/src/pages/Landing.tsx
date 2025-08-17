
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { Code, Trophy, Users, Zap } from "lucide-react"

export default function Landing(){
  return (
  <div className="min-h-screen bg-background text-foreground relative">
      
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
    
      <div className="container mx-auto px-4 py-16">
  {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
            Master Coding with <span className="bg-primary bg-clip-text group-hover:from-primary/80 group-hover:to-secondary/80 transition-all duration-300 font-bold">
                    CODE
                  </span>
                  <span className="text-foreground group-hover:text-foreground/80 transition-colors duration-300 font-bold">
                    {" "}
                    PERFECT
                  </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sharpen your programming skills with our curated collection of coding challenges. Practice, learn, and excel
            in your coding journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 font-secondary">
              <Link to="/problems">Start Solving</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-600
               dark:border-slate-600  dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
            <CardHeader>
              <Code className="h-12 w-12 mx-auto text-teal-600 mb-4" />
              <CardTitle className="text-foreground">100+ Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Diverse coding challenges from easy to expert level
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
            <CardHeader>
              <Trophy className="h-12 w-12 mx-auto text-teal-600 mb-4" />
              <CardTitle className="text-foreground">Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Monitor your improvement with detailed analytics
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-teal-600 mb-4" />
              <CardTitle className="text-foreground">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Get recommendations based on your performance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
            <CardHeader>
              <Zap className="h-12 w-12 mx-auto text-teal-600 mb-4" />
              <CardTitle className="text-foreground">Real-time Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                See your real time logs with help of ai.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Levels */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Choose Your Challenge Level</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-accent text-accent-foreground border-border px-6 py-2 text-lg">Easy</Badge>
            <Badge variant="secondary" className="bg-accent text-accent-foreground border-border px-6 py-2 text-lg">Medium</Badge>
            <Badge variant="secondary" className="bg-accent text-accent-foreground border-border px-6 py-2 text-lg">Hard</Badge>
          </div>
        </div>
      </div>
    </div>
  )

}

  
