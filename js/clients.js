const clientsBody = document.getElementById('clients-body');
const clientForm = document.getElementById('client-form');
const reloadClientsBtn = document.getElementById('reload-clients');

async function chargerClients() {
  clientsBody.innerHTML = '<tr><td colspan="6">Chargement...</td></tr>';
  try {
    const clients = await getAll('client');
    if (!clients.length) {
      clientsBody.innerHTML = '<tr><td colspan="6">Aucun client trouvé.</td></tr>';
      return;
    }

    clientsBody.innerHTML = clients.map(client => `
      <tr>
        <td>${escapeHtml(client.id_client)}</td>
        <td>${escapeHtml(client.nom)}</td>
        <td>${escapeHtml(client.telephone)}</td>
        <td>${escapeHtml(client.courriel)}</td>
        <td><button class="danger" onclick="supprimerClient(${client.id_client})">Supprimer</button></td>
      </tr>
    `).join('');
  } catch (error) {
    clientsBody.innerHTML = `<tr><td colspan="6">${escapeHtml(error.message)}</td></tr>`;
    setMessage('client-message', 'Impossible de charger les clients. Vérifiez BASE_URL et ORDS.', 'error');
  }
}

async function supprimerClient(id) {
  if (!confirm(`Supprimer le client ${id} ?`)) return;
  try {
    await remove('client', id);
    setMessage('client-message', `Client ${id} supprimé avec succès.`, 'success');
    chargerClients();
  } catch (error) {
    setMessage('client-message', error.message, 'error');
  }
}

clientForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nouveauClient = {
    nom: document.getElementById('nom').value.trim(),
    telephone: document.getElementById('telephone').value.trim(),
    courriel: document.getElementById('courriel').value.trim()
  };

  try {
    await create('client', nouveauClient);
    clientForm.reset();
    setMessage('client-message', 'Client ajouté avec succès.', 'success');
    chargerClients();
  } catch (error) {
    setMessage('client-message', error.message, 'error');
  }
});

reloadClientsBtn.addEventListener('click', chargerClients);
chargerClients();
