import { NextRequest, NextResponse } from "next/server";
import { rails } from "@/lib/api";

const tools = [
  { name: "list_tasks", description: "List personal tasks.", inputSchema: { type: "object", properties: { status: { type: "string" } } } },
  { name: "create_task", description: "Create a task or reminder.", inputSchema: { type: "object", required: ["title"], properties: { title: { type: "string" }, notes: { type: "string" }, due_at: { type: "string" }, remind_at: { type: "string" }, priority: { type: "integer", minimum: 1, maximum: 5 } } } },
  { name: "update_task", description: "Update a task.", inputSchema: { type: "object", required: ["id"], properties: { id: { type: "integer" }, title: { type: "string" }, notes: { type: "string" }, due_at: { type: "string" }, remind_at: { type: "string" }, priority: { type: "integer" }, status: { type: "string" } } } },
  { name: "complete_task", description: "Mark a task completed.", inputSchema: { type: "object", required: ["id"], properties: { id: { type: "integer" } } } },
  { name: "daily_brief", description: "Get today's tasks, overdue tasks, completed tasks, and unscheduled work.", inputSchema: { type: "object", properties: {} } }
];

function auth(req: NextRequest) {
  const expected = process.env.MCP_ACCESS_TOKEN;
  const provided = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(expected && provided && expected === provided);
}

function rpc(id: unknown, result?: unknown, error?: { code: number; message: string }) {
  return NextResponse.json(error ? { jsonrpc: "2.0", id, error } : { jsonrpc: "2.0", id, result });
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, method, params } = body;

  if (method === "initialize") return rpc(id, { protocolVersion: "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "ali-task-console", version: "1.0.0" } });
  if (method === "notifications/initialized") return new NextResponse(null, { status: 202 });
  if (method === "tools/list") return rpc(id, { tools });

  if (method === "tools/call") {
    try {
      const name = params?.name;
      const args = params?.arguments || {};
      let data;
      if (name === "list_tasks") data = await rails("/tasks" + (args.status ? "?status=" + encodeURIComponent(args.status) : ""));
      else if (name === "create_task") data = await rails("/tasks", { method: "POST", body: JSON.stringify({ task: { ...args, source: "chatgpt", created_by: "assistant", timezone: "Asia/Baghdad" } }) });
      else if (name === "update_task") { const { id: taskId, ...task } = args; data = await rails("/tasks/" + taskId, { method: "PATCH", body: JSON.stringify({ task }) }); }
      else if (name === "complete_task") data = await rails("/tasks/" + args.id + "/complete", { method: "POST" });
      else if (name === "daily_brief") data = await rails("/brief/daily?timezone=Baghdad");
      else return rpc(id, undefined, { code: -32602, message: "Unknown tool" });
      return rpc(id, { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data });
    } catch (error) {
      return rpc(id, { content: [{ type: "text", text: error instanceof Error ? error.message : "Tool failed" }], isError: true });
    }
  }

  return rpc(id, undefined, { code: -32601, message: "Method not found" });
}

export async function GET() {
  return NextResponse.json({ name: "Ali Task Console MCP", transport: "Streamable HTTP JSON-RPC", tools: tools.map(t => t.name) });
}
