const catalog = document.getElementById("catalog");
const browseButton = document.getElementById("browseButton");
const catalogBackButton = document.getElementById("catalogBackButton");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const catalogList = document.getElementById("catalogList");
const catalogCount = document.getElementById("catalogCount");
const heroBirthPlace = document.getElementById("heroBirthPlace");
const heroFeat = document.getElementById("heroFeat");
const heroFact = document.getElementById("heroFact");
const heroFactBox = document.getElementById("heroFactBox");
const welcome = document.getElementById("welcome");
const story = document.getElementById("story");
const completed = document.getElementById("completed");

const openButton = document.getElementById("openStory");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const moreButton = document.getElementById("moreButton");
const restartButton = document.getElementById("restartButton");

const heroName = document.getElementById("heroName");
const heroBirth = document.getElementById("heroBirth");
const heroDeath = document.getElementById("heroDeath");
const heroAwards = document.getElementById("heroAwards");
const factsSourceLink = document.getElementById("factsSourceLink");
const heroRole = document.getElementById("heroRole");
const heroSummary = document.getElementById("heroSummary");
const heroDetails = document.getElementById("heroDetails");
const sourceLink = document.getElementById("sourceLink");
const heroPhoto = document.getElementById("heroPhoto");
const photoFallback = document.getElementById("photoFallback");

let remainingHeroes = [];

let viewMode = "random";
let selectedCatalogHero = null;

// Переключаем экраны
function showScreen(activeScreen) {
    welcome.hidden = activeScreen !== welcome;
    story.hidden = activeScreen !== story;
    completed.hidden = activeScreen !== completed;
    catalog.hidden = activeScreen !== catalog;

    window.scrollTo(0, 0);
}

// Перемешиваем список героинь
function shuffleHeroes() {
    remainingHeroes = [...heroines];

    for (let i = remainingHeroes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [remainingHeroes[i], remainingHeroes[j]] =
            [remainingHeroes[j], remainingHeroes[i]];
    }
}

//Формирование спсика
function renderCatalog() {
    const query = searchInput.value
        .trim()
        .toLowerCase()
        .replaceAll("ё", "е");

    const selectedCategory = categoryFilter.value;

    const filteredHeroes = heroines.filter(function (heroine) {
        const searchableText = (
            heroine.name + " " +
            heroine.role + " " +
            heroine.birthPlace
        )
            .toLowerCase()
            .replaceAll("ё", "е");

        const matchesSearch = searchableText.includes(query);

        const matchesCategory =
            selectedCategory === "all" ||
            heroine.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    catalogCount.textContent =
        "Найдено героинь: " + filteredHeroes.length;

    catalogList.replaceChildren();

    if (filteredHeroes.length === 0) {
        const message = document.createElement("p");
        message.className = "catalog-empty";
        message.textContent =
            "Ничего не найдено. Попробуйте изменить запрос или категорию.";

        catalogList.appendChild(message);
        return;
    }

    filteredHeroes.forEach(function (heroine) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "catalog-card";

        const photo = document.createElement("img");
        photo.src = heroine.image;
        photo.alt = "Фотография: " + heroine.name;
        photo.loading = "lazy";

        const info = document.createElement("span");
        info.className = "catalog-card-info";

        const name = document.createElement("strong");
        name.textContent = heroine.name;

        const role = document.createElement("span");
        role.textContent = heroine.role;

        const years = document.createElement("small");
        years.textContent = heroine.years;

        info.append(name, role, years);
        card.append(photo, info);

        card.addEventListener("click", function () {
            viewMode = "catalog";
            selectedCatalogHero = heroine;
            showNextHero();
        });

        catalogList.appendChild(card);
    });
}

// Показываем следующую героиню
function showNextHero() {

    if (viewMode === "random" && remainingHeroes.length === 0) {
        showScreen(completed);
        return;
    }

    const heroine =
        viewMode === "catalog"
            ? selectedCatalogHero
            : remainingHeroes.pop();

    heroName.textContent = heroine.name;

    heroBirth.textContent = heroine.birthDate;
    heroDeath.textContent = heroine.deathDate;

    heroAwards.replaceChildren();

    heroine.awards.forEach(function (award) {
        const item = document.createElement("li");
        item.textContent = award;
        heroAwards.appendChild(item);
    });

    factsSourceLink.href = heroine.factsSource;
    heroRole.textContent = heroine.role;
    heroSummary.textContent = heroine.summary;
    heroBirthPlace.textContent = heroine.birthPlace;
    heroFeat.textContent = heroine.feat;
    heroFact.textContent = heroine.fact;

    heroDetails.textContent = heroine.details;
    heroFactBox.hidden = true;
    sourceLink.href = heroine.source;

    heroPhoto.hidden = true;
    photoFallback.hidden = false;

    heroPhoto.alt = "Фотография: " + heroine.name;

    if (heroine.image) {
        heroPhoto.src = heroine.image;
    } else {
        heroPhoto.removeAttribute("src");
    }

    heroDetails.hidden = true;
    moreButton.textContent = "Узнать больше";

    nextButton.textContent =
        remainingHeroes.length === 0
            ? "Завершить просмотр"
            : "Другая героиня";


    nextButton.hidden = viewMode === "catalog";

    backButton.textContent =
        viewMode === "catalog"
            ? "← К каталогу"
            : "← На главную";

    showScreen(story);
}

// Открываем первую историю
openButton.addEventListener("click", function () {
  viewMode = "random";
  shuffleHeroes();
  showNextHero();
});


// Переходим к следующей истории
nextButton.addEventListener("click", showNextHero);

// Раскрываем подробную биографию
moreButton.addEventListener("click", function () {
    const shouldShow = heroDetails.hidden;

    heroDetails.hidden = !shouldShow;
    heroFactBox.hidden = !shouldShow;

    moreButton.textContent = shouldShow
        ? "Свернуть"
        : "Узнать больше";
});


// Возвращаемся на главную
backButton.addEventListener("click", function () {
  if (viewMode === "catalog") {
    showScreen(catalog);
  } else {
    showScreen(welcome);
  }
});


// Начинаем новый цикл
restartButton.addEventListener("click", function () {
    viewMode = "random";
    shuffleHeroes();
    showNextHero();
});


// Если фотография успешно загрузилась
heroPhoto.addEventListener("load", function () {
    heroPhoto.hidden = false;
    photoFallback.hidden = true;
});

// Если фотография не загрузилась
heroPhoto.addEventListener("error", function () {
    heroPhoto.hidden = true;
    photoFallback.hidden = false;
});


browseButton.addEventListener("click", function () {
  viewMode = "catalog";
  renderCatalog();
  showScreen(catalog);
});

catalogBackButton.addEventListener("click", function () {
  showScreen(welcome);
});

searchInput.addEventListener("input", renderCatalog);

categoryFilter.addEventListener("change", renderCatalog);

