const utilisateursBody = document.getElementById('utilisateurs-body');
const utilisateurForm = document.getElementById('utilisateur-form');
const reloadUtilisateursBtn = document.getElementById('reload-utilisateurs');

async function chargerUtilisateurs() {
  utilisateursBody.innerHTML = '<tr><td colspan="5">Chargement...</td></tr>';
  try {
    const utilisateurs = await getAll('utilisateur');
    if (!utilisateurs.length) {
      utilisateursBody.innerHTML = '<tr><td colspan="5">Aucun utilisateur trouvé.</td></tr>';
      return;
    }

    utilisateursBody.innerHTML = utilisateurs.map(user => `
      <tr>
        <td>${escapeHtml(user.id_utilisateur)}</td>
        <td>${escapeHtml(user.nom)}</td>
        <td>${escapeHtml(user.prenom)}</td>
        <td>${escapeHtml(user.courriel)}</td>
        <td>${escapeHtml(user.ville)}</td>
      </tr>
    `).join('');
  } catch (error) {
    utilisateursBody.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;
    setMessage('utilisateur-message', 'Impossible de charger les utilisateurs.', 'error');
  }
}

utilisateurForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const user = {
    nom: document.getElementById('nom').value.trim(),
    prenom: document.getElementById('prenom').value.trim(),
    adresse: document.getElementById('adresse_user').value.trim(),
    ville: document.getElementById('ville').value.trim(),
    courriel: document.getElementById('courriel').value.trim(),
    mdp: document.getElementById('mdp').value.trim()
  };

  try {
    await create('utilisateur', user);
    utilisateurForm.reset();
    setMessage('utilisateur-message', 'Utilisateur ajouté avec succès.', 'success');
    chargerUtilisateurs();
  } catch (error) {
    setMessage('utilisateur-message', error.message, 'error');
  }
});

reloadUtilisateursBtn.addEventListener('click', chargerUtilisateurs);
chargerUtilisateurs();
