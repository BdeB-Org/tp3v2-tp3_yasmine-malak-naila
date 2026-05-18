const lignesBody = document.getElementById('lignes-body');

const ligneForm = document.getElementById('ligne-form');

const reloadLignesBtn = document.getElementById('reload-lignes');

async function chargerLignes() {

  lignesBody.innerHTML =
    '<tr><td colspan="5">Chargement...</td></tr>';

  try {

    const lignes = await getAll('lignecommande');

    if (!lignes.length) {

      lignesBody.innerHTML =
        '<tr><td colspan="5">Aucune ligne trouvée.</td></tr>';

      return;
    }

    lignesBody.innerHTML = lignes.map(ligne => `
      <tr>

        <td>${escapeHtml(ligne.id_ligne)}</td>

        <td>${escapeHtml(ligne.quantite)}</td>

        <td>${escapeHtml(ligne.id_commande)}</td>

        <td>${escapeHtml(ligne.id_produit)}</td>

        <td>
          <button
            class="danger"
            onclick="supprimerLigne(${ligne.id_ligne})"
          >
            Supprimer
          </button>
        </td>

      </tr>
    `).join('');

  } catch (error) {

    lignesBody.innerHTML =
      `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;

    setMessage(
      'ligne-message',
      'Impossible de charger les lignes de commande.',
      'error'
    );
  }
}

ligneForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const ligne = {

    quantite: Number(
      document.getElementById('quantite').value
    ),

    id_commande: Number(
      document.getElementById('id_commande').value
    ),

    id_produit: Number(
      document.getElementById('id_produit').value
    )
  };

  try {

    await create('lignecommande', ligne);

    ligneForm.reset();

    setMessage(
      'ligne-message',
      'Ligne de commande ajoutée avec succès.',
      'success'
    );

    chargerLignes();

  } catch (error) {

    setMessage(
      'ligne-message',
      error.message,
      'error'
    );
  }
});

async function supprimerLigne(id) {

  if (!confirm(`Supprimer la ligne ${id} ?`)) {
    return;
  }

  try {

    await remove('lignecommande', id);

    setMessage(
      'ligne-message',
      `Ligne ${id} supprimée avec succès.`,
      'success'
    );

    chargerLignes();

  } catch (error) {

    setMessage(
      'ligne-message',
      error.message,
      'error'
    );
  }
}

reloadLignesBtn.addEventListener(
  'click',
  chargerLignes
);

chargerLignes();