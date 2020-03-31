import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { isAuthenticated, logout } from '../../services/auth';
import api from '../../services/api';
import { Container } from './styles';

import logo from '../../assets/logo.svg';

export default function Dashboard() {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const isAuth = await isAuthenticated();

      if (!isAuth) {
        history.push('/');
        toast.error('😔 Sua sessão expirou, por favor, entre novamente.');
      } else {
        setLoading(false);
        setUser(isAuth.data);

        const { data } = await api.get('/dashboard');

        setIncidents(data);
      }
    })();
  }, [history]);

  async function handleDelete(id) {
    try {
      await api.delete(`incidents/${id}`);
      toast('🦄 Caso deletado com sucesso!');

      setIncidents(incidents.filter((i) => i.id !== id));
    } catch (err) {
      toast.error('Parece que algo deu errado, por favor, tente novamente 😕');
    }
  }

  function handleLogout() {
    logout();
    history.push('/');
    toast('Ah não! Sentiremos saudades ❤️');
  }

  return (
    <Container>
      {!loading && (
        <>
          <header>
            <img src={logo} alt="Logo do Be The Hero" />
            <span>Bem-vinda, {user.name}</span>

            <Link className="button" to="/incidents/new">
              Cadastrar novo caso
            </Link>

            <button type="button" onClick={handleLogout}>
              <FiPower size={18} color="#E02041" />
            </button>
          </header>

          <h1>Casos cadastrados</h1>

          <ul>
            {incidents.map((i) => (
              <li key={i.id}>
                <strong>CASO</strong>
                <p>{i.title}</p>

                <strong>DESCRIÇÃO</strong>
                <p>{i.description}</p>

                <strong>VALOR</strong>
                <p>
                  {Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(i.value)}
                </p>

                <button type="button" onClick={() => handleDelete(i.id)}>
                  <FiTrash2 size={20} color="#a8a8b3" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Container>
  );
}
