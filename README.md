# 🌍 Country Clash

> A geography guessing game — pick the country with the higher stat across 10 rounds.

**[🇺🇦 Українська версія нижче](#-country-clash-ua)**

**[Live Demo](https://thefrenk.github.io/CountryClash/)**

---

## How to Play

1. Two country cards appear on screen
2. Choose the one with the **higher value** in the active category
3. The real numbers are revealed after your pick
4. Complete all 10 rounds — try to get a perfect score!

## Features

- 4 categories: Area, Population, GDP, Population Density
- Real-time GDP data from **World Bank API** (no API key needed)
- Country data from **REST Countries API** (no API key needed)
- Dark / Light theme toggle
- Streak tracker and round progress bar
- Confetti animation on high scores
- Fully responsive (mobile-friendly)
- OOP architecture with vanilla JS classes

## Project Structure

    CountryClash/
    ├── index.html        ← page markup & game shell
    ├── css/
    │   └── main.css      ← all styles, themes & animations
    └── js/
        └── main.js       ← full game logic (Country, Battle, UIRenderer, Game)

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Markup      | HTML5                                   |
| Styles      | CSS3 (Custom Properties, Grid, Clamp)   |
| Logic       | Vanilla JavaScript (ES2022, OOP)        |
| Data        | REST Countries API + World Bank API     |
| Hosting     | GitHub Pages                            |

## OOP Architecture

    Game
     ├── CountryRepository  → fetches & caches Country objects
     │    └── Country       → data model (area, population, gdp, density)
     ├── Battle             → compares two Countries, determines winner
     └── UIRenderer         → updates DOM, animations, confetti

## APIs Used

| API            | Endpoint                                                                | Key required |
|----------------|-------------------------------------------------------------------------|--------------|
| REST Countries | `https://restcountries.com/v3.1/all`                                    | ❌ No        |
| World Bank GDP | `https://api.worldbank.org/v2/country/{cca2}/indicator/NY.GDP.MKTP.CD` | ❌ No        |

---

# 🌍 Country Clash [UA]

> Географічна гра на здогадку — обери країну з вищим показником за 10 раундів.

**[Live Demo](https://thefrenk.github.io/CountryClash/)**

---

## Як грати

1. На екрані з'являються дві картки країн
2. Обери ту, у якої **більше значення** в активній категорії
3. Після вибору відкриваються реальні цифри
4. Пройди всі 10 раундів — спробуй набрати ідеальний рахунок!

## Можливості

- 4 категорії: Площа, Населення, ВВП, Густота населення
- Дані ВВП у реальному часі з **World Bank API** (без ключа)
- Дані країн з **REST Countries API** (без ключа)
- Перемикач темної / світлої теми
- Трекер серії відповідей і прогрес-бар раундів
- Анімація конфеті при високому результаті
- Адаптивний дизайн (підтримка мобільних)
- ООП-архітектура на чистому JS

## Структура проєкту

    CountryClash/
    ├── index.html        ← розмітка сторінки
    ├── css/
    │   └── main.css      ← усі стилі, теми й анімації
    └── js/
        └── main.js       ← вся ігрова логіка (Country, Battle, UIRenderer, Game)

## Технічний стек

| Рівень      | Технологія                              |
|-------------|-----------------------------------------|
| Розмітка    | HTML5                                   |
| Стилі       | CSS3 (Custom Properties, Grid, Clamp)   |
| Логіка      | Vanilla JavaScript (ES2022, OOP)        |
| Дані        | REST Countries API + World Bank API     |
| Хостинг     | GitHub Pages                            |

## ООП-архітектура

    Game
     ├── CountryRepository  → завантажує й кешує об'єкти Country
     │    └── Country       → модель даних (area, population, gdp, density)
     ├── Battle             → порівнює дві Country, визначає переможця
     └── UIRenderer         → оновлює DOM, анімації, конфеті

## API

| API            | Ендпоінт                                                                | Ключ потрібен |
|----------------|-------------------------------------------------------------------------|---------------|
| REST Countries | `https://restcountries.com/v3.1/all`                                    | ❌ Ні         |
| World Bank GDP | `https://api.worldbank.org/v2/country/{cca2}/indicator/NY.GDP.MKTP.CD` | ❌ Ні         |
