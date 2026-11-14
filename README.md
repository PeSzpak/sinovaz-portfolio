# Portfólio — Pedro Szpak

Portfólio pessoal no estilo "dark deco" de Batman: The Animated Series. Vite + React + Tailwind 4 + Motion, com componentes do ReactBits (DecryptedText, Noise).

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ estático para publicar
```

- Conteúdo PT/EN: `src/i18n.tsx` (projetos, experiências, skills, contatos).
- Hero com Gotham e bat-sinal: `src/components/Gotham.tsx`.
- Mídia dos projetos (stills WebP e vídeo de demo): `node scripts/media.mjs <id> [--stills] [--video]`. Cada projeto tem uma receita em `scripts/capture/<id>.mjs`, e os arquivos ficam em `public/media/<id>/`. A mídia só vai para o site se estiver declarada em `src/media.json`. Os dados de demonstração são fictícios. TWS Score, SgymZ e Face Recognition Pro rodam contra serviços locais (a receita do Face só roda no stack `docker compose -p frp-demo`). StrackZ usa uma conta demo em produção, com credenciais em `.env.capture` (fora do git), e Grão Raro só navega em produção até antes do botão Pagar.
- Orçamentos de tamanho e existência dos arquivos: `node scripts/media-check.mjs`.
