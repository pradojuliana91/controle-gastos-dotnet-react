## 📝 Controle de Gastos Residenciais

Projeto para gerenciamento de gastos residenciais, permitindo o cadastro de pessoas, o registro de receitas e despesas e a consulta de relatórios com os totais individuais e gerais.

Desenvolvido com **.NET 8**, **React** e **TypeScript**, o sistema utiliza **SQLite** para persistência dos dados e implementa regras de negócio para o gerenciamento das transações financeiras.

## 🚀 Funcionalidades

- 👤 Cadastro, listagem e remoção de pessoas
- 🔗 Relacionamento direto entre pessoas e transações
- 💥 Deleção em cascata (remover uma pessoa apaga automaticamente todas as suas transações)
- 💵 Cadastro e listagem de transações (Receita / Despesa)
- ⚠️ Validação de regra de negócio (menores de 18 anos só podem registrar despesas)
- 🔎 Consulta de receitas, despesas e saldo por pessoa
- 📊 Exibição de totais gerais agregados de todo o sistema
- 🗄️ Persistência de dados local com SQLite

## 🛠️ Tecnologias Utilizadas

### **Back-end**
- C#
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQLite

### **Front-end**
- React
- TypeScript
- Vite
- CSS3 Nativo

## 📦 Instalação

1. Clone o repositório

Abra o terminal e execute o comando abaixo para clonar o projeto:
```bash
git clone https://github.com/pradojuliana91/controle-gastos-dotnet-react.git
```

2. Acesse a pasta do projeto

```bash
cd controle-gastos-dotnet-react
```

### 🖥️ Executando o Back-end (.NET API)

Acesse a pasta correspondente à API:

```bash
cd ControleDeGastosAPI
```
Execute o projeto (o banco de dados SQLite será criado e inicializado localmente de forma automática):
```bash
dotnet run
```

Com a aplicação em execução, acesse a documentação da API pelo Swagger utilizando a URL informada no terminal da aplicação.

Exemplo:

```text
https://localhost:7288/swagger
```

### 🌐 Executando o Front-end (React + TS)

Abra um novo terminal na raiz do projeto (controle-gastos-dotnet-react) e acesse a pasta do Front-end:

```bash
cd ControleDeGastosFront
```

Instale todas as dependências necessárias do Node:

```bash
npm install
```

Inicie o servidor de desenvolvimento local:

```bash
npm run dev
```

O terminal indicará a porta local gerada (geralmente http://localhost:5173). Basta abrir esse endereço no seu navegador para utilizar o sistema.

## 🗄️ Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução da aplicação, juntamente com suas tabelas.

- Banco utilizado: SQLite (gerado localmente em arquivo .db)
- Tabelas principais: `Pessoas` e `Transacoes`

O sistema utiliza o Entity Framework Core para realizar o mapeamento das entidades e gerenciar as migrations do banco de dados.

## 📁 Estrutura de Pastas

```txt
controle-gastos-dotnet-react
│
├── 📁 ControleDeGastosAPI 
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Migrations/
│   └── Program.cs
│
└── 📁 ControleDeGastosFront 
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    └── vite.config.ts
```
## 🧑‍💻 Autor

**Juliana do Prado Fernandes**  
Desenvolvedora participante do programa **Acelera Maker - Montreal**

- [LinkedIn](https://www.linkedin.com/in/pradojuliana91/)
- [GitHub](https://github.com/pradojuliana91)
