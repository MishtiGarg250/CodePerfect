import { useState, useEffect, useRef } from "react"

import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Bookmark, BookmarkCheck, CheckCircle2, ExternalLink, Youtube } from "lucide-react";
import api from "../api/api";

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

interface ProblemAccordionProps {
  categories: Category[];
}

export default function ProblemAccordion({ categories }: ProblemAccordionProps) {
  const [openCat, setOpenCat] = useState<string | null>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [bookmarked, setBookmarked] = useState<{ [id: string]: boolean }>({});
  const [completed, setCompleted] = useState<{ [id: string]: boolean }>({});

  // Check if a question is completed/bookmarked
  const isCompleted = (id: string) => !!completed[id];
  const isBookmarked = (id: string) => !!bookmarked[id];

  // Fetch user progress/bookmarks on mount (optional: can be improved to fetch per category)
  useEffect(() => {
    async function fetchStatus() {
      try {
        // Get completed questions
        const progressRes = await api.get("/user/progress");
        setCompleted(Object.fromEntries(((progressRes.data.progress || [])).map((id: string) => [id, true])));
        // Get bookmarks
        const bookmarkRes = await api.post("/user/getBookmarks");
        setBookmarked(Object.fromEntries(((bookmarkRes.data.bookmarks || [])).map((q: any) => [q._id, true])));
      } catch (err){
        console.log(err)
      }
    }
    fetchStatus();
  }, []);

  async function handleBookmark(questionId: string) {
    try {
      const action = isBookmarked(questionId) ? "remove" : "add";
      await api.post(`/user/addOrRemoveBookmark`, { questionId, action });
      setBookmarked((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
    } catch(err){
      console.log(err)
    }
  }
  async function handleComplete(questionId: string) {
    try {
      const completedNow = !isCompleted(questionId);
      const res = await api.post(`/user/updateProgress`, { questionId, completed: completedNow });
      // res.data.progress is the updated array of completed question IDs
      if (res.data && Array.isArray(res.data.progress)) {
        setCompleted(Object.fromEntries(res.data.progress.map((id: string) => [id, true])));
      }
    } catch(err){
      console.log(err)
    }
  }

  

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <div
            key={cat._id}
            className="border border-border rounded-xl overflow-hidden bg-card/70"
          >
            <div
              className="cursor-pointer px-6 py-4 bg-background flex justify-between items-center hover:bg-accent/30 transition-all"
              onClick={() => setOpenCat(openCat === cat._id ? null : cat._id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span className="font-semibold">{cat.title}</span>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400">
                  {cat.questions.length} problems
                </Badge>
              </div>
              {openCat === cat._id ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            <div className={`accordion-content${openCat === cat._id ? " open" : ""}`}
              style={{ padding: openCat === cat._id ? "1.5rem 1.5rem 1.5rem 1.5rem" : "0 1.5rem", }}>
              {openCat === cat._id && (
                <div className="space-y-3">
                  {cat.questions.map((question, i) => (
                    <div
                      key={question._id}
                      ref={el => {
                        if (!questionRefs.current) questionRefs.current = [];
                        questionRefs.current[i] = el;
                      }}
                      className="question-row flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-card border border-border hover:shadow-md transition-all group"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-3 md:mb-0">
                        <div className="flex items-center gap-2">
                          {isCompleted(question._id) && (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-1" aria-label="Completed" />
                          )}
                          <span className="font-medium group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {question.title}
                          </span>
                        </div>
                        {question.difficulty && (
                          <span className={
                            question.difficulty === "Easy"
                              ? "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400 px-2 py-1 rounded"
                              : question.difficulty === "Medium"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-1 rounded"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded"
                          }>
                            {question.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center text-sm">
                        {question.p1_link && (
                          <a href={question.p1_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center" aria-label="External link P1">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {question.p2_link && (
                          <a href={question.p2_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center" aria-label="External link P2">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {question.url && (
                          <a href={question.url} target="_blank" rel="noopener noreferrer" className="text-red-600 flex items-center" aria-label="YouTube video">
                            <Youtube className="w-5 h-5" />
                          </a>
                        )}
                        <button onClick={() => handleBookmark(question._id)}
                          className={`ml-2 px-2 py-1 border rounded text-xs flex items-center hover:bg-yellow-100 ${isBookmarked(question._id) ? 'bg-yellow-100' : ''}`}
                          aria-label="Bookmark"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked(question._id) ? 'text-yellow-500' : ''}`} />
                        </button>
                        <button onClick={() => handleComplete(question._id)}
                          className={`ml-2 px-2 py-1 border rounded text-xs flex items-center hover:bg-green-100 ${isCompleted(question._id) ? 'bg-green-100' : ''}`}
                          aria-label="Complete"
                        >
                          <BookmarkCheck className={`w-4 h-4 ${isCompleted(question._id) ? 'text-green-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
  );
}