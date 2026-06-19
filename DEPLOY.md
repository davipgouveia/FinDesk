# Deploy Instructions (Vercel + Supabase)

## Supabase
1. Crie um projeto em supabase.com.
2. Acesse o SQL Editor e execute os scripts de criação de tabelas definidos em `DATABASE.md` e a seed inicial de dados.
3. Configure Autenticação para permitir e-mail e senha.
4. Anote a `Project URL` e a `anon public key` nas configurações do projeto (API Settings).

## Frontend e Vercel
1. Crie um arquivo `.env` na raiz do projeto localmente contendo:
   ```env
   VITE_SUPABASE_URL=Sua_URL_aqui
   VITE_SUPABASE_ANON_KEY=Sua_Chave_aqui
   ```
2. No Vercel, crie um novo projeto importando o repositório git deste app.
3. Configure as Environment Variables no Vercel com os mesmos valores do passo 1.
4. O Vercel detectará que é um projeto Vite e rodará `npm run build` automaticamente (Diretório de output: `dist`).
5. Faça o Deploy. Seu aplicativo estará rodando com HTTPS na URL fornecida pela Vercel.
