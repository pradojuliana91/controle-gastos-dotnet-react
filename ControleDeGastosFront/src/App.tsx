import { useState, useEffect } from 'react';

//Interfaces para tipagem dos dados mapeando para o back-end
interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

interface Transacao {
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: number;
}

//Interface criada para estruturar o relatório de totais
interface TotaisRelatorio {
  pessoas: {
    id: number;
    nome: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
  }[];
  geralReceitas: number;
  geralDespesas: number;
  saldoLiquidoGeral: number;
}

function App() {
  //Estados da aplicação
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [totais, setTotais] = useState<TotaisRelatorio | null>(null);

  //Formulários de cadastro
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | "">("");
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState<number | "">("");
  const [tipo, setTipo] = useState('Despesa');
  const [pessoaSel, setPessoaSel] = useState(0);

  //Função responsável por buscar os dados atualizados do back
  const carregarDados = () => {
    fetch('https://localhost:7288/api/pessoas')
      .then(res => res.json())
      .then(data => setPessoas(data))
      .catch(err => console.error("Erro ao carregar pessoas:", err));

    fetch('https://localhost:7288/api/totais')
      .then(res => res.json())
      .then(data => setTotais(data))
      .catch(err => console.error("Erro ao carregar totais:", err));
  };

  //Carrega os dados na inicialização do componente
  useEffect(() => {
    carregarDados();
  }, []);

  //Envia a nova pessoa para salvar no banco de dados
  const salvarPessoa = () => {
    if (!nome.trim() || idade === "") {
      alert("Preencha todos os campos da pessoa.");
      return;
    }

    const novaPessoa = {
      nome,
      idade: Number(idade)
    };

    fetch('https://localhost:7288/api/pessoas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaPessoa)
    })
      .then(async (res) => {
        if (!res.ok) {
          const mensagem = await res.text();
          alert(mensagem); //Exibe os erros de validação retornados pela API
          return;
        }

        //Reseta o formulário e recarrega as tabelas
        setNome('');
        setIdade("");
        carregarDados();
      });
  };

  //Envia a nova transação e trata as validações do front e do back
  const salvarTransacao = () => {
    if (pessoaSel === 0) {
      alert("Por favor, selecione uma pessoa para esta transação.");
      return;
    }

    if (!desc.trim() || valor === "") {
      alert("Preencha todos os campos da transação.");
      return;
    }

    const novaTransacao: Transacao = {
      descricao: desc,
      valor: Number(valor),
      tipo,
      pessoaId: pessoaSel
    };

    fetch('https://localhost:7288/api/transacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaTransacao)
    })
      .then(async (res) => {
        if (!res.ok) {
          const mensagem = await res.text();
          alert(mensagem); //Trata erros da regra de negócio
          return;
        }

        //Reseta o formulário de transação e atualiza a tela
        setDesc('');
        setValor("");
        carregarDados();
      });
  };

  // Função para deletar uma pessoa e suas transações via Back-end
  const deletarPessoa = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta pessoa? Todas as suas transações serão apagadas.")) {
      fetch(`https://localhost:7288/api/pessoas/${id}`, { method: 'DELETE' })
        .then(() => carregarDados())
        .catch(err => console.error("Erro ao deletar:", err));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Controle de Gastos Residenciais</h1>

      {/* Seção: Cadastro de Pessoas */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>Novo Cadastro de Pessoa</h3>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input type="number" placeholder="Idade" min="0" value={idade} onChange={e => setIdade(e.target.value === "" ? "" : Number(e.target.value))} />
        <button onClick={salvarPessoa}>Salvar Pessoa</button>
      </div>

      {/* Seção: Cadastro de Transações */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>Nova Transação</h3>
        <input placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} />
        <input type="number" placeholder="Valor" min="0.01" step="0.01" value={valor} onChange={e => setValor(e.target.value === "" ? "" : Number(e.target.value))} />

        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="Despesa">Despesa</option>
          <option value="Receita">Receita</option>
        </select>

        <select value={pessoaSel} onChange={e => setPessoaSel(Number(e.target.value))}>
          <option value="0">Selecione uma pessoa...</option>
          {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>

        <button onClick={salvarTransacao}>Salvar Transação</button>
      </div>

      {/* Seção: Exibição e Relatório de Totais */}
      <h3>Relatório Geral e Saldos</h3>
      <table style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Receitas (R$)</th>
            <th>Despesas (R$)</th>
            <th>Saldo (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {totais?.pessoas.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td style={{ color: 'green' }}>{item.totalReceitas.toFixed(2)}</td>
              <td style={{ color: 'red' }}>{item.totalDespesas.toFixed(2)}</td>
              <td style={{ fontWeight: 'bold', color: item.saldo >= 0 ? 'blue' : 'orange' }}>
                {item.saldo.toFixed(2)}
              </td>
              <td>
                <button style={{ backgroundColor: '#d32f2f' }} onClick={() => deletarPessoa(item.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Resumo Consolidado Geral da Aplicação */}
      {totais && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <h4>Totais Consolidados do Sistema</h4>
          <p>Total Geral de Receitas: <span style={{ color: 'green' }}>R$ {totais.geralReceitas.toFixed(2)}</span></p>
          <p>Total Geral de Despesas: <span style={{ color: 'red' }}>R$ {totais.geralDespesas.toFixed(2)}</span></p>
          <hr />
          <p style={{ fontSize: '1.1em' }}>
            Saldo Líquido Geral: <span style={{ color: totalsLiquidoColor(totais.saldoLiquidoGeral) }}>R$ {totais.saldoLiquidoGeral.toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
}

//Função para a cor do texto do saldo geral
function totalsLiquidoColor(saldo: number) {
  return saldo >= 0 ? 'green' : 'red';
}

export default App;