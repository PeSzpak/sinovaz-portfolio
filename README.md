# Portfólio — Pedro Szpak

Portfólio pessoal no estilo "dark deco" de Batman: The Animated Series. Vite + React + Tailwind 4 + Motion, com componentes do ReactBits (DecryptedText, Noise).

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ estático para publicar
```

- Conteúdo PT/EN: `src/i18n.tsx` (projetos, experiências, skills, contatos).
- Hero com Gotham e bat-sinal: `src/components/Gotham.tsx`.
- Mídia dos projetos (stills WebP e vídeo de demo): `node scripts/media.mjs <id> [--stills] [--video]`. Cada projeto tem uma receita em `scripts/capture/<id>.mjs`, e os arquivos ficam em `public/media/<id>/`. A mídia só vai para o site se estiver declarada em `src/media.json`. Os dados de demonstração são fictícios e as receitas rodam contra serviços locais.
- Orçamentos de tamanho e existência dos arquivos: `node scripts/media-check.mjs`.
