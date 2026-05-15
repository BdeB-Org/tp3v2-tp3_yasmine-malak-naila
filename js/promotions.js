const promotionsBody = document.getElementById('promotions-body');
const promotionForm = document.getElementById('promotion-form');
const reloadPromotionsBtn = document.getElementById('reload-promotions');

async function chargerPromotions() {
  promotionsBody.innerHTML = '<tr><td colspan="5">Chargement...</td></tr>';

  try {
    const promotions = await getAll('promotion');

    if (!promotions.length) {
      promotionsBody.innerHTML = '<tr><td colspan="5">Aucune promotion trouvée.</td></tr>';
      return;
    }

    promotionsBody.innerHTML = promotions.map(promotion => `
      <tr>
        <td>${escapeHtml(promotion.id_promotion)}</td>
        <td>${escapeHtml(promotion.nom)}</td>
        <td>${escapeHtml(promotion.pourcentage_rabais)}</td>
        <td>${escapeHtml(promotion.date_debut)}</td>
        <td>${escapeHtml(promotion.date_fin)}</td>
      </tr>
    `).join('');

  } catch (error) {

    promotionsBody.innerHTML =
      `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;

    setMessage(
      'promotion-message',
      'Impossible de charger les promotions.',
      'error'
    );
  }
}

promotionForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const promotion = {
    nom: document.getElementById('nom').value.trim(),
    pourcentage_rabais: document.getElementById('pourcentage_rabais').value.trim(),
    date_debut: document.getElementById('date_debut').value.trim(),
    date_fin: document.getElementById('date_fin').value.trim()
  };

  try {

    await create('promotion', promotion);

    promotionForm.reset();

    setMessage(
      'promotion-message',
      'Promotion ajoutée avec succès.',
      'success'
    );

    chargerPromotions();

  } catch (error) {

    setMessage(
      'promotion-message',
      error.message,
      'error'
    );
  }
});

reloadPromotionsBtn.addEventListener('click', chargerPromotions);

chargerPromotions();