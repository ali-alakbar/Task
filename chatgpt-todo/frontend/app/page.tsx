"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Task = { id:number; title:string; notes?:string|null; status:string; priority:number; due_at?:string|null; completed_at?:string|null; source:string };
type Brief = { counts:{today:number;overdue:number;completed_today:number;unscheduled:number}; today:Task[]; overdue:Task[]; completed_today:Task[]; unscheduled:Task[] };

function fmt(value?: string | null) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en-IQ", { dateStyle:"medium", timeStyle:"short", timeZone:"Asia/Baghdad" }).format(new Date(value));
}

export default function Home() {
  const [tasks,setTasks] = useState<Task[]>([]);
  const [brief,setBrief] = useState<Brief|null>(null);
  const [title,setTitle] = useState(""); const [notes,setNotes] = useState(""); const [due,setDue] = useState(""); const [priority,setPriority] = useState("3");
  const [busy,setBusy] = useState(false); const [error,setError] = useState("");

  const load = useCallback(async () => {
    const [t,b] = await Promise.all([fetch("/api/tasks",{cache:"no-store"}),fetch("/api/brief",{cache:"no-store"})]);
    const tj = await t.json(); const bj = await b.json();
    if (!t.ok) throw new Error(tj.error || "Could not load tasks");
    setTasks(tj); if (b.ok) setBrief(bj);
  },[]);

  useEffect(() => { load().catch(e=>setError(e.message)); },[load]);

  async function add(e:FormEvent) {
    e.preventDefault(); if(!title.trim()) return; setBusy(true); setError("");
    try { const r=await fetch("/api/tasks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:title.trim(),notes:notes.trim()||null,due_at:due?new Date(due).toISOString():null,priority:Number(priority),source:"dashboard",created_by:"ali",timezone:"Asia/Baghdad"})}); const j=await r.json(); if(!r.ok) throw new Error(j.error||"Could not create task"); setTitle("");setNotes("");setDue("");await load(); } catch(e){setError(e instanceof Error?e.message:"Failed");} finally{setBusy(false)}
  }

  async function complete(id:number){await fetch("/api/tasks/"+id+"/complete",{method:"POST"});await load()}
  async function remove(id:number){await fetch("/api/tasks/"+id,{method:"DELETE"});await load()}

  return <main className="shell">
    <section className="hero"><div><div className="eyebrow">Personal command deck</div><h1>Ali’s Task Console</h1><p>One place for what you need to do, what you already finished, and what your assistant can add or query through the protected API bridge.</p></div><div className="status">Baghdad time · assistant-ready</div></section>
    <div className="grid">
      <section className="panel"><h2>Add a task</h2><form className="composer" onSubmit={add}><input placeholder="What needs to happen?" value={title} onChange={e=>setTitle(e.target.value)}/><textarea placeholder="Notes, context, links…" value={notes} onChange={e=>setNotes(e.target.value)}/><div className="row"><input type="datetime-local" value={due} onChange={e=>setDue(e.target.value)}/><select value={priority} onChange={e=>setPriority(e.target.value)}><option value="5">Priority 5 · Critical</option><option value="4">Priority 4 · High</option><option value="3">Priority 3 · Normal</option><option value="2">Priority 2 · Low</option><option value="1">Priority 1 · Someday</option></select></div><button className="primary" disabled={busy}>{busy?"Adding…":"Add to my list"}</button>{error&&<div className="error">{error}</div>}</form>
      <div className="briefGroup"><h3>Daily snapshot</h3><div className="stats"><div className="stat"><strong>{brief?.counts.today??0}</strong><span>due today</span></div><div className="stat"><strong>{brief?.counts.overdue??0}</strong><span>overdue</span></div><div className="stat"><strong>{brief?.counts.completed_today??0}</strong><span>done today</span></div></div></div></section>
      <section className="panel"><h2>Your tasks</h2><div className="taskList">{tasks.length===0?<div className="empty">The runway is clear. Add the first task.</div>:tasks.map(t=><article key={t.id} className={"task "+(t.status==="done"?"done":"")}><button className="check" onClick={()=>t.status!=="done"&&complete(t.id)}>{t.status==="done"?"✓":""}</button><div><div className="taskTitle">{t.title}</div><div className="meta"><span className="pill">P{t.priority}</span><span>{fmt(t.due_at)}</span><span>{t.source}</span></div>{t.notes&&<div className="notes">{t.notes}</div>}</div><button className="danger" aria-label="Delete task" onClick={()=>remove(t.id)}>×</button></article>)}</div></section>
    </div><div className="footer">Assistant bridge: /api/mcp · Rails API remains private behind server-side credentials.</div>
  </main>
}
