import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/api/api";

type RecommendedItem = string | { title: string; reason: string };
type Summary = {
  shortSummary: string;
  bullets?: string[];
  recommended?: RecommendedItem[];
  raw?: string;
};

type Log = {
  date: string;
  summary: Summary;
};

export default function DailyLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [openLog, setOpenLog] = useState<string | null>(null);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todaysLog = logs.find((log) => log.date && log.date.slice(0, 10) === todayStr);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await api.get("/user/dailylogs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.data;
        setLogs((data.logs || []) as Log[]);
        setSummary((data.summary || null) as Summary | null);
      } catch (error) {
        console.error(error);
        setLogs([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  // Helper to parse summary if raw JSON
  function parseSummary(summary: Summary): Summary {
    if (summary?.raw && typeof summary.raw === "string") {
      let raw = summary.raw.trim();
      if (raw.startsWith("```")) {
        raw = raw.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
      }
      try {
        const parsed = JSON.parse(raw);
        return { ...summary, ...parsed };
      } catch {
        console.error("Failed to parse JSON");
      }
    }
    return summary;
  }

  const summaryToShow = todaysLog ? parseSummary(todaysLog.summary) : summary;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col items-center py-10">
      <Card className="w-full max-w-2xl bg-card border border-border mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary">Your Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : summaryToShow ? (
            <div>
              <div className="mb-2 text-lg font-semibold text-accent-foreground">{summaryToShow.shortSummary}</div>
              {summaryToShow.bullets && (
                <ul className="list-disc pl-6 mb-2">
                  {summaryToShow.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
              {summaryToShow.recommended && (
                <div className="mt-2">
                  <span className="font-semibold">Recommended:</span>
                  <ul className="list-disc pl-6">
                    {summaryToShow.recommended.map((r, i) => {
                      if (typeof r === "string") return <li key={i}>{r}</li>;
                      if (typeof r === "object" && r !== null && "title" in r && "reason" in r) {
                        return <li key={i}>{r.title} - {r.reason}</li>;
                      }
                      return <li key={i}>{JSON.stringify(r)}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">No summary available yet.</div>
          )}
        </CardContent>
      </Card>
      <Card className="w-full max-w-2xl bg-card border border-border shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Last 7 Days Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-muted-foreground">No logs found.</div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, idx) => {
                const summary = parseSummary(log.summary);
                const d = new Date(log.date);
                const isToday = !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === todayStr;
                const isOpen = openLog === (log.date || idx.toString());
                return (
                  <div
                    key={log.date || idx}
                    className={`border border-border rounded-xl overflow-hidden bg-card/70 ${
                      isToday ? "bg-accent/30 border-l-4 border-primary" : ""
                    }`}
                  >
                    <div
                      className={
                        `cursor-pointer px-6 py-4 bg-background flex justify-between items-center hover:bg-accent/30 transition-all` +
                        (isOpen ? " border-b border-border" : "")
                      }
                      onClick={() => setOpenLog(isOpen ? null : (log.date || idx.toString()))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-semibold">
                          {isNaN(d.getTime())
                            ? log.date
                            : d.toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                        </span>
                        {isToday && (
                          <span className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold">
                            Today
                          </span>
                        )}
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    {isOpen && (
                      <div className="px-6 py-4 text-sm text-muted-foreground animate-fade-in">
                        <div className="mb-2 font-semibold text-accent-foreground">
                          {summary?.shortSummary || summary?.raw || "No summary."}
                        </div>
                        {summary?.bullets && (
                          <ul className="list-disc pl-6 mb-2">
                            {summary.bullets.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        )}
                        {summary?.recommended && (
                          <div className="mt-2">
                            <span className="font-semibold">Recommended:</span>
                            <ul className="list-disc pl-6">
                              {summary.recommended.map((r, i) => {
                                if (typeof r === "string") return <li key={i}>{r}</li>;
                                if (typeof r === "object" && r !== null && "title" in r && "reason" in r) {
                                  return <li key={i}>{r.title} - {r.reason}</li>;
                                }
                                return <li key={i}>{JSON.stringify(r)}</li>;
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
