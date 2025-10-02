# Frontend - Sistema de Gestão de Leads

Este é o projeto frontend para o sistema de cadastro e gestão de leads, desenvolvido com Next.js e Tailwind CSS. A aplicação inclui um formulário público para captura de leads e um painel administrativo completo e seguro para gerenciamento.

## ✨ Funcionalidades Implementadas
-   Formulário Público (/)
    - Captura de Leads: Formulário completo com validação de campos em tempo real.

    - Tracking Automático: Captura automática de parâmetros de URL (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid) e os envia junto com os dados do lead.

    - Integração com GTM: Preparado para enviar eventos de page_view e generate_lead para o Google Tag Manager, incluindo dados para Enhanced Conversions (e-mail e telefone).

-   Painel Administrativo (/admin)
    - Autenticação Segura: Sistema de login com token JWT.

    - Rotas Protegidas: Implementação de um "Route Guard" que impede o acesso não autorizado e evita o "flash" de conteúdo protegido antes do redirecionamento.

    - Datatable Avançada:
        - Busca dinâmica por nome ou e-mail com debounce (para performance).
        - Paginação do lado do servidor, garantindo que a aplicação seja rápida e escalável, mesmo com milhares de leads.

    - CRUD Completo de Leads:
        - Listar: Visualização paginada de todos os leads.
        - Inserir: Formulário para adicionar novos leads.
        - Visualizar: Página de detalhes para cada lead, exibindo todas as informações, incluindo os dados de tracking capturados.
        - Editar: Formulário para atualizar as informações de um lead.
        - Deletar: Exclusão de leads com um modal de confirmação personalizado e seguro.
    
    - Exportação para CSV: Funcionalidade para exportar a lista completa de leads para um arquivo .csv, com a geração do arquivo sendo feita de forma performática no backend.
    
    - Experiência do Usuário (UX):
        - Loader global centralizado que exibe um spinner durante todas as operações assíncronas (chamadas de API).
        - Notificações (toasts) para feedback de sucesso ou erro nas operações.
        
## 🚀 Tecnologias e Bibliotecas
-   Framework: Next.js 14+ (com App Router)
-   Linguagem: TypeScript
-   Estilização: Tailwind CSS
-   Componentes de UI: shadcn/ui (baseados em Radix UI)
-   Tabelas: TanStack Table (React Table) v8
-   Requisições HTTP: Axios
-   Validação de Formulários: Hook customizado
-   Máscaras de Input: React IMask
-   Notificações: React Hot Toast

## 📂 Estrutura do Projeto
O projeto segue uma arquitetura organizada para escalabilidade e manutenção:
-   src/app/(admin)/: Grupo de rotas para todas as páginas protegidas, envolvidas por um layout com o ProtectedRoute.
-   src/app/login/: Rota pública para a página de login.
-   src/app/components/: Componentes reutilizáveis, incluindo a datatable, o guardião de rotas e os componentes de UI.
-   src/app/contexts/: Contextos globais da aplicação, como o LoaderContext para o spinner de carregamento.
-   src/app/hooks/: Hooks customizados, como o useForm para gerenciamento de formulários.
-   src/app/lib/: Funções utilitárias, como a integração com o GTM e as regras de validação.

## 🔧 Pré-requisitos
-   Node.js (v18.x ou superior)
-   NPM ou Yarn
-   Git

## ⚙️ Configuração e Instalação
Siga os passos abaixo para executar o projeto localmente.
1. Clone o Repositório
```bash
    git clone https://github.com/wess-os/desafio-logik-frontend
```
```bash
    cd desafio-logik-frontend
```

2. Instale as Dependências
```bash
    npm install
```

3. Configure as Variáveis de Ambiente
Crie um arquivo chamado .env.local na raiz do projeto, copiando o exemplo .env.example ou criando um novo com o seguinte conteúdo:
```bash
    # URL base da sua API backend que está rodando localmente
    NEXT_PUBLIC_API_URL=http://localhost:3005/api

    # ID do seu container do Google Tag Manager (substitua por um ID real para testar)
    NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

4. Execute o Projeto
```bash
    npm run dev
```
