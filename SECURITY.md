
# Security Policy

## Reporting a vulnerability

- Please **do not open a public issue** for security reports.
- Instead, email the maintainers (contact in repo description).
- We will acknowledge and coordinate disclosure responsibly.

## Threat model

- Connections are **peer-to-peer WebRTC**.
- Workers are only used for **signaling** and config.
- No TURN or media relay is used.
- **IP addresses of peers are exposed** by design.

## Abuse disclaimer

- This tool is meant for **private, lightweight screen sharing**.
- Any use for **illegal streaming, rebroadcast, or malicious purposes** is prohibited.
- You are responsible for your own use.
