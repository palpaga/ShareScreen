export class RoomDO implements DurableObject {
  state: DurableObjectState; env: any;
  host: WebSocket | null = null;
  vBySock = new Map<WebSocket,string>();
  vById = new Map<string,WebSocket>();
  constructor(state: DurableObjectState, env: any){ this.state = state; this.env = env; }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname !== "/ws" || req.headers.get("Upgrade") !== "websocket") {
      return new Response("not found", { status: 404 });
    }
    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    server.accept();

    const role = url.searchParams.get("role");
    if (role === "host") {
      if (this.host) {
        try { server.send(JSON.stringify({ type:"error", reason:"host-exists" })); } catch {}
        server.close(1013, "host already connected");
        return new Response(null, { status: 101, webSocket: client });
      }
      this.host = server;
      this.sendViewerCount();
      server.addEventListener("message", (e)=>this.onHostMessage(server,e));
      const close = ()=>this.onHostClose(server);
      server.addEventListener("close", close);
      server.addEventListener("error", close);
    } else {
      const viewerId = crypto.randomUUID();
      this.vBySock.set(server, viewerId);
      this.vById.set(viewerId, server);
      this.toHost({ type:"viewer-joined", viewerId });
      this.sendViewerCount();
      server.addEventListener("message", (e)=>this.onViewerMessage(server,e));
      const close = ()=>this.onViewerClose(server);
      server.addEventListener("close", close);
      server.addEventListener("error", close);
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  private onHostMessage(_ws: WebSocket, e: MessageEvent){ let m:any; try{ m=JSON.parse(e.data as string); }catch{return;}
    if (m?.type === "signal"){
      const { target, data } = m;
      if (typeof target === "string"){
        const v = this.vById.get(target);
        if (v && v.readyState === 1) { try{ v.send(JSON.stringify({ type:"signal", from:"host", data })); }catch{} }
      } else {
        const s = JSON.stringify({ type:"signal", from:"host", data });
        for (const v of this.vById.values()) if (v.readyState === 1) { try{ v.send(s); }catch{} }
      }
    }
  }
  private onViewerMessage(ws: WebSocket, e: MessageEvent){ const fromId = this.vBySock.get(ws); if (!fromId) return;
    let m:any; try{ m=JSON.parse(e.data as string); }catch{return;}
    if (m?.type === "signal") this.toHost({ type:"signal", from: fromId, data: m.data });
  }
  private onHostClose(ws: WebSocket){ if (this.host !== ws) return; this.host = null;
    const msg = JSON.stringify({ type:"host-left" });
    for (const v of this.vById.values()){ try{ v.send(msg); v.close(1001,"host left"); }catch{} }
    this.vById.clear(); this.vBySock.clear(); this.sendViewerCount();
  }
  private onViewerClose(ws: WebSocket){ const id = this.vBySock.get(ws); if (!id) return;
    this.vBySock.delete(ws); this.vById.delete(id);
    this.toHost({ type:"viewer-left", viewerId: id }); this.sendViewerCount();
  }
  private toHost(payload:any){ if (this.host && this.host.readyState===1){ try{ this.host.send(JSON.stringify(payload)); }catch{} } }
  private sendViewerCount(){ const n = this.vById.size; const s = JSON.stringify({ type:"viewer-count", data:{ viewerCount:n } });
    if (this.host && this.host.readyState===1) this.host.send(s);
    for (const v of this.vById.values()) if (v.readyState===1){ try{ v.send(s); }catch{} }
  }
}

export default { async fetch(){ return new Response("ok"); } };
