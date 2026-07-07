using ControleDeGastosAPI.Data;
using ControleDeGastosAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleDeGastosAPI.Controllers;

[ApiController]
[Route("api")]
public class FinanceiroController : ControllerBase
{
    private readonly BancoContext _context;
    public FinanceiroController(BancoContext context)
    {
        _context = context;
    }

    [HttpGet("pessoas")]
    public IActionResult ListarPessoas()
    {
        //Retorna a lista de pessoas cadastradas no banco de dados
        var pessoas = _context.Pessoas.ToList();
        return Ok(pessoas);
    }

    [HttpPost("pessoas")]
    public IActionResult AdicionarPessoa(Pessoa pessoa)
    {
        //Validações básicas de entrada de dados
        if (string.IsNullOrWhiteSpace(pessoa.Nome))
        {
            return BadRequest("Nome da pessoa é obrigatório.");
        }

        if(pessoa.Idade <= 0)
        {
            return BadRequest("Idade da pessoa deve ser um numero maior que zero.");
        }

        _context.Pessoas.Add(pessoa);
        _context.SaveChanges();
        return Ok(pessoa);
    }

    [HttpDelete("pessoas/{id}")]
    public IActionResult DeletarPessoa(int id)
    {
        var pessoa = _context.Pessoas.Find(id);

        if (pessoa == null)
        {
            return NotFound("Pessoa não encontrada.");
        }

        // Regra de Negócio: Se deletar a pessoa, todas as suas transações também devem ser apagadas.
        // Buscamos todas as transações vinculadas ao ID dessa pessoa
        var transacoes = _context.Transacoes.Where(t => t.PessoaId == id).ToList();

        if (transacoes.Any())
        {
            // Remove em lote
            _context.Transacoes.RemoveRange(transacoes);
        }

        _context.Pessoas.Remove(pessoa);
        _context.SaveChanges();

        return Ok("Pessoa e suas transações foram excluídas.");
    }

    [HttpGet("transacoes")]
    public IActionResult ListarTransacoes()
    {
        //Retorna a lista de transações cadastradas no banco de dados
        var transacoes = _context.Transacoes.ToList();
        return Ok(transacoes);
    }

    [HttpPost("transacoes")]
    public IActionResult AdicionarTransacao(Transacao transacao)
    {
        //Validações dos campos obrigatórios da transação
        if (string.IsNullOrWhiteSpace(transacao.Descricao))
        {
            return BadRequest("Descrição da transação é obrigatória.");
        }

        if (transacao.Valor <= 0)
        {
            return BadRequest("Valor da transação deve ser maior que zero.");
        }

        //Validação do tipo da transação
        if (transacao.Tipo != "Receita" && transacao.Tipo != "Despesa")
        {
            return BadRequest("O tipo da transação deve ser obrigatoriamente 'Receita' ou 'Despesa'.");
        }

        //Verifica se o ID da pessoa informada realmente existe no banco
        var pessoa = _context.Pessoas.Find(transacao.PessoaId);

        if (pessoa == null)
        {
            return NotFound("Pessoa não encontrada");
        }

        //Menores de 18 anos só podem cadastrar despesas
        if (pessoa.Idade < 18 && transacao.Tipo == "Receita")
        {
            return BadRequest("Pessoa menor de idade não pode registrar receitas.");
        }

        _context.Transacoes.Add(transacao);
        _context.SaveChanges();
        return Ok(transacao);
    }

    [HttpGet("totais")]
    public IActionResult ConsultarTotais()
    {
        var listaPessoas = _context.Pessoas.ToList();
        var listaTransacoes = _context.Transacoes.ToList();

        //Monta o resumo individual de cada pessoa
        var resumoPessoas = listaPessoas.Select(p => {

            //Filtra as transações pertencentes a esta pessoa
            var transacoesPessoa = listaTransacoes.Where(t => t.PessoaId == p.Id).ToList();

            //Calcula a soma de receitas e despesas
            var receitas = transacoesPessoa.Where(t => t.Tipo == "Receita").Sum(t => t.Valor);
            var despesas = transacoesPessoa.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor);

            return new
            {
                p.Id,
                p.Nome,
                TotalReceitas = receitas,
                TotalDespesas = despesas,
                Saldo = receitas - despesas
            };
        }).ToList();

        //Calcula os totais gerais agregados de todo o sistema
        var geralReceitas = resumoPessoas.Sum(x => x.TotalReceitas);
        var geralDespesas = resumoPessoas.Sum(x => x.TotalDespesas);

        //Retorna o objeto estruturado exatamente como o front precisa
        return Ok(new
        {
            Pessoas = resumoPessoas,
            GeralReceitas = geralReceitas,
            GeralDespesas = geralDespesas,
            SaldoLiquidoGeral = geralReceitas - geralDespesas
        });
    }
}
