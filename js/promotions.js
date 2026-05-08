const promotionsBody = document.getElementById('promotions-body');
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
  }
}

reloadPromotionsBtn.addEventListener('click', chargerPromotions);

chargerPromotions();