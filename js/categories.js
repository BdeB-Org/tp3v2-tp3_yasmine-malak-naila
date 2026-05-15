const categoriesBody = document.getElementById('categories-body');
const categorieForm = document.getElementById('categorie-form');
const reloadCategoriesBtn = document.getElementById('reload-categories');

async function chargerCategories() {
  categoriesBody.innerHTML = '<tr><td colspan="2">Chargement...</td></tr>';

  try {
    const categories = await getAll('categorie');

    if (!categories.length) {
      categoriesBody.innerHTML = '<tr><td colspan="2">Aucune catégorie trouvée.</td></tr>';
      return;
    }

    categoriesBody.innerHTML = categories.map(categorie => `
      <tr>
        <td>${escapeHtml(categorie.id_categorie)}</td>
        <td>${escapeHtml(categorie.nom)}</td>
      </tr>
    `).join('');

  } catch (error) {

    categoriesBody.innerHTML =
      `<tr><td colspan="2">${escapeHtml(error.message)}</td></tr>`;

    setMessage(
      'categorie-message',
      'Impossible de charger les catégories.',
      'error'
    );
  }
}

categorieForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const categorie = {
    nom: document.getElementById('nom').value.trim()
  };

  try {

    await create('categorie', categorie);

    categorieForm.reset();

    setMessage(
      'categorie-message',
      'Catégorie ajoutée avec succès.',
      'success'
    );

    chargerCategories();

  } catch (error) {

    setMessage(
      'categorie-message',
      error.message,
      'error'
    );
  }
});

reloadCategoriesBtn.addEventListener('click', chargerCategories);

chargerCategories();