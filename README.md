# WebChat

Projeto simples para estudo básico e primeira implementação utilizando WebSocket. A aplicação em si é um projeto simples de um chat em tempo real.

Nesta primeira versão suporta apenas textos e sem funcionalidades muito avançadas.

## Funcionalidades para o futuro

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Notificação de digitando | 📅 Planejado | Indicador visual quando outro usuário está digitando |
| Suporte a imagens | 📅 Planejado | Permitir envio e visualização de imagens no chat |
| Indicativo de visualização | 📅 Planejado | Mostrar quando a mensagem foi visualizada |
| Limpeza de histórico | 📅 Planejado | Opção para limpar histórico de conversas |

## 🎯 Características Principais

- **Arquitetura Modular**: Estrutura organizada por domínios, facilitando a manutenção e escalabilidade
- **Type Safety**: Desenvolvimento com TypeScript e validação de dados com Zod
- **ORM Moderno**: Drizzle ORM para interação type-safe com o banco de dados
- **Comunicação em Tempo Real**: Implementação robusta de WebSocket com Socket.IO
- **Validação de Dados**: Schema validation com Zod para garantir integridade dos dados
- **Autenticação**: Sistema de autenticação seguro e flexível
- **Documentação Automática**: Geração automática de documentação da API

## 🚀 Tecnologias

- [Fastify](https://fastify.dev/) - Framework web rápido e com baixo overhead
- [Drizzle ORM](https://orm.drizzle.team/) - ORM moderno e type-safe para PostgreSQL
- [Socket.IO](https://socket.io/) - Biblioteca para comunicação em tempo real
- [Zod](https://zod.dev/) - Validação de dados com TypeScript
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript com tipagem estática
- [Turso Database](https://turso.tech/) - Banco de dados relacional desenvolvido em cima do sqlite

## 📋 Pré-requisitos

- Node.js 18+
- SQlite LibSQL
- pnpm (recomendado) ou npm

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/dienerld/websocket-chat.git
cd fastify-drizzle
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Configure as variáveis no arquivo `.env` com suas credenciais.

## 🚀 Executando o Projeto

1. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

2. Para build de produção:

```bash
pnpm build
pnpm start
```

## 📁 Estrutura do Projeto

```
src/
  ├── @types/          # Definições de tipos TypeScript
  ├── db/             # Configurações e schemas do banco de dados
  ├── http/           # Configurações HTTP e middlewares
  ├── modules/        # Módulos da aplicação
  │   └── [module-name]/
  │       ├── functions/    # Funções de negócio
  │       ├── http-routes.ts # Rotas HTTP
  │       └── index.ts      # Autoload das rotas
  ├── app.ts         # Configuração do Fastify
  └── index.ts       # Bootstrap da aplicação
```
