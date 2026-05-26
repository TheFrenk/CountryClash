# 🌍 Country Clash

> A geography guessing game — pick the country with the higher stat across 10 rounds.

**[🇺🇦 Українська версія нижче](#-country-clash-ua)**

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
- OOP architecture with ES Modules

## Project Structure
    CountryClash/
    ├── index.html                ← page markup
    ├── styles.css                ← all styles & animations
    └── js/
        ├── main.js               ← entry point
        ├── Game.js               ← game loop & state
        ├── Battle.js             ← comparison logic
        ├── Country.js            ← country data model
        ├── CountryRepository.js  ← API requests & cache
        ├── UIRenderer.js         ← DOM updates & effects
        ├── config.js             ← categories config
        └── utils.js              ← number formatting helpers

## 🛠Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Markup     | HTML5                               |
| Styles     | CSS3 (Custom Properties, Grid, Clamp) |
| Logic      | Vanilla JavaScript (ES Modules)     |
| Data       | REST Countries API + World Bank API |

# 🌍 Country Clash [UA]

> Географічна гра на здогадку — обери країну з вищим показником за 10 раундів.

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
- ООП-архітектура з ES Modules

## Структура проєкту

    CountryClash/
    ├── index.html                ← розмітка сторінки
    ├── styles.css                ← усі стилі й анімації
    └── js/
        ├── main.js               ← точка входу
        ├── Game.js               ← ігровий цикл і стан
        ├── Battle.js             ← логіка порівняння
        ├── Country.js            ← модель даних країни
        ├── CountryRepository.js  ← запити до API та кеш
        ├── UIRenderer.js         ← оновлення DOM та ефекти
        ├── config.js             ← конфіг категорій
        └── utils.js              ← допоміжне форматування чисел

## Технічний стек

| Рівень      | Технологія                              |
|-------------|-----------------------------------------|
| Розмітка    | HTML5                                   |
| Стилі       | CSS3 (Custom Properties, Grid, Clamp)   |
| Логіка      | Vanilla JavaScript (ES Modules)         |
| Дані        | REST Countries API + World Bank API     |