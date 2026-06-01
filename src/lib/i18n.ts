export type Locale = "en" | "hy";

export const translations = {
  en: {
    appName: "Numerical Methods Visual Lab",
    tagline: "Interactive step-by-step numerical analysis for university teaching",
    dashboard: "Dashboard",
    methods: "Methods",
    analyze: "Problem Analyzer",
    run: "Run Analysis",
    reset: "Reset",
    copy: "Copy Solution",
    exportPdf: "Export PDF",
    example: "Load Example",
    converged: "Converged",
    notConverged: "Did not converge",
    iterations: "Iterations",
    result: "Result",
    formulas: "Formulas",
    input: "Input",
    error: "Error",
    tolerance: "Tolerance",
    maxIterations: "Max iterations",
    downloadPng: "Download PNG",
    analyzing: "Analyzing…",
    parseAndRun: "Parse & Run",
    selectMethod: "Select a Method",
    explore: "Explore Methods",
    homeHero:
      "A premium visual laboratory for roots, linear systems, interpolation, and least squares.",
    sidebar: "Methods",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    back: "Back",
    loading: "Computing…",
    validationError: "Validation error",
    compareMode: "Compare Jacobi vs Gauss-Seidel",
    showBasis: "Show basis polynomials",
    numericalDerivative: "Numerical derivative",
    function: "f(x)",
    derivative: "f'(x)",
    initialX: "Initial x₀",
    matrixA: "Matrix A",
    vectorB: "Vector b",
    vectorX0: "Initial x₀",
    points: "Points",
    addPoint: "Add point",
    removePoint: "Remove",
    stepTable: "Step-by-step table",
    staticPlot: "Static plot (matplotlib)",
    interactivePlot: "Interactive plot",
    problemPlaceholder:
      "e.g. Solve Ax=b using Jacobi with A=[[10,1,1],[2,10,1],[2,2,10]], b=[12,13,14], x0=[0,0,0]",
    creatorName: "Lyova Hovhannisyan",
    projectCredit:
      "This project was created by Lyova Hovhannisyan, a 3rd-year Information Security student at the Faculty of Informatics and Applied Mathematics, Yerevan State University, for the course Optimization Methods. Instructor: Rafik Khachatryan.",
    methodsList: {
      newton: {
        title: "Newton Method",
        desc: "Root finding with tangent lines and animated iterations",
      },
      jacobi: {
        title: "Jacobi Method",
        desc: "Iterative solution of Ax = b with convergence charts",
      },
      "gauss-seidel": {
        title: "Gauss-Seidel",
        desc: "Faster iterative updates with comparison mode",
      },
      lagrange: {
        title: "Lagrange Interpolation",
        desc: "Drag points and visualize the interpolating polynomial",
      },
      "least-squares": {
        title: "Least Squares",
        desc: "Best-fit line with residuals and SSE",
      },
      lu: {
        title: "LU Decomposition",
        desc: "L/U factorization with forward and backward substitution",
      },
    },
  },

  hy: {
    appName: "Թվային Մեթոդների Վիզուալ Լաբորատորիա",
    tagline:
      "Ինտերակտիվ քայլ առ քայլ թվային վերլուծություն համալսարանական ուսուցման համար",

    dashboard: "Վահանակ",
    methods: "Մեթոդներ",
    analyze: "Խնդրի վերլուծություն",
    run: "Գործարկել",
    reset: "Վերականգնել",
    copy: "Պատճենել լուծումը",
    exportPdf: "Արտահանել PDF",
    example: "Բեռնել օրինակ",

    converged: "Զուգամիտել է",
    notConverged: "Չի զուգամիտել",

    iterations: "Իտերացիաներ",
    result: "Արդյունք",
    formulas: "Բանաձևեր",
    input: "Մուտքային տվյալներ",
    error: "Սխալ",

    tolerance: "Թույլատրելի սխալ",
    maxIterations: "Առավելագույն իտերացիաներ",

    downloadPng: "Ներբեռնել PNG",

    analyzing: "Վերլուծվում է…",
    parseAndRun: "Վերլուծել և գործարկել",

    selectMethod: "Ընտրեք մեթոդը",
    explore: "Ուսումնասիրել մեթոդները",

    homeHero:
      "Ժամանակակից վիզուալ լաբորատորիա հավասարումների արմատների, գծային համակարգերի, ինտերպոլյացիայի և ամենափոքր քառակուսիների մեթոդի ուսումնասիրման համար։",

    sidebar: "Մեթոդներ",

    language: "Լեզու",
    theme: "Թեմա",

    light: "Բաց",
    dark: "Մուգ",

    back: "Հետ",

    loading: "Հաշվարկվում է…",

    validationError: "Տվյալների ստուգման սխալ",

    compareMode: "Համեմատել Ժակոբիի և Գաուս-Զեյդելի մեթոդները",

    showBasis: "Ցույց տալ բազիսային բազմանդամները",

    numericalDerivative: "Թվային ածանցյալ",

    function: "f(x)",
    derivative: "f'(x)",

    initialX: "Սկզբնական x₀",

    matrixA: "A մատրիցա",
    vectorB: "b վեկտոր",
    vectorX0: "Սկզբնական x₀",

    points: "Կետեր",
    addPoint: "Ավելացնել կետ",
    removePoint: "Հեռացնել",

    stepTable: "Քայլ առ քայլ աղյուսակ",

    staticPlot: "Ստատիկ գրաֆիկ (Matplotlib)",
    interactivePlot: "Ինտերակտիվ գրաֆիկ",

    problemPlaceholder:
      "Օրինակ՝ լուծել Ax=b համակարգը Ժակոբիի մեթոդով, որտեղ A=[[10,1,1],[2,10,1],[2,2,10]], b=[12,13,14], x0=[0,0,0]",

    creatorName: "Լյովա Հովհաննիսյան",
    projectCredit:
      "Այս նախագիծը պատրաստվել է Երևանի պետական համալսարանի ինֆորմատիկա և կիրառական մաթեմատիկա ֆակուլտետի Տեղեկատվական անվտանգության 3-րդ կուրսի ուսանող Լյովա Հովհաննիսյանի կողմից «Օպտիմիզացիայի մեթոդներ» առարկայի համար։ Դասախոս՝ Խաչատրյան Ռաֆիկ",

    methodsList: {
      newton: {
        title: "Նյուտոնի մեթոդ",
        desc: "Արմատի որոնում շոշափողի մեթոդով և իտերացիաների անիմացիայով",
      },

      jacobi: {
        title: "Ժակոբիի մեթոդ",
        desc: "Ax = b համակարգի իտերատիվ լուծում զուգամիտման գրաֆիկներով",
      },

      "gauss-seidel": {
        title: "Գաուս-Զեյդելի մեթոդ",
        desc: "Ավելի արագ իտերատիվ թարմացումներ համեմատման ռեժիմով",
      },

      lagrange: {
        title: "Լագրանժի ինտերպոլյացիա",
        desc: "Տեղափոխեք կետերը և դիտարկեք ինտերպոլացնող բազմանդամը",
      },

      "least-squares": {
        title: "Ամենափոքր քառակուսիների մեթոդ",
        desc: "Լավագույն մոտարկող ուղիղ, մնացորդներ և SSE",
      },

      lu: {
        title: "LU տարրալուծում",
        desc: "L/U գործոնացում՝ ուղիղ և հակադարձ տեղադրմամբ",
      },
    },
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] as string;
}