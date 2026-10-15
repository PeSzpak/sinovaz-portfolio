import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'pt' | 'en'

export type CaseFile = {
  id: string
  name: string
  status: 'live' | 'personal' | 'local'
  url?: string
  repo?: string
  shot?: string
  summary: string
  points: string[]
  stack: string[]
}

export type Job = {
  when: string
  company: string
  role: string
  where: string
  points: string[]
  stack?: string[]
}

export type Pouch = { name: string; tools: string[] }

export type ArchiveEntry = { name: string; note: string; repo: string }

const shared = {
  email: 'pedrohszpaka@gmail.com',
  github: 'https://github.com/PeSzpak',
  linkedin: 'https://linkedin.com/in/pedro-szpak04',
  cv: 'https://peszpak.github.io/PedroSzpak-SoftwareDeveloper.pdf',
}

const pt = {
  ...shared,
  nav: { cases: 'Casos', path: 'Trajetória', belt: 'Arsenal', contact: 'Contato' },
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
    code: 'Ver código',
    stackLabel: 'Feito com',
    archiveTitle: 'Arquivo',
    archiveIntro: 'Estudos e projetos menores, guardados para consulta.',
  },
  files: [
    {
      id: 'strackz',
      name: 'StrackZ',
      status: 'live',
      url: 'https://strackz.sinovaz.com',
      shot: '/shots/strackz.jpg',
      summary: 'Gerenciador financeiro pessoal com o método 50/30/20. Comecei para organizar o meu dinheiro e hoje roda em produção.',
      points: [
        'Transações, contas recorrentes e parcelamentos com status que se atualizam sozinhos.',
        'Login com Supabase Auth e dados isolados por usuário com Row Level Security no PostgreSQL.',
        'Painéis de orçamento por categoria e progresso do 50/30/20 em tempo real.',
      ],
      stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind', 'Radix UI', 'Recharts'],
    },
    {
      id: 'sgymz',
      name: 'SgymZ',
      status: 'personal',
      repo: 'https://github.com/PeSzpak/SgymZ',
      summary: 'Gerenciador de treinos que fiz para mim e para minha namorada. Eu monto os treinos, ela registra como foi. Dois temas: Batman para mim, Hello Kitty para ela.',
      points: [
        'Logins separados para admin e usuário, com aprovação de cadastro.',
        'RLS no Supabase para cada pessoa só ver o que é dela.',
      ],
      stack: ['Next.js 16', 'Supabase', 'Tailwind 4', 'Zod', 'Bun'],
    },
    {
      id: 'face',
      name: 'Face Recognition Pro',
      status: 'local',
      repo: 'https://github.com/PeSzpak/face-recognition-pro',
      summary: 'Reconhecimento facial com IA, 100% local em Docker. Detecta rostos, gera embeddings e busca por similaridade num banco vetorial.',
      points: ['API em FastAPI com InsightFace e documentação automática.', 'Sobe inteiro com um docker compose.'],
      stack: ['Python', 'FastAPI', 'InsightFace', 'Banco vetorial', 'React', 'Docker'],
    },
    {
      id: 'rick',
      name: 'Rick and Morty',
      status: 'live',
      url: 'https://rick-and-morty-api-alpha-ten.vercel.app',
      repo: 'https://github.com/PeSzpak/RickAndMortyAPI',
      shot: '/shots/rickmorty.jpg',
      summary: 'Catálogo de personagens da minha série favorita consumindo a API pública. Foi onde o React clicou para mim.',
      points: [],
      stack: ['React', 'CSS', 'Vercel'],
    },
  ] as CaseFile[],
  archive: [
    { name: 'airflow-dags-study', note: 'DAGs do Apache Airflow com Docker Compose', repo: 'https://github.com/PeSzpak/airflow-dags-study' },
    { name: 'NexusAPI', note: 'API REST em Express e MongoDB com arquitetura modular', repo: 'https://github.com/PeSzpak/NexusAPI' },
    { name: 'nestjs-mongodb-auth-api', note: 'NestJS com autenticação JWT e validação', repo: 'https://github.com/PeSzpak/nestjs-mongodb-auth-api' },
    { name: 'Java-Data-Structures', note: '11 algoritmos de ordenação comparados em 100 mil elementos', repo: 'https://github.com/PeSzpak/Java-Data-Structures' },
    { name: 'timsort-dijkstra-entregas', note: 'TimSort feito à mão aplicado ao Dijkstra em rotas de entrega', repo: 'https://github.com/PeSzpak/timsort-dijkstra-entregas' },
    { name: 'Forno-di-Pietra-Ristorante', note: 'Sistema desktop de restaurante em Java Swing e MySQL', repo: 'https://github.com/PeSzpak/Forno-di-Pietra-Ristorante' },
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
  belt: {
    title: 'Arsenal',
    intro: 'Cada bolso tem o que eu uso no dia a dia. Escolha um.',
  },
  pouches: [
    { name: 'Linguagens', tools: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL'] },
    { name: 'Backend', tools: ['Node.js', 'NestJS', 'Express', 'FastAPI', 'APIs REST', 'MCP', '.NET (básico)'] },
    { name: 'Dados e IA', tools: ['PostgreSQL', 'MongoDB', 'Supabase', 'pgvector', 'LangGraph', 'Apache Airflow', 'Power BI'] },
    { name: 'Frontend', tools: ['React', 'Next.js', 'Tailwind CSS', 'Radix UI', 'Recharts', 'Flutter (básico)'] },
    { name: 'Infra', tools: ['Docker', 'Docker Compose', 'RabbitMQ', 'AWS (básico)', 'Vercel', 'Sentry', 'Git'] },
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
  footer: 'Pedro Szpak, 2026. Desenhado e codado à mão, sem template.',
}

export type Dict = typeof pt

const en: Dict = {
  ...pt,
  nav: { cases: 'Cases', path: 'Path', belt: 'Arsenal', contact: 'Contact' },
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
    code: 'View code',
    stackLabel: 'Built with',
    archiveTitle: 'Archive',
    archiveIntro: 'Studies and smaller projects, kept on file.',
  },
  files: [
    {
      ...pt.files[0],
      summary: 'Personal finance manager built on the 50/30/20 method. I started it to sort out my own money; now it runs in production.',
      points: [
        'Transactions, recurring bills and installments with statuses that update themselves.',
        'Supabase Auth login and per-user data isolation with PostgreSQL Row Level Security.',
        'Category budgets and 50/30/20 progress dashboards in real time.',
      ],
    },
    {
      ...pt.files[1],
      summary: 'A workout manager I built for my girlfriend and me. I plan the workouts, she logs how they went. Two themes: Batman for me, Hello Kitty for her.',
      points: ['Separate admin and user logins, with sign-up approval.', 'Supabase RLS so everyone sees only their own data.'],
    },
    {
      ...pt.files[2],
      summary: 'AI face recognition running fully local in Docker. Detects faces, generates embeddings and runs similarity search on a vector database.',
      points: ['FastAPI service with InsightFace and auto-generated docs.', 'The whole stack starts with one docker compose.'],
      stack: ['Python', 'FastAPI', 'InsightFace', 'Vector DB', 'React', 'Docker'],
    },
    {
      ...pt.files[3],
      summary: 'Character catalog for my favorite show, built on the public API. This is where React clicked for me.',
    },
  ],
  archive: [
    { ...pt.archive[0], note: 'Apache Airflow DAGs with Docker Compose' },
    { ...pt.archive[1], note: 'REST API in Express and MongoDB with a modular architecture' },
    { ...pt.archive[2], note: 'NestJS with JWT authentication and validation' },
    { ...pt.archive[3], note: '11 sorting algorithms benchmarked on 100k elements' },
    { ...pt.archive[4], note: 'Hand-written TimSort applied to Dijkstra for delivery routes' },
    { ...pt.archive[5], note: 'Restaurant desktop system in Java Swing and MySQL' },
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
  belt: { title: 'Arsenal', intro: 'Each pouch holds what I use day to day. Pick one.' },
  pouches: [
    pt.pouches[0],
    { ...pt.pouches[1], tools: ['Node.js', 'NestJS', 'Express', 'FastAPI', 'REST APIs', 'MCP', '.NET (basic)'] },
    { ...pt.pouches[2], name: 'Data and AI' },
    { ...pt.pouches[3], tools: ['React', 'Next.js', 'Tailwind CSS', 'Radix UI', 'Recharts', 'Flutter (basic)'] },
    { ...pt.pouches[4], tools: ['Docker', 'Docker Compose', 'RabbitMQ', 'AWS (basic)', 'Vercel', 'Sentry', 'Git'] },
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
  footer: 'Pedro Szpak, 2026. Designed and coded by hand, no template.',
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
