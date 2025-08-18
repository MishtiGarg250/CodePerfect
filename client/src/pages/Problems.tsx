
import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import {useVoicePagination} from "@/useVoicePagination"
import { api } from "@/api/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProblemAccordion from "@/components/ProblemAccordion"
import { SearchIcon, Code, Database, TreePine, Network, ChevronLeft, ChevronRight } from "lucide-react"

interface Question {
  _id: string;
  title: string;
  difficulty?: string;
  url?: string;
  p1_link?: string;
  p2_link?: string;
}

interface Category {
  _id: string;
  title: string;
  questions: Question[];
}

export default function Problems() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState("all")
  const [searchParams, setSearchParams] = useSearchParams();

  const PAGE_SIZE = 5;
  const limitOptions = [5, 10, 15];

const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const searchTerm = searchParams.get("search") || "";
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  // For category pagination
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || PAGE_SIZE.toString(), 10);

  // Debounce searchTerm -> debouncedSearch
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      try {
        //fetching all categories, filter on frontend
        const res = await api.get(`/content/getContent`, { headers: { "Cache-Control": "no-cache" } });
        setCategories(res.data || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const tooltip = document.getElementById("featured-tooltip");
      if (tooltip && !tooltip.contains(e.target as Node)) {
        setActiveTooltip(null);
      }
    }
    if (activeTooltip) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeTooltip]);
 
  // Filter and paginate categories (accordions) on frontend
  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter((q) => {
        const matchesSearch = debouncedSearch === "" || q.title.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesDifficulty = difficulty === "all" || (q.difficulty && q.difficulty.toLowerCase() === difficulty);
        return matchesSearch && matchesDifficulty;
      })
    }))
    .filter((cat) => cat.questions.length > 0);

  const totalPages = Math.ceil(filteredCategories.length / limit) || 1;
  const paginatedCategories = filteredCategories.slice((page - 1) * limit, page * limit);

   useVoicePagination(page, (n) => {
    setSearchParams(params => {
      params.set("page", n.toString());
      params.set("search", searchTerm);
      params.set("limit", limit.toString());
      if (difficulty && difficulty !== "all") params.set("difficulty", difficulty);
      return params;
    });
  }, totalPages, (msg) => alert(msg));
  //Mock data just to show on ui
  const featuredCategories = [
    { name: "Arrays", icon: Code, color: "bg-blue-500", problems: 45, description: "Arrays are fundamental data structures for storing elements. Practice array manipulation, searching, sorting, and more." },
    { name: "Algorithms", icon: Network, color: "bg-green-500", problems: 32, description: "Algorithm problems cover searching, sorting, dynamic programming, and more. Improve your problem-solving skills!" },
    { name: "Database", icon: Database, color: "bg-purple-500", problems: 28, description: "Database problems test your knowledge of SQL, schema design, and data manipulation." },
    { name: "Tree", icon: TreePine, color: "bg-orange-500", problems: 24, description: "Tree problems include traversals, binary trees, BSTs, and more. Essential for coding interviews." },
  ];

  const { theme } = useTheme();


  const chevronClass = theme === "dark" 
    ? "text-yellow-400"
    : "text-primary";

  return (
  <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Problems</h1>
          <p className="text-muted-foreground">Solve coding challenges and improve your skills</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Problem Categories</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.name}
                  className="bg-card border border-border hover:shadow-lg transition-all cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{category.problems} problems</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {isActive && (
                    <div
                      id="featured-tooltip"
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 text-white text-xs px-4 py-2 rounded shadow-lg w-64 text-center animate-fade-in ${category.color}`}
                    >
                      {category.description}
                    </div>
                  )}
              )
            })}
          </div>
        </div>

  <Card className="bg-card border border-border mb-6">
    <CardContent className="p-6">
      <div className="flex items-center flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => {
              setSearchParams(params => {
                params.set("search", e.target.value);
                params.set("page", "1");
                params.set("limit", limit.toString());
                return params;
              });
            }}
            className="pl-10 bg-background border border-border"
            aria-label="Search problems"
          />
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex flex-col items-center justify-between">
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={e => {
                setDifficulty(e.target.value);
                setSearchParams(params => {
                  params.set("difficulty", e.target.value);
                  params.set("page", "1");
                  params.set("limit", limit.toString());
                  return params;
                });
              }}
              className="w-[140px] bg-background border border-border rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-primary dark:bg-background dark:border-border mb-2"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              id="limit-select"
              value={limit}
              onChange={e => {
                setSearchParams(params => {
                  params.set("limit", e.target.value);
                  params.set("page", "1");
                  params.set("search", searchTerm);
                  if (difficulty && difficulty !== "all") params.set("difficulty", difficulty);
                  return params;
                });
              }}
              className="w-[140px] bg-background border border-border rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-primary dark:bg-background dark:border-border"
            >
              {limitOptions.map(opt => (
                <option key={opt} value={opt}>{opt} per page</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Explore Problems</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading problems...</div>
            ) : (
              <ProblemAccordion categories={paginatedCategories} />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8 flex-col items-center gap-2">
          <button
            type="button"
            className="mb-2 px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 transition"
            onClick={() => (window as any).startPaginationVoice?.()}
          >
            Hey! I will help you in going to next page, just stay whether you want to go next or prev.
          </button>
          <div className="flex gap-2 bg-card dark:bg-card p-2 rounded-xl shadow border border-border">
            <Button
              variant="outline"
              onClick={() => {
                setSearchParams(params => {
                  params.set("page", Math.max(1, page - 1).toString());
                  params.set("search", searchTerm);
                  params.set("limit", limit.toString());
                  if (difficulty && difficulty !== "all") params.set("difficulty", difficulty);
                  return params;
                });
              }}
              disabled={page === 1}
              className="bg-card border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus-visible:border-ring dark:bg-card dark:text-muted-foreground"
              aria-label="Previous page"
            >
              <ChevronLeft className={`h-5 w-5 ${chevronClass}`} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                
                key={i + 1}
                onClick={() => {
                  setSearchParams(params => {
                    params.set("page", (i + 1).toString());
                    params.set("search", searchTerm);
                    params.set("limit", limit.toString());
                    if (difficulty && difficulty !== "all") params.set("difficulty", difficulty);
                    return params;
                  });
                  
                }}
                
                className={
                  page === i + 1
                    ? " text-primary"
                    : " text-secondary-foreground"
                }
                aria-current={page === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                setSearchParams(params => {
                  params.set("page", Math.min(totalPages, page + 1).toString());
                  params.set("search", searchTerm);
                  params.set("limit", limit.toString());
                  if (difficulty && difficulty !== "all") params.set("difficulty", difficulty);
                  return params;
                });
              }}
              disabled={page === totalPages}
              className="bg-card border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus-visible:border-ring dark:bg-card dark:text-muted-foreground"
              aria-label="Next page"
            >
              <ChevronRight className={`h-5 w-5 ${chevronClass}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
