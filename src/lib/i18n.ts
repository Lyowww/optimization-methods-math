export type Locale = "en" | "hy";

export const translations = {
  en: {
    appName: "Optimization Methods Visual Lab",
    appNameShort: "Optimization Lab",
    tagline:
      "Interactive laboratory for constrained optimization, linear programming, and the calculus of variations",

    tabInput: "Input",
    tabGraph: "Graph",
    tabSolution: "Solution",
    tabSummary: "Summary",
    tabFormulas: "Formulas",
    tabSteps: "Steps",
    tabStatic: "Static Plot",
    tabInputHint: "Enter the problem data, then run the analysis.",
    plotHint: "Pinch to zoom on mobile · use the toolbar to export",
    emptySolution: "No solution yet",
    emptySolutionHint: "Fill in the input tab and press Run Analysis.",
    rawData: "Complete Result Data",
    resultSummary: "Key Solver Values",
    noStaticPlot: "Run the analysis to generate the static plot.",

    dashboard: "Dashboard",
    methods: "Modules",

    run: "Run Analysis",
    reset: "Reset",

    copy: "Copy Solution",
    exportPdf: "Export PDF",
    example: "Load Example",

    converged: "Optimal Solution Found",
    notConverged: "No Feasible Solution Found",

    iterations: "Iterations",
    result: "Result",

    formulas: "Formulas",
    input: "Input",
    error: "Error",

    downloadPng: "Download PNG",

    selectMethod: "Select a Module",
    explore: "Explore Modules",

    homeHero:
      "An interactive mathematical laboratory for constrained optimization, linear programming, graphical solution methods, and the calculus of variations.",

    sidebar: "Modules",

    language: "Language",
    theme: "Theme",

    light: "Light",
    dark: "Dark",

    back: "Back",

    loading: "Computing…",

    validationError: "Validation Error",

    stepTable: "Step-by-Step Solution",

    staticPlot: "Static Plot (Matplotlib)",
    interactivePlot: "Interactive Plot (Plotly)",

    objective: "Objective Function f(x₁,x₂,...)",

    equalities: "Equality Constraints (g(x)=0)",
    inequalities: "Inequality Constraints (h(x)≤0)",

    addConstraint: "Add Constraint",

    constraints: "Linear Constraints",

    objectiveSense: "Optimization Goal",

    objectiveCoeffs: "Objective Function Coefficients (c₁, c₂)",

    maximize: "Maximize",
    minimize: "Minimize",

    integrand: "Integrand Function F(x,y,y′)",

    intervalA: "Interval Start a",
    intervalB: "Interval End b",

    boundaryYa: "y(a)",
    boundaryYb: "y(b)",

    animationFrame: "Objective Function Line Position",

    creatorName: "Lyova Hovhannisyan",

    projectCredit:
      "This project was developed by Lyova Hovhannisyan, a third-year Information Security student at the Faculty of Informatics and Applied Mathematics, Yerevan State University, for the course Optimization Methods. Instructor: Rafik Khachatryan.",

    methodsList: {
      "constrained-extremum": {
        title: "Constrained Optimization",
        desc:
          "Lagrange multipliers, KKT conditions, Hessian analysis, contour plots, and feasible regions",
      },

      "linear-programming": {
        title: "Linear Programming",
        desc:
          "Simplex method, optimal solution, active constraints, and objective value",
      },

      "graphical-lp": {
        title: "Graphical Linear Programming",
        desc:
          "Feasible region visualization, animated objective function line, and optimal vertex",
      },

      "calculus-of-variations": {
        title: "Calculus of Variations",
        desc:
          "Euler–Lagrange equation, extremal curve, and functional value",
      },
    },
  },

  hy: {
    appName: "Օպտիմիզացիայի մեթոդների վիզուալ լաբորատորիա",
    appNameShort: "Օպտիմիզացիայի լաբորատորիա",

    tagline:
      "Ինտերակտիվ լաբորատորիա սահմանափակված օպտիմիզացման, գծային ծրագրավորման և տարողական հաշվարկի համար",

    tabInput: "Մուտք",
    tabGraph: "Գրաֆիկ",
    tabSolution: "Լուծում",
    tabSummary: "Ամփոփում",
    tabFormulas: "Բանաձևեր",
    tabSteps: "Քայլեր",
    tabStatic: "Ստատիկ գրաֆիկ",
    tabInputHint: "Մուտքագրեք խնդրի տվյալները, ապա գործարկեք վերլուծությունը։",
    plotHint:
      "Բջջայինում մեծացնելու համար օգտագործեք մատների շարժումը · արտահանման համար օգտվեք գործիքագոտուց",
    emptySolution: "Լուծում դեռ չկա",
    emptySolutionHint:
      "Լրացրեք մուտքային տվյալները և սեղմեք «Գործարկել վերլուծությունը»։",
    rawData: "Արդյունքի ամբողջական տվյալներ",
    resultSummary: "Լուծիչի հիմնական արժեքները",
    noStaticPlot: "Գործարկեք վերլուծությունը՝ ստատիկ գրաֆիկ ստանալու համար։",

    dashboard: "Վահանակ",
    methods: "Մոդուլներ",

    run: "Գործարկել վերլուծությունը",
    reset: "Վերականգնել",

    copy: "Պատճենել լուծումը",
    exportPdf: "Արտահանել PDF",
    example: "Բեռնել օրինակ",

    converged: "Օպտիմալ լուծումը գտնվել է",
    notConverged: "Թույլատրելի լուծում չի գտնվել",

    iterations: "Իտերացիաներ",
    result: "Արդյունք",

    formulas: "Բանաձևեր",
    input: "Մուտքային տվյալներ",
    error: "Սխալ",

    downloadPng: "Ներբեռնել PNG",

    selectMethod: "Ընտրեք մոդուլը",
    explore: "Ուսումնասիրել մոդուլները",

    homeHero:
      "Ինտերակտիվ մաթեմատիկական լաբորատորիա սահմանափակված օպտիմիզացման, գծային ծրագրավորման, գրաֆիկական լուծման մեթոդների և տարողական հաշվարկի ուսումնասիրման համար։",

    sidebar: "Մոդուլներ",

    language: "Լեզու",
    theme: "Թեմա",

    light: "Բաց",
    dark: "Մուգ",

    back: "Հետ",

    loading: "Հաշվարկվում է…",

    validationError: "Տվյալների ստուգման սխալ",

    stepTable: "Քայլ առ քայլ լուծում",

    staticPlot: "Ստատիկ գրաֆիկ (Matplotlib)",
    interactivePlot: "Ինտերակտիվ գրաֆիկ (Plotly)",

    objective: "Նպատակային ֆունկցիա f(x₁,x₂,...)",

    equalities: "Հավասարության սահմանափակումներ (g(x)=0)",
    inequalities: "Անհավասարության սահմանափակումներ (h(x)≤0)",

    addConstraint: "Ավելացնել սահմանափակում",

    constraints: "Գծային սահմանափակումներ",

    objectiveSense: "Օպտիմիզացման նպատակ",

    objectiveCoeffs: "Նպատակային ֆունկցիայի գործակիցներ (c₁, c₂)",

    maximize: "Մաքսիմալացնել",
    minimize: "Մինիմալացնել",

    integrand: "Ինտեգրանդ ֆունկցիա F(x,y,y′)",

    intervalA: "Միջակայքի սկիզբ a",
    intervalB: "Միջակայքի վերջ b",

    boundaryYa: "y(a)",
    boundaryYb: "y(b)",

    animationFrame: "Նպատակային ֆունկցիայի ուղղի դիրք",

    creatorName: "Լյովա Հովհաննիսյան",

    projectCredit:
      "Այս նախագիծը մշակվել է Երևանի պետական համալսարանի Ինֆորմատիկայի և կիրառական մաթեմատիկայի ֆակուլտետի Տեղեկատվական անվտանգության 3-րդ կուրսի ուսանող Լյովա Հովհաննիսյանի կողմից՝ «Օպտիմիզացիայի մեթոդներ» առարկայի շրջանակում։ Դասախոս՝ Ռաֆիկ Խաչատրյան։",

    methodsList: {
      "constrained-extremum": {
        title: "Սահմանափակված օպտիմիզացում",
        desc:
          "Լագրանժի բազմապատիկներ, KKT պայմաններ, Գեսսեի մատրիցայի վերլուծություն, մակարդակագծեր և թույլատրելի տիրույթ",
      },

      "linear-programming": {
        title: "Գծային ծրագրավորում",
        desc:
          "Սիմպլեքս մեթոդ, օպտիմալ լուծում, ակտիվ սահմանափակումներ և նպատակային ֆունկցիայի արժեք",
      },

      "graphical-lp": {
        title: "Գրաֆիկական գծային ծրագրավորում",
        desc:
          "Թույլատրելի տիրույթի վիզուալիզացիա, նպատակային ֆունկցիայի ուղղի անիմացիա և օպտիմալ գագաթ",
      },

      "calculus-of-variations": {
        title: "Տարողական հաշվարկ",
        desc:
          "Էյլեր–Լագրանժի հավասարում, ծայրագիծ և ֆունկցիոնալի արժեք",
      },
    },
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] as string;
}