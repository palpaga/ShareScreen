# ShareScreen.live

**ShareScreen.live** is a minimal **peer-to-peer screencast tool** built with **WebRTC**.  
The goal is simple: share your screen in one click — no accounts, no plugins, no complexity.

---

## 🚀 Features

- 🎥 **Live screen sharing** using WebRTC  
- 🌐 **Peer-to-peer connection**: no TURN server is used  
- ⚠️ Works only if peers are not behind **strict NAT**  
- ⚡ Fully deployed on **Cloudflare Pages** (frontend) + **Cloudflare Worker** (backend)  
- 🗂️ **Durable Object (DO)** used only for WebSocket session persistence  
- 🔧 `/config` endpoint serving ICE configuration (**STUN only**)  

---

## 🏗️ Architecture

- **Frontend** → deployed on **Cloudflare Pages**  
  Provides the UI to create/join a session and start screencasting.  

- **WebSocket Worker** → deployed on **Cloudflare Worker**  
  Handles signaling between peers via WebSocket.  
  Requires persistence, which is why a **Durable Object** is used.  

- **Simple `/config` Worker** → provides ICE server configuration to clients (STUN only).  

---

## 🤝 Contributing

Initial development and guidance with the help of **ChatGPT (OpenAI)**  
Contributions are welcome!  
Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a Pull Request.  

---

## 📦 Deployment

- **Frontend** → Cloudflare Pages  
- **Backend signaling** → Cloudflare Worker + Durable Object  
- **Config endpoint** → `/config` handled by Worker  

---

## ⚠️ Disclaimer

This tool establishes **direct peer-to-peer WebRTC connections**.  
That means:

- Your **IP address is directly visible** to other peers in the session.  
- If used for malicious or public rebroadcasting purposes, **you are responsible** for any misuse.  
- This project is intended as a **lightweight private tool**, not for large-scale streaming.  
