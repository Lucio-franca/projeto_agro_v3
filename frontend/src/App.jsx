// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/listaStartups')
      .then(resposta => resposta.json())
      .then(dados => setStartups(dados))
      .catch(erro => console.log("Erro: ", erro));
  }, []);

  // POST Função
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [ano, setAno] = useState('');

  const cadastrarStartup = (evento) => {
    evento.preventDefault();

    const novaStartup = { nome, especialidade, ano };

    fetch('http://localhost:3000/listaStartups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaStartup)
    })
      .then(res => res.json())
      .then(dadoSalvo => {
        setStartups([...startups, dadoSalvo]); // Adiciona na tela
        setNome('');
        setEspecialidade('');
        setAno('');
      });
  };

  // Delete Função
  const deletarStartup = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;

    fetch(`http://localhost:3000/listaStartups/${id}`, { method: 'DELETE' })
      .then(() => {
        setStartups(startups.filter(s => s.id !== id)); // Remove da tela
      });
  };

  // PUT Função 
  const editarStartup = (id, startupAtual) => {
    const novoNome = window.prompt("Novo nome:", startupAtual.nome);
    const novaEsp = window.prompt("Nova especialidade:", startupAtual.especialidade);
    const novoAno = window.prompt("Novo ano:", startupAtual.ano);

    if (!novoNome || !novaEsp || !novoAno) return;

    fetch(`http://localhost:3000/listaStartups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoNome, especialidade: novaEsp, ano: novoAno })
    })
      .then(res => res.json())
      .then(dadoAtualizado => {
        setStartups(startups.map(s => s.id === id ? dadoAtualizado : s));
      });
  };

  return (
    <div>
      <h1>Painel do Produtor Rural</h1>
      <h2>Startups Disponíveis:</h2>

      <form onSubmit={cadastrarStartup} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Especialidade"
          value={especialidade}
          onChange={e => setEspecialidade(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Ano de abertura"
          value={ano}
          onChange={e => setAno(e.target.value)}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>

      <ul>
        {startups.map(startup => (
          <li key={startup.id}>
            <strong>{startup.nome}</strong> - {startup.especialidade} - {startup.ano}
            <button onClick={() => deletarStartup(startup.id)}>Excluir</button>
            <button onClick={() => editarStartup(startup.id, startup)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;