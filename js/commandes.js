const commandesBody = document.getElementById('commandes-body');
const lignesBody = document.getElementById('lignes-body');

const commandeForm = document.getElementById('commande-form');
const ligneForm = document.getElementById('ligne-form');

const reloadCommandesBtn = document.getElementById('reload-commandes');
const reloadLignesBtn = document.getElementById('reload-lignes');

async function chargerCommandes() {
  commandesBody.innerHTML = '<tr><td colspan="5">Chargement...</td></tr>';

  try {
    const commandes = await getAll('commande');

    if (!commandes.length) {
      commandesBody.innerHTML = '<tr><td colspan="5">Aucune commande trouvée.</td></tr>';
      return;
    }

    commandesBody.innerHTML = commandes.map(commande => `
      <tr>
        <td>${escapeHtml(commande.id_commande)}</td>
        <td>${escapeHtml(commande.date_achat)}</td>
        <td>${escapeHtml(commande.statut)}</td>
        <td>${escapeHtml(commande.id_client)}</td>
        <td>
          <button class="danger" onclick="supprimerCommande(${commande.id_commande})">
            Supprimer
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    commandesBody.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;
    setMessage('commande-message', 'Impossible de charger les commandes.', 'error');
  }
}

async function chargerLignesCommandes() {
  lignesBody.innerHTML = '<tr><td colspan="5">Chargement...</td></tr>';

  try {
    const lignes = await getAll('lignecommande');

    if (!lignes.length) {
      lignesBody.innerHTML = '<tr><td colspan="5">Aucune ligne trouvée.</td></tr>';
      return;
    }

    lignesBody.innerHTML = lignes.map(ligne => `
      <tr>
        <td>${escapeHtml(ligne.id_ligne)}</td>
        <td>${escapeHtml(ligne.quantite)}</td>
        <td>${escapeHtml(ligne.id_commande)}</td>
        <td>${escapeHtml(ligne.id_produit)}</td>
        <td>
          <button class="danger" onclick="supprimerLigne(${ligne.id_ligne})">
            Supprimer
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    lignesBody.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;
    setMessage('ligne-message', 'Impossible de charger les lignes de commande.', 'error');
  }
}

commandeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const commande = {
    date_achat: document.getElementById('date_achat').value,
    statut: document.getElementById('statut').value.trim(),
    id_client: Number(document.getElementById('id_client').value)
  };

  try {
    await create('commande', commande);
    commandeForm.reset();
    setMessage('commande-message', 'Commande ajoutée avec succès.', 'success');
    chargerCommandes();
  } catch (error) {
    setMessage('commande-message', error.message, 'error');
  }
});

ligneForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const ligne = {
    quantite: Number(document.getElementById('quantite').value),
    id_commande: Number(document.getElementById('id_commande').value),
    id_produit: Number(document.getElementById('id_produit').value)
  };

  try {
    await create('lignecommande', ligne);
    ligneForm.reset();
    setMessage('ligne-message', 'Ligne de commande ajoutée avec succès.', 'success');
    chargerLignesCommandes();
  } catch (error) {
    setMessage('ligne-message', error.message, 'error');
  }
});

async function supprimerCommande(id) {
  if (!confirm(`Supprimer la commande ${id} ?`)) return;

  try {
    await remove('commande', id);
    setMessage('commande-message', `Commande ${id} supprimée avec succès.`, 'success');
    chargerCommandes();
  } catch (error) {
    setMessage('commande-message', error.message, 'error');
  }
}

async function supprimerLigne(id) {
  if (!confirm(`Supprimer la ligne ${id} ?`)) return;

  try {
    await remove('lignecommande', id);
    setMessage('ligne-message', `Ligne ${id} supprimée avec succès.`, 'success');
    chargerLignesCommandes();
  } catch (error) {
    setMessage('ligne-message', error.message, 'error');
  }
}

reloadCommandesBtn.addEventListener('click', chargerCommandes);
reloadLignesBtn.addEventListener('click', chargerLignesCommandes);

chargerCommandes();
chargerLignesCommandes();