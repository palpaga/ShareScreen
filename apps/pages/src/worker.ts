export interface Env {
    ROOM: DurableObjectNamespace;
    STUN_URLS: string;
    ASSETS: { fetch: (req: Request) => Promise<Response> };
}

export default {
    async fetch(req: Request, env: Env): Promise<Response> {
        const url = new URL(req.url);

        if (url.pathname === "/health") return new Response("ok");

        if (url.pathname === "/config") {
            const stun = (env.STUN_URLS || "").split(",").map(s => s.trim()).filter(Boolean);
            const iceServers = stun.length ? [{ urls: stun }] :
                [{ urls: ["stun:stun.l.google.com:19302"] }];
            return new Response(JSON.stringify({ iceServers }), {
                headers: { "content-type": "application/json", "cache-control": "no-store" },
            });
        }

        if (url.pathname === "/ws" && req.headers.get("Upgrade") === "websocket") {
            const room = url.searchParams.get("room");
            const role = url.searchParams.get("role");
            if (!room || !/^[a-zA-Z0-9_-]{2,64}$/.test(room)) return new Response("bad room", { status: 400 });
            if (role !== "host" && role !== "viewer") return new Response("bad role", { status: 400 });

            const id = env.ROOM.idFromName(room);
            const stub = env.ROOM.get(id);
            return stub.fetch(req);
        }

        if (new URL(req.url).pathname === "/diag") {
            return new Response(JSON.stringify({ hasROOM: !!(env as any).ROOM }), {
                headers: { "content-type": "application/json" }
            });
        }

        return env.ASSETS.fetch(req);
    },
};
