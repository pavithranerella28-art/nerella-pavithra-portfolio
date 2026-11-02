# Nerella Pavithra — Portfolio

A dark, technical, motion-led developer portfolio in the "Signal HUD" aesthetic showcasing data analytics projects, interactive dashboards, and telemetry workflows.

**Live site:** https://YOUR-SITE-URL/

## Tech Stack
- **React 19** — Component-driven reactive user interface
- **Vite** — Next-generation frontend tooling and fast HMR
- **Tailwind CSS 4** — Modern utility-first CSS styling
- **GSAP + ScrollTrigger** — High-performance choreographed animations and pinning
- **Lenis** — Hardware-accelerated smooth scrolling
- **three.js** — Interactive 3D WebGL centerpiece
- **EmailJS** — Client-side contact form transmission

## Run Locally

Clone the repository and install the dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Environment Variables

To enable direct email sending from the contact form, copy `.env.example` to `.env` and set your credentials:
```env
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```
*(If unconfigured, the contact form will automatically fall back to opening a pre-formatted email via your default mail client).*

## Credits

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).
