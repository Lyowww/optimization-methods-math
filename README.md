# Numerical Methods Visual Lab

Interactive **Numerical Methods Visual Lab** for university teaching — step-by-step solutions, KaTeX formulas, Plotly interactive charts, and matplotlib static exports.

**Languages:** English (en) · Armenian (hy)

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Plotly.js, KaTeX |
| Backend | FastAPI, NumPy, SymPy, Matplotlib |

## Methods

1. **Newton-Raphson** — tangents, iteration table, animation slider  
2. **Jacobi** — convergence & residual plots  
3. **Gauss-Seidel** — same + **Jacobi vs GS comparison**  
4. **Lagrange interpolation** — editable points, optional basis polynomials  
5. **Least squares** — fit line, residuals, SSE  
6. **LU decomposition** — L/U display, substitution steps  

**Problem Analyzer** (`/analyze`) parses natural-language input and opens the matching method with prefilled parameters.

## Quick start

### 1. Python API

```bash
cd python-api
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### 2. Next.js frontend

```bash
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

Local dev proxies `/api/*` → `http://127.0.0.1:8000` via `next.config.ts` (run uvicorn in another terminal). No `.env` required.

## Deploy to Vercel

The repo is configured for **one Vercel project**: Next.js frontend + Python FastAPI in serverless (`api/index.py`).

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → import your repository  
2. **Framework preset:** Next.js (auto-detected)  
3. **Build command:** `npm run build` (default)  
4. **Install command:** `npm install` (default)  
5. Deploy

No `NEXT_PUBLIC_API_URL` needed in production — the browser calls `/api/...` on the same domain; `vercel.json` rewrites those requests to the Python function.

### 3. Optional environment variables (Vercel dashboard)

| Variable | When to use |
|----------|-------------|
| `ALLOWED_ORIGINS` | Custom domain, e.g. `https://numerical-lab.youruni.edu` |
| `NEXT_PUBLIC_API_URL` | Only if API is hosted elsewhere (not recommended) |

### 4. Plan notes

The Python function uses **NumPy, SymPy, and Matplotlib** (~large cold start).

- **Hobby (default):** `maxDuration: 10`, `memory: 2048` (personal account max)  
- First request after idle may be slow (cold start with SymPy/Matplotlib); retry if it times out  
- **Pro:** you can raise `maxDuration` to 60 in `vercel.json`

### 5. Verify after deploy

- Open `https://<your-project>.vercel.app`  
- Run any method (e.g. Newton → **Run Analysis**)  
- If errors appear, check **Vercel → Project → Logs** for the `api/index` function  

### Project layout (Vercel)

```
api/index.py          # Serverless entry → imports python-api/main.py
requirements.txt      # Python deps for Vercel
vercel.json           # Rewrites /api/* → Python, function limits
python-api/           # FastAPI + solvers (shared with local uvicorn)
```

## API endpoints

| Method | POST path |
|--------|-----------|
| Newton | `/api/newton` |
| Jacobi | `/api/jacobi` |
| Gauss-Seidel | `/api/gauss-seidel` |
| Compare Jacobi/GS | `/api/gauss-seidel/compare` |
| Lagrange | `/api/interpolation/lagrange` |
| Least squares | `/api/least-squares` |
| LU | `/api/lu` |
| Problem analyzer | `/api/analyze-problem` |

Response shape:

```json
{
  "method": "...",
  "input": {},
  "iterations": [],
  "result": {},
  "error": null,
  "converged": true,
  "formulas": {},
  "plotData": {},
  "matplotlibImageBase64": "..."
}
```

## Pages

- `/` — Dashboard  
- `/methods` — Method selector  
- `/methods/[method]` — Input + charts + results  
- `/analyze` — Problem Analyzer  

## Example problems

Built-in **Load Example** on each method page matches the assignment spec (Newton `x³-2x-5`, Jacobi/GS 3×3 system, Lagrange/LS points, LU system).

## Features

- Dark / light theme  
- EN / HY UI strings  
- Glassmorphism layout (input | chart | results)  
- Export PDF, copy JSON solution, download matplotlib PNG  
- Hover tooltips on Plotly charts (exact x, y)  

## Project structure

```
├── api/index.py          # Vercel Python serverless entry
├── vercel.json           # Vercel config (rewrites + function settings)
├── requirements.txt      # Python deps (Vercel)
├── src/app/              # Next.js pages
├── src/components/       # UI, charts, lab layout
├── src/lib/              # API client, i18n, plots
├── python-api/
│   ├── main.py           # FastAPI app
│   └── solvers/          # Numerical implementations
└── README.md
```

## Author

**Lyova Hovhannisyan**

Այս նախագիծը պատրաստվել է Երևանի պետական համալսարանի ինֆորմատիկա և կիրառական մաթեմատիկա ֆակուլտետի Տեղեկատվական անվտանգության 3-րդ կուրսի ուսանող Լյովա Հովհաննիսյանի կողմից «Օպտիմիզացիայի մեթոդներ» առարկայի համար։ Դասախոս՝ Խաչատրյան Ռաֆիկ
