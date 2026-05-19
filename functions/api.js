export async function onRequest(context) {
  const kv = context.env.KANBAN;

  if (context.request.method === "GET") {
    let data = await kv.get("board", { type: "json" });
    if (!data) {
      data = {
        todo: [],
        inprogress: [],
        review: [],
        complete: []
      };
      await kv.put("board", JSON.stringify(data));
    }
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  }

  if (context.request.method === "POST") {
    const body = await context.request.json();
    await kv.put("board", JSON.stringify(body));
    return new Response("OK");
  }
}
