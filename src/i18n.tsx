import mediaJson from './media.json'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'pt' | 'en'

export type ThemeId = 'default' | 'light' | 'dark' | 'batman' | 'kitty'
export type Media = {
  frame: 'wide' | 'tall'
  themes: [ThemeId] | [ThemeId, ThemeId]
  video?: true
  trailer?: true
}

const caseIds = ['strackz', 'tws', 'sgymz', 'face', 'graoraro'] as const
export type CaseId = (typeof caseIds)[number]

type CaseBase = {
  name: string
  tier: 'featured' | 'smaller'
  status: 'live' | 'personal' | 'local'
  url?: string
  repo?: string
  media?: Media
  stack: string[]
}
type CaseText = { summary: string; points: string[] }
export type CaseFile = { id: CaseId } & CaseBase & CaseText

const caseBase: Record<CaseId, CaseBase> = {
  strackz: {
    name: 'StrackZ',
    tier: 'featured',
    status: 'live',
    url: 'https://strackz.sinovaz.com',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind', 'Radix UI', 'Recharts'],
  },
  tws: {
    name: 'TWS Score',
    tier: 'featured',
    status: 'personal',
    repo: 'https://github.com/PeSzpak/tws-score',
    stack: ['React 19', 'TypeScript', 'Vite', 'Supabase', 'Google Places API', 'Leaflet', 'PWA', 'Vitest'],
  },
  sgymz: {
    name: 'SgymZ',
    tier: 'smaller',
    status: 'personal',
    repo: 'https://github.com/PeSzpak/SgymZ',
    stack: ['Next.js 16', 'Supabase', 'Tailwind 4', 'Zod', 'Bun'],
  },
  face: {
    name: 'Face Recognition Pro',
    tier: 'smaller',
    status: 'local',
    repo: 'https://github.com/PeSzpak/face-recognition-pro',
    stack: ['Python', 'FastAPI', 'DeepFace', 'Qdrant', 'PostgreSQL', 'React', 'Docker'],
  },
  graoraro: {
    name: 'Grão Raro',
    tier: 'smaller',
    status: 'live',
    url: 'https://grao-raro.sinovaz.com',
    stack: ['Next.js 16', 'TypeScript', 'MySQL', 'Drizzle', 'Zod', 'Asaas', 'Vitest'],
  },
}

// src/media.json is the single declaration of which files exist; scripts/media-check.mjs proves them.
const media = mediaJson as unknown as Partial<Record<CaseId, Media>>

const buildFiles = (text: Record<CaseId, CaseText>): CaseFile[] =>
  caseIds.map((id) => ({ id, ...caseBase[id], media: media[id], ...text[id] }))

export type Job = {
  when: string
  company: string
  role: string
  where: string
  points: string[]
  stack?: string[]
}

export type Method = { title: string; body: string[]; link?: { label: string; href: string } }

export type Pouch = { name: string; tools: string[] }

export type ArchiveEntry = { name: string; note: string; href: string }

const shared = {
  email: 'pedrohszpaka@gmail.com',
  github: 'https://github.com/PeSzpak',
  linkedin: 'https://linkedin.com/in/pedro-szpak04',
  cv: 'https://peszpak.github.io/PedroSzpak-SoftwareDeveloper.pdf',
}

const ptText: Record<CaseId, CaseText> = {
  strackz: {
    summary: 'Gerenciador financeiro pessoal com o método 50/30/20. Comecei para organizar o meu dinheiro e hoje roda em produção.',
    points: [
      'Transações, contas recorrentes e parcelamentos com status que se atualizam sozinhos.',
      'Login com Supabase Auth e dados isolados por usuário com Row Level Security no PostgreSQL.',
      'Painéis de orçamento por categoria e progresso do 50/30/20 em tempo real.',
    ],
  },
  tws: {
    summary: 'PWA para um casal avaliar os cafés e restaurantes que visita. Cada um avalia no próprio celular, e a nota do outro só aparece quando os dois terminam.',
    points: [
      'A nota surpresa é regra do banco. A política de RLS só devolve a avaliação do outro quando o lugar já tem duas.',
      'Busca no Google Places preenche tipo, endereço e localização. O mapa usa Leaflet e OpenStreetMap.',
      'As regras de acesso têm testes que rodam contra o banco real.',
    ],
  },
  sgymz: {
    summary: 'Gerenciador de treinos que fiz para mim e para minha namorada. Eu monto os treinos, ela registra como foi. Dois temas: Batman para mim, Hello Kitty para ela.',
    points: [
      'Modo treino com carga do último treino já preenchida, timer de descanso e progresso salvo no aparelho.',
      'Painel do admin para atribuir programas, ver a evolução de cada pessoa e responder pedidos de ajuste.',
      'RLS no Supabase para cada pessoa só ver o que é dela.',
    ],
  },
  face: {
    summary: 'Reconhecimento facial que roda inteiro na sua máquina. Cadastra pessoas com algumas fotos e identifica pela câmera, por upload ou no login por Face ID.',
    points: [
      'O cadastro recusa foto borrada, escura, sem rosto ou de alguém já cadastrado, e diz o motivo.',
      'O login por Face ID usa um limiar mais rígido (0,78) que a identificação comum (0,70).',
      'Cada reconhecimento e cada tentativa de login fica no histórico. Sobe com um docker compose.',
    ],
  },
  graoraro: {
    summary: 'Loja de cafés com checkout real pelo Asaas, com Pix, crédito e débito. Trabalho da disciplina de APIs REST no Senac.',
    points: [
      'O estoque baixa dentro da transação do pedido. Dez compras simultâneas da última unidade criam um pedido e nove respostas 409.',
      'Webhook repetido não muda nada, e o status vem sempre de uma consulta ao Asaas.',
      'OpenAPI 3.1 gerado dos schemas Zod, com Swagger em /docs.',
    ],
  },
}

const pt = {
  ...shared,
  nav: { cases: 'Casos', path: 'Trajetória', method: 'Método', belt: 'Arsenal', contact: 'Contato' },
  hero: {
    first: 'Pedro',
    last: 'Szpak',
    line: 'Desenvolvedor de software. Backend, dados e IA.',
    sub: 'Construo APIs, pipelines e sistemas que ficam de pé quando ninguém está olhando. São José dos Pinhais, PR.',
    seeCases: 'Ver os casos',
    cv: 'Baixar CV',
    hint: 'Mova o cursor para guiar o sinal',
  },
  cases: {
    title: 'Casos',
    intro: 'Projetos que estão no ar ou em uso de verdade. Cada um resolveu um problema real de alguém, quase sempre meu.',
    status: { live: 'No ar', personal: 'Em uso', local: 'Roda local' },
    open: 'Abrir o site',
    demo: 'Demo',
    trailer: 'Trailer',
    views: { default: 'Tela', light: 'Claro', dark: 'Escuro', batman: 'Batman', kitty: 'Hello Kitty' } as Record<ThemeId, string>,
    code: 'Ver código',
    stackLabel: 'Feito com',
    archiveTitle: 'Arquivo',
    archiveIntro: 'Estudos e projetos menores, guardados para consulta.',
    text: ptText,
  },
  files: buildFiles(ptText),
  archive: [
    { name: 'airflow-dags-study', note: 'DAGs do Apache Airflow com Docker Compose', href: 'https://github.com/PeSzpak/airflow-dags-study' },
    { name: 'NexusAPI', note: 'API REST em Express e MongoDB com arquitetura modular', href: 'https://github.com/PeSzpak/NexusAPI' },
    { name: 'nestjs-mongodb-auth-api', note: 'NestJS com autenticação JWT e validação', href: 'https://github.com/PeSzpak/nestjs-mongodb-auth-api' },
    { name: 'Java-Data-Structures', note: '11 algoritmos de ordenação comparados em 100 mil elementos', href: 'https://github.com/PeSzpak/Java-Data-Structures' },
    { name: 'timsort-dijkstra-entregas', note: 'TimSort feito à mão aplicado ao Dijkstra em rotas de entrega', href: 'https://github.com/PeSzpak/timsort-dijkstra-entregas' },
    { name: 'Forno-di-Pietra-Ristorante', note: 'Sistema desktop de restaurante em Java Swing e MySQL', href: 'https://github.com/PeSzpak/Forno-di-Pietra-Ristorante' },
    { name: 'LP Corte Real', note: 'Landing page de um açougue Angus de Curitiba em HTML, CSS e JS puros, com kits e preços gerados por script', href: 'https://lp-corte-real.vercel.app' },
    { name: 'Lashes by Isa', note: 'Site de uma lash designer de São José dos Pinhais, com agendamento pelo WhatsApp', href: 'https://lashes-by-isa.vercel.app' },
    { name: 'Rick and Morty', note: 'Catálogo de personagens na API pública. Foi onde o React clicou para mim', href: 'https://rick-and-morty-api-alpha-ten.vercel.app' },
  ] as ArchiveEntry[],
  path: {
    title: 'Trajetória',
    now: 'Agora',
  },
  jobs: [
    {
      when: '2026 — hoje',
      company: 'Recall Consultoria',
      role: 'Desenvolvedor de software, squad de IA',
      where: 'Curitiba, PR',
      points: [
        'Servidores MCP em TypeScript que dão ao assistente interno acesso seguro ao CRM e aos pareceres, com cada usuário vendo só os próprios casos.',
        'Pipeline de pré-análise de processos com LLM, filas e reprocessamento de falhas.',
        'Busca semântica em documentos com embeddings e pgvector.',
      ],
      stack: ['TypeScript', 'Python', 'LangGraph', 'PostgreSQL', 'pgvector', 'RabbitMQ'],
    },
    {
      when: 'mar — abr 2026',
      company: 'Denoised.ai',
      role: 'Desenvolvedor backend, freelancer',
      where: 'Remoto',
      points: [
        'Hardening de segurança em app Next.js com Supabase: pentest no código e correção de falhas de alto impacto.',
        'RLS revisado e controle de acesso no servidor, fechando bypass de permissão.',
        'Validação de upload por MIME e magic bytes, mitigação de SSRF.',
        'Webhooks do Stripe idempotentes, sem race condition.',
        'APIs mais rápidas com agregação em SQL, índices e fim das queries N+1.',
      ],
      stack: ['TypeScript', 'Next.js', 'Supabase', 'Stripe', 'Sentry'],
    },
    {
      when: 'jun 2025 — fev 2026',
      company: 'MM Tecnologia da Informação',
      role: 'Estagiário de desenvolvimento',
      where: 'Curitiba, PR',
      points: [
        'Funcionalidades novas em times ágeis com Scrum e Kanban.',
        'Correção de bugs em sistemas em produção.',
        'Automação de processos internos com scripts e pequenas aplicações.',
        'Comparativo de SDKs e APIs de mapas para projetos da empresa.',
      ],
    },
  ] as Job[],
  method: {
    title: 'Modus operandi',
    intro: 'Como eu trabalho, do servidor MCP ao agente que escreve código comigo.',
    lights: ['Pensando…', 'Te esperando', 'Pronto!'],
    items: [
      {
        title: 'Servidores MCP',
        body: [
          'MCP é o protocolo que deixa um assistente de IA chamar ferramentas e ler dados de outro sistema. Na Recall Consultoria eu construo servidores MCP em TypeScript que dão ao assistente interno acesso seguro ao CRM e aos pareceres, com cada usuário vendo só os próprios casos.',
          'Nos meus projetos pessoais a regra é a mesma. A permissão mora no banco, com Row Level Security, e a interface só mostra o que o banco devolve.',
        ],
      },
      {
        title: 'Especificação antes do código',
        body: [
          'No TWS Score, na Grão Raro e na LP Corte Real, a especificação e o plano estão escritos no repositório, ao lado do código.',
          'As regras que importam têm teste contra o banco real. É o caso da nota surpresa do TWS Score e do estoque da Grão Raro.',
        ],
      },
      {
        title: 'Agentes de código',
        body: [
          'Uso o Claude Code no dia a dia. Mantenho um script que instala meus plugins, skills e ferramentas com um comando em macOS, Linux, WSL e Windows.',
          'Também fiz o Semáforo, uma janelinha que mostra se o agente está pensando, esperando por mim ou pronto. Funciona com Claude Code, Codex e Gemini CLI.',
        ],
        link: { label: 'Semáforo no GitHub', href: 'https://github.com/PeSzpak/claude-semaforo' },
      },
    ] as Method[],
  },
  belt: {
    title: 'Arsenal',
    intro: 'O que eu uso no dia a dia, separado por bolso.',
  },
  pouches: [
    { name: 'Linguagens', tools: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL'] },
    { name: 'Backend', tools: ['Node.js', 'NestJS', 'Express', 'FastAPI', 'APIs REST', 'MCP', '.NET (básico)'] },
    { name: 'Dados e IA', tools: ['PostgreSQL', 'MySQL', 'MongoDB', 'Qdrant', 'Supabase', 'pgvector', 'LangGraph', 'Apache Airflow', 'Power BI'] },
    { name: 'Frontend', tools: ['React', 'Next.js', 'Tailwind CSS', 'Radix UI', 'Recharts', 'Flutter (básico)'] },
    { name: 'Infra', tools: ['Docker', 'Docker Compose', 'RabbitMQ', 'AWS (básico)', 'Vercel', 'Sentry', 'Git', 'Claude Code'] },
    { name: 'Segurança', tools: ['Row Level Security', 'Autenticação e autorização', 'Mitigação de SSRF', 'CSP', 'Validação de upload'] },
  ] as Pouch[],
  record: {
    title: 'Ficha',
    study: 'Formação',
    award: 'Prêmio',
    lang: 'Idiomas',
    items: [
      ['Análise e Desenvolvimento de Sistemas', 'Senac SJP, 2025 a 2027'],
      ['Técnico em Informática', 'Senac SJP, 2022 a 2024'],
    ],
    awardText: ['1º lugar no Ideathon Inova Comércio', 'Sebrae/PR e Senac/PR, 2025'],
    langs: [['Português', 'nativo'], ['Inglês', 'avançado']],
  },
  contact: {
    title: 'Acenda o sinal',
    text: 'Procurando alguém para backend, dados ou IA? Respondo rápido.',
    copy: 'Copiar e-mail',
    copied: 'E-mail copiado',
  },
  footer: 'Pedro Szpak, 2026. Desenhado sem template.',
}

export type Dict = typeof pt

const enText: Record<CaseId, CaseText> = {
  strackz: {
    summary: 'Personal finance manager built on the 50/30/20 method. I started it to sort out my own money; now it runs in production.',
    points: [
      'Transactions, recurring bills and installments with statuses that update themselves.',
      'Supabase Auth login and per-user data isolation with PostgreSQL Row Level Security.',
      'Category budgets and 50/30/20 progress dashboards in real time.',
    ],
  },
  tws: {
    summary: "A PWA for a couple to rate the cafés and restaurants they visit. Each person rates on their own phone, and the other's score stays hidden until both are done.",
    points: [
      "The surprise score is a database rule. The RLS policy returns the other person's review only once the place has two.",
      'Google Places search fills in type, address and location. The map runs on Leaflet and OpenStreetMap.',
      'The access rules have tests that run against the real database.',
    ],
  },
  sgymz: {
    summary: 'A workout manager I built for my girlfriend and me. I plan the workouts, she logs how they went. Two themes: Batman for me, Hello Kitty for her.',
    points: [
      "Workout mode with the last session's load prefilled, a rest timer and progress saved on the device.",
      "Admin panel to assign programs, follow each person's progress and answer change requests.",
      'Supabase RLS so everyone sees only their own data.',
    ],
  },
  face: {
    summary: 'Face recognition that runs entirely on your machine. Enroll people with a few photos and identify them by camera, by upload or at login with Face ID.',
    points: [
      'Enrollment rejects blurry, dark, faceless or already-enrolled photos, and says why.',
      'Face ID login uses a stricter threshold (0.78) than regular identification (0.70).',
      'Every recognition and every login attempt is logged. The whole stack starts with one docker compose.',
    ],
  },
  graoraro: {
    summary: 'A coffee shop with a real Asaas checkout for Pix, credit and debit. Coursework for a REST API class at Senac.',
    points: [
      'Stock is decremented inside the order transaction. Ten simultaneous purchases of the last unit create one order and nine 409 responses.',
      'A repeated webhook changes nothing, and the status always comes from a query to Asaas.',
      'OpenAPI 3.1 generated from the Zod schemas, with Swagger at /docs.',
    ],
  },
}

const en: Dict = {
  ...pt,
  nav: { cases: 'Cases', path: 'Path', method: 'Method', belt: 'Arsenal', contact: 'Contact' },
  hero: {
    first: 'Pedro',
    last: 'Szpak',
    line: 'Software developer. Backend, data and AI.',
    sub: 'I build APIs, pipelines and systems that stay up when nobody is watching. Based near Curitiba, Brazil.',
    seeCases: 'See the cases',
    cv: 'Download CV',
    hint: 'Move your cursor to steer the signal',
  },
  cases: {
    title: 'Cases',
    intro: 'Projects that are live or in real use. Each one solved a real problem for someone, usually me.',
    status: { live: 'Live', personal: 'In use', local: 'Runs locally' },
    open: 'Open the site',
    demo: 'Demo',
    trailer: 'Trailer',
    views: { default: 'Screen', light: 'Light', dark: 'Dark', batman: 'Batman', kitty: 'Hello Kitty' } as Record<ThemeId, string>,
    code: 'View code',
    stackLabel: 'Built with',
    archiveTitle: 'Archive',
    archiveIntro: 'Studies and smaller projects, kept on file.',
    text: enText,
  },
  files: buildFiles(enText),
  archive: [
    { ...pt.archive[0], note: 'Apache Airflow DAGs with Docker Compose' },
    { ...pt.archive[1], note: 'REST API in Express and MongoDB with a modular architecture' },
    { ...pt.archive[2], note: 'NestJS with JWT authentication and validation' },
    { ...pt.archive[3], note: '11 sorting algorithms benchmarked on 100k elements' },
    { ...pt.archive[4], note: 'Hand-written TimSort applied to Dijkstra for delivery routes' },
    { ...pt.archive[5], note: 'Restaurant desktop system in Java Swing and MySQL' },
    { ...pt.archive[6], note: 'Landing page for an Angus butcher in Curitiba in plain HTML, CSS and JS, with kits and prices generated by a script' },
    { ...pt.archive[7], note: 'Site for a lash designer in São José dos Pinhais, with booking through WhatsApp' },
    { ...pt.archive[8], note: 'Character catalog on the public API. This is where React clicked for me' },
  ],
  path: { title: 'Path', now: 'Now' },
  jobs: [
    {
      ...pt.jobs[0],
      when: '2026 — now',
      role: 'Software developer, AI squad',
      points: [
        'TypeScript MCP servers that give the internal assistant safe access to the CRM and legal reports, scoped so each user only sees their own cases.',
        'LLM pipeline for pre-analysis of court cases, with queues and failure reprocessing.',
        'Semantic search over documents with embeddings and pgvector.',
      ],
    },
    {
      ...pt.jobs[1],
      when: 'Mar — Apr 2026',
      role: 'Backend developer, freelance',
      where: 'Remote',
      points: [
        'Security hardening of a Next.js and Supabase app: code-level pentest and fixes for high-impact flaws.',
        'Reworked RLS and server-side access control, closing a permission bypass.',
        'Upload validation by MIME type and magic bytes, SSRF mitigation.',
        'Idempotent Stripe webhooks with no race conditions.',
        'Faster APIs through SQL aggregation, indexes and removing N+1 queries.',
      ],
    },
    {
      ...pt.jobs[2],
      when: 'Jun 2025 — Feb 2026',
      role: 'Software development intern',
      points: [
        'New features in agile teams running Scrum and Kanban.',
        'Bug fixes on production systems.',
        'Internal process automation with scripts and small apps.',
        'Comparison of mapping SDKs and APIs for company projects.',
      ],
    },
  ],
  method: {
    title: 'Modus operandi',
    intro: 'How I work, from the MCP server to the agent that writes code with me.',
    lights: ['Thinking…', 'Waiting for you', 'Done!'],
    items: [
      {
        title: 'MCP servers',
        body: [
          'MCP is the protocol that lets an AI assistant call tools and read data from another system. At Recall Consultoria I build TypeScript MCP servers that give the internal assistant safe access to the CRM and legal reports, scoped so each user only sees their own cases.',
          'My personal projects follow the same rule. Permission lives in the database, with Row Level Security, and the interface only shows what the database returns.',
        ],
      },
      {
        title: 'Spec before code',
        body: [
          'In TWS Score, Grão Raro and LP Corte Real, the spec and the plan are written in the repository, next to the code.',
          'The rules that matter have tests against the real database. That covers the surprise score in TWS Score and the stock in Grão Raro.',
        ],
      },
      {
        title: 'Coding agents',
        body: [
          'I use Claude Code day to day. I keep a script that installs my plugins, skills and tools with one command on macOS, Linux, WSL and Windows.',
          'I also built Semáforo, a small window that shows whether the agent is thinking, waiting for me or done. It works with Claude Code, Codex and Gemini CLI.',
        ],
        link: { label: 'Semáforo on GitHub', href: 'https://github.com/PeSzpak/claude-semaforo' },
      },
    ] as Method[],
  },
  belt: { title: 'Arsenal', intro: 'What I use day to day, sorted by pouch.' },
  pouches: [
    { ...pt.pouches[0], name: 'Languages' },
    { ...pt.pouches[1], tools: ['Node.js', 'NestJS', 'Express', 'FastAPI', 'REST APIs', 'MCP', '.NET (basic)'] },
    { ...pt.pouches[2], name: 'Data and AI' },
    { ...pt.pouches[3], tools: ['React', 'Next.js', 'Tailwind CSS', 'Radix UI', 'Recharts', 'Flutter (basic)'] },
    { ...pt.pouches[4], tools: ['Docker', 'Docker Compose', 'RabbitMQ', 'AWS (basic)', 'Vercel', 'Sentry', 'Git', 'Claude Code'] },
    { name: 'Security', tools: ['Row Level Security', 'Authentication and authorization', 'SSRF mitigation', 'CSP', 'Upload validation'] },
  ],
  record: {
    title: 'Record',
    study: 'Education',
    award: 'Award',
    lang: 'Languages',
    items: [
      ['Systems Analysis and Development', 'Senac SJP, 2025 to 2027'],
      ['IT Technical High School', 'Senac SJP, 2022 to 2024'],
    ],
    awardText: ['1st place, Inova Comércio Ideathon', 'Sebrae/PR and Senac/PR, 2025'],
    langs: [['Portuguese', 'native'], ['English', 'advanced']],
  },
  contact: {
    title: 'Light the signal',
    text: 'Looking for someone on backend, data or AI? I reply fast.',
    copy: 'Copy email',
    copied: 'Email copied',
  },
  footer: 'Pedro Szpak, 2026. Designed without a template.',
}

const dicts: Record<Lang, Dict> = { pt, en }

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void }
const LangContext = createContext<Ctx | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])
  return <LangContext.Provider value={{ lang, t: dicts[lang], setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang outside LangProvider')
  return ctx
}
