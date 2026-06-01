# Optimization Methods Visual Lab

Interactive **Optimization Methods Visual Lab** for university teaching — constrained extrema (Lagrange / KKT), linear programming, graphical LP with animated objective lines, and calculus of variations (Euler–Lagrange).

**Languages:** English (en) · Armenian (hy)

**Author:** Lyova Hovhannisyan — Yerevan State University, Faculty of Informatics and Applied Mathematics, Optimization Methods course (Instructor: Rafik Khachatryan).

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Plotly.js, KaTeX |
| Backend | FastAPI, SymPy, NumPy, SciPy, Matplotlib |

## Modules

1. **Constrained Extremum Solver** — Lagrange multipliers, Kuhn–Tucker conditions, Hessian classification, contours & feasible region  
2. **Linear Programming Solver** — SciPy simplex (HiGHS), active constraints, feasible region  
3. **Graphical LP Visualizer** — constraint lines, shaded feasible region, animated objective line, optimal vertex  
4. **Calculus of Variations** — Euler–Lagrange derivation, extremal curve, functional value  

All interactive charts support **hover**, **zoom**, **pan** (Plotly toolbar), plus **PNG** (matplotlib / download) and **PDF** (lab export).

## Quick start

### 1. Python API

```bash
cd python-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Next.js frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). API calls use `/api/*` rewrites to the Python backend (see `next.config.ts`).

## API endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/constrained-extremum` | Objective + equality/inequality constraints |
| `POST /api/linear-programming` | LP (2 variables for plots) |
| `POST /api/graphical-lp` | 2D graphical LP visualization data |
| `POST /api/calculus-of-variations` | Integrand F(x,y,y′), interval, boundary values |

## Project structure

```
├── api/index.py              # Vercel Python serverless entry
├── python-api/
│   ├── main.py
│   └── solvers/              # Optimization implementations
├── src/app/methods/          # Four module pages
├── src/components/           # Lab UI, Plotly charts
└── src/lib/                  # API client, i18n, plots
```

## Author

**Lyova Hovhannisyan**

Այս նախագիծը պատրաստվել է Երևանի պետական համալսարանի ինֆորմատիկա և կիրառական մաթեմատիկա ֆակուլտետի Տեղեկատվական անվտանգության 3-րդ կուրսի ուսանող Լյովա Հովհաննիսյանի կողմից «Օպտիմիզացիայի մեթոդներ» առարկայի համար։ Դասախոս՝ Խաչատրյան Ռաֆիկ
