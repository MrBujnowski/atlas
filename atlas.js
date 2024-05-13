// Funkce pro načítání a vykreslování dat podle vybraného kontinentu a řazení podle vybraného parametru
function fetchDataAndRender(continent, sortBy) {
    if (continent === 'world') {
        loadAllCountriesData(sortBy); // Pokud je vybrán kontinent 'world', načte data o všech zemích
    } else {
        fetch(`https://restcountries.com/v3.1/region/${continent}`)
            .then((response) => response.json())
            .then((data) => {
                const sortedData = sortCountries(data, sortBy);
                renderData(sortedData);
            })
            .catch((error) => {
                console.error('Chyba při načítání dat:', error);
            });
    }
}

// Funkce pro načítání a vykreslení dat všech zemí
function loadAllCountriesData(sortBy) {
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            const sortedData = sortCountries(data, sortBy);
            renderData(sortedData);
        })
        .catch(error => {
            console.error("Nastala chyba při načítání dat: ", error);
        });
}

// Funkce pro třídění zemí
function sortCountries(countries, sortBy) {
    switch (sortBy) {
        case 'population':
            return countries.sort((a, b) => b.population - a.population);
        case 'area':
            return countries.sort((a, b) => b.area - a.area);
        case 'borders':
            return countries.sort((a, b) => {
                const aBorders = a.borders ? a.borders.length : 0;
                const bBorders = b.borders ? b.borders.length : 0;
                return bBorders - aBorders;
            });
        default:
            return countries;
    }
}

// Funkce pro vykreslení dat na stránce
function renderData(data) {
    const staty = document.getElementById('staty');
    staty.innerHTML = ''; // Vyčistit obsah elementu

    data.forEach(stat => {
        // Počet sousedících zemí, pokud není dostupný, použije se 0
        const borderCount = stat.borders ? stat.borders.length : 0;

        let blockCountry = `
        <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 odsazeni">
            <div class="card">
                <a href="${stat.maps.googleMaps}" target="_blank">
                    <img class="card-img-top obrazek" src="${stat.flags.png}" alt="${stat.name.official}" />
                </a>
                <div class="image-divider"></div>
                <div class="card-body">
                    <h4 class="card-title">${stat.translations.ces.common}</h4>
                    <p class="card-text">Počet obyvatel: ${stat.population}
                        <br> Rozloha: ${stat.area} km²
                        <br> Počet sousedících zemí: ${borderCount}
                    </p>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-${stat.cca2}">
                        Více
                    </button>
                </div>
            </div>
        </div>`;

        let modalContentForCountry = `
        <div class="modal fade" id="modal-${stat.cca2}" tabindex="-1" aria-labelledby="modalTitle-${stat.cca2}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title" id="modalTitle-${stat.cca2}">${stat.translations.ces.common}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Podrobné informace o ${stat.translations.ces.common}:</p>
                        <!-- Sem můžete vložit další informace o státu -->
                        <div style="text-align: center;">
                                <img class="card-img-top" style=" height: auto; display: inline-block;" src="${stat.flags.png}" alt="${stat.name.official}" />
                        </div>

                        <div class="odsazeni1"></div>
                        <div class="image-container">
                            <img class="card-img-top" style="max-width: 50%; height: auto; display: block; margin: 0 auto;" src="${stat.coatOfArms.png}" alt="státní znak">
                        </div>

                        <p class="card-text"><b>Počet obyvatel:</b> ${stat.population}
                            <br> <b>Rozloha:</b> ${stat.area} km²
                            <br> <b>Počet sousedících zemí:</b> ${borderCount}
                            <br> <b>Hlavní město:</b> ${stat.capital}
                            <br> <b>Počáteční den v týdnu:</b> ${stat.startOfWeek}
                            <br> <b><a href="${stat.maps.googleMaps}" target="_blank">Mapa</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>`;

        staty.insertAdjacentHTML('beforeend', blockCountry);
        document.body.insertAdjacentHTML('beforeend', modalContentForCountry); // Přidání modálního obsahu do dokumentu
    });
    // Inicializace Bootstrap modálních oken
    var modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        new bootstrap.Modal(modal);
    });
}

// Posluchač události změny výběru kontinentu
const selectContinent = document.getElementById('selContinent');
const selectSortParam = document.getElementById('sortParam');
selectContinent.addEventListener('change', function() {
    const selectedContinent = this.value;
    const selectedSortParam = selectSortParam.value;
    fetchDataAndRender(selectedContinent, selectedSortParam);
});

// Posluchač události změny výběru řazení
selectSortParam.addEventListener('change', function() {
    const selectedContinent = selectContinent.value;
    const selectedSortParam = this.value;
    fetchDataAndRender(selectedContinent, selectedSortParam);
});

// Zavolání funkce pro načtení a vykreslení dat pro výchozí kontinent a řazení při načtení stránky
fetchDataAndRender(selectContinent.value, selectSortParam.value);
