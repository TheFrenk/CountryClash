function formatBig(v) {
    if (v >= 1e12) return (v / 1e12).toFixed(2) + ' трлн';
    if (v >= 1e9)  return (v / 1e9).toFixed(1)  + ' млрд';
    if (v >= 1e6)  return (v / 1e6).toFixed(1)  + ' млн';
    if (v >= 1e3)  return (v / 1e3).toFixed(1)  + ' тис';
    return String(v);
}

const CATEGORIES = {
    area: {
        name:   'Площа',
        hint:   'Оберіть країну з більшою площею',
        field:  'area',
        icon:   '🗺️',
        label:  'Площа',
        format: v => v ? v.toLocaleString('uk') + ' km²' : 'Н/Д',
    },
    population: {
        name:   'Населення',
        hint:   'Оберіть країну з більшим населенням',
        field:  'population',
        icon:   '👥',
        label:  'Населення',
        format: v => v ? formatBig(v) : 'Н/Д',
    },
    gdp: {
        name:   'ВВП',
        hint:   'Оберіть країну з більшим ВВП',
        field:  'gdp',
        icon:   '💰',
        label:  'ВВП',
        format: v => v ? '$' + formatBig(v) : 'Завантаження...',
    },
    density: {
        name:   'Густота населення',
        hint:   'Оберіть країну з більшою густотою',
        field:  'density',
        icon:   '📍',
        label:  'Густина',
        format: v => v ? v.toFixed(1) + ' чол/km²' : 'Н/Д',
    },
};

class Country {
    constructor(data) {
        this.name       = data.name?.common   || 'Unknown';
        this.official   = data.name?.official || this.name;
        this.flag       = data.flag           || '🌐';
        this.cca2       = data.cca2           || '';
        this.region     = data.region         || '';
        this.subregion  = data.subregion      || '';
        this.area       = data.area           || 0;
        this.population = data.population     || 0;
        this.capital    = data.capital?.[0]   || '—';

        this.currencies = data.currencies
            ? Object.values(data.currencies).map(c => c.name).join(', ')
            : '—';

        this.languages = data.languages
            ? Object.values(data.languages).slice(0, 2).join(', ')
            : '—';

        this.density = this.area > 0 ? this.population / this.area : 0;
        this.gdp     = null;
    }

    getValue(field) {
        return this[field] ?? 0;
    }
}

class CountryRepository {
    constructor() {
        this._cache    = null;
        this._gdpCache = {};
    }

    async getAll() {
        if (this._cache) return this._cache;

        const res = await fetch(
            'https://restcountries.com/v3.1/all' +
            '?fields=name,flag,cca2,region,subregion,area,population,capital,currencies,languages'
        );
        const raw = await res.json();

        this._cache = raw
            .filter(d => d.area > 1000 && d.population > 100000)
            .map(d => new Country(d));

        return this._cache;
    }

    async loadGdp(country) {
        if (country.gdp !== null) return;
        if (this._gdpCache[country.cca2] !== undefined) {
            country.gdp = this._gdpCache[country.cca2];
            return;
        }

        try {
            const res  = await fetch(
                `https://api.worldbank.org/v2/country/${country.cca2}/indicator/NY.GDP.MKTP.CD?format=json&mrv=1`
            );
            const json = await res.json();
            const value = json?.[1]?.[0]?.value ?? null;
            country.gdp = value;
            this._gdpCache[country.cca2] = value;
        } catch {
            country.gdp = null;
            this._gdpCache[country.cca2] = null;
        }
    }

    async getRandomPair(usedNames = new Set()) {
        const all  = await this.getAll();
        const pool = all
            .filter(c => !usedNames.has(c.name) && c.area > 0 && c.population > 0)
            .sort(() => Math.random() - 0.5);

        const [cA, cB] = [pool[0], pool[1]];
        await Promise.all([this.loadGdp(cA), this.loadGdp(cB)]);
        return [cA, cB];
    }
}

class Battle {
    constructor(countryA, countryB, category) {
        this.countryA = countryA;
        this.countryB = countryB;
        this.category = category;
        this.cat      = CATEGORIES[category];
        this.valA     = countryA.getValue(this.cat.field);
        this.valB     = countryB.getValue(this.cat.field);
        this.winner   = this.valA >= this.valB ? 'A' : 'B';
    }

    check(choice) {
        return choice === this.winner;
    }

    getDiff() {
        const bigger  = Math.max(this.valA, this.valB);
        const smaller = Math.min(this.valA, this.valB);
        if (smaller === 0) return null;
        return ((bigger - smaller) / smaller * 100).toFixed(1);
    }

    getExplanation() {
        const winC  = this.winner === 'A' ? this.countryA : this.countryB;
        const loseC = this.winner === 'A' ? this.countryB : this.countryA;
        const winVal  = this.cat.format(Math.max(this.valA, this.valB));
        const loseVal = this.cat.format(Math.min(this.valA, this.valB));
        const diff    = this.getDiff();
        const suffix  = diff ? ` (на ${diff}% більше)` : '';
        return `${winC.name}: ${winVal}${suffix} проти ${loseC.name}: ${loseVal}`;
    }
}

class UIRenderer {
    constructor() {
        this.resultPanel = document.getElementById('resultPanel');
        this.endgame     = document.getElementById('endgame');
    }

    renderCard(side, country, category, hidden = true) {
        const cat = CATEGORIES[category];

        document.getElementById(`flag${side}`).textContent   = country.flag;
        document.getElementById(`name${side}`).textContent   = country.name;
        document.getElementById(`region${side}`).textContent = country.subregion || country.region;

        document.getElementById(`stat${side}1`).innerHTML =
            `<span class="stat-label">🏙️ Столиця</span>
       <span class="stat-value">${country.capital}</span>`;

        document.getElementById(`stat${side}2`).innerHTML =
            `<span class="stat-label">🗣️ Мови</span>
       <span class="stat-value">${country.languages}</span>`;

        const val = cat.format(country.getValue(cat.field));
        document.getElementById(`stat${side}Main`).innerHTML =
            `<span class="stat-label">${cat.icon} ${cat.label}</span>
       <span class="stat-value ${hidden ? 'stat-hidden' : ''}">${val}</span>`;

        const card = document.getElementById(`card${side}`);
        card.classList.remove('selected-win', 'selected-lose', 'correct-answer', 'disabled');
    }

    revealStats() {
        document.getElementById('statAMain').querySelector('.stat-hidden')?.classList.remove('stat-hidden');
        document.getElementById('statBMain').querySelector('.stat-hidden')?.classList.remove('stat-hidden');
    }

    markResult(chosen, battle) {
        const cardA = document.getElementById('cardA');
        const cardB = document.getElementById('cardB');
        cardA.classList.add('disabled');
        cardB.classList.add('disabled');
        this.revealStats();

        if (chosen === 'A') {
            cardA.classList.add(battle.winner === 'A' ? 'selected-win' : 'selected-lose');
            if (battle.winner === 'B') cardB.classList.add('correct-answer');
        } else {
            cardB.classList.add(battle.winner === 'B' ? 'selected-win' : 'selected-lose');
            if (battle.winner === 'A') cardA.classList.add('correct-answer');
        }
    }

    showResult(isCorrect, battle) {
        this.resultPanel.classList.add('visible');
        document.getElementById('resultEmoji').textContent = isCorrect ? '🎉' : '😬';
        const title = document.getElementById('resultTitle');
        title.className   = 'result-title ' + (isCorrect ? 'win' : 'lose');
        title.textContent = isCorrect ? 'Правильно!' : 'Неправильно!';
        document.getElementById('resultExplanation').textContent = battle.getExplanation();
    }

    hideResult() {
        this.resultPanel.classList.remove('visible');
    }

    updateStreak(history) {
        document.getElementById('streakDots').innerHTML = history
            .slice(-10)
            .map(r => `<div class="streak-dot ${r ? 'win' : 'lose'}"></div>`)
            .join('');
    }

    updateScoreHeader(wins, total) {
        document.getElementById('scoreWins').textContent  = wins;
        document.getElementById('scoreTotal').textContent = total;
    }

    updateRound(current, total) {
        document.getElementById('roundText').textContent    = `Раунд ${current} / ${total}`;
        document.getElementById('progressFill').style.width = `${(current - 1) / total * 100}%`;
    }

    showEndgame(wins, total) {
        document.getElementById('gameArea').style.display = 'none';
        this.endgame.classList.add('visible');
        document.getElementById('endScore').textContent = `${wins}/${total}`;

        const pct = wins / total;
        let trophy, msg;
        if      (pct === 1)  { trophy = '🥇'; msg = 'Ідеальний результат! Ти справжній географ!'; }
        else if (pct >= 0.8) { trophy = '🥈'; msg = 'Відмінно! Майже ідеал.'; }
        else if (pct >= 0.6) { trophy = '🥉'; msg = 'Непоганий результат! Є куди рости.'; }
        else if (pct >= 0.4) { trophy = '🌍'; msg = 'Треба більше практики. Спробуй ще!'; }
        else                 { trophy = '📚'; msg = 'Хм, варто підтягнути географію 😄'; }

        this.endgame.querySelector('.endgame-trophy').textContent = trophy;
        document.getElementById('endMsg').textContent = msg;
        if (pct >= 0.8) this._launchConfetti();
    }

    _launchConfetti() {
        const wrap   = document.getElementById('confettiWrap');
        const colors = ['#5b8af5','#f5c842','#4ade80','#f87171','#a78bfa','#fb923c'];
        for (let i = 0; i < 60; i++) {
            const el = document.createElement('div');
            el.className = 'confetti-piece';
            el.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        --dur: ${0.8 + Math.random()}s;
        --delay: ${Math.random() * 0.6}s;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;
            wrap.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
    }
}

class Game {
    constructor() {
        this.repo        = new CountryRepository();
        this.ui          = new UIRenderer();
        this.totalRounds = 10;
        this.round       = 0;
        this.wins        = 0;
        this.history     = [];
        this.category    = 'area';
        this.battle      = null;
        this.answered    = false;
        this.usedNames   = new Set();

        this._initStars();
        this._initTheme();
        this._bindEvents();
    }

    _initStars() {
        const wrap = document.getElementById('stars');
        for (let i = 0; i < 60; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            s.style.cssText = `
        left: ${Math.random() * 100}%;
        top:  ${Math.random() * 100}%;
        width:  ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
        --dur:   ${2 + Math.random() * 4}s;
        --delay: ${Math.random() * 3}s;
      `;
            wrap.appendChild(s);
        }
    }

    _initTheme() {
        const btn  = document.getElementById('themeBtn');
        const icon = document.getElementById('themeIcon');
        const html = document.documentElement;

        const setIcon = theme => {
            icon.innerHTML = theme === 'dark'
                ? `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`
                : `<circle cx="12" cy="12" r="5"/>
           <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
                    M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>`;
        };

        setIcon('dark');
        btn.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            setIcon(next);
        });
    }

    _bindEvents() {
        const pick    = side => () => this.choose(side);
        const keyPick = side => e => { if (e.key === 'Enter' || e.key === ' ') this.choose(side); };

        document.getElementById('cardA').addEventListener('click',   pick('A'));
        document.getElementById('cardB').addEventListener('click',   pick('B'));
        document.getElementById('cardA').addEventListener('keydown', keyPick('A'));
        document.getElementById('cardB').addEventListener('keydown', keyPick('B'));
        document.getElementById('nextBtn').addEventListener('click',      () => this.nextRound());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restart());

        document.querySelectorAll('.cat-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.category = chip.dataset.cat;
                this._updateCategoryUI();
                if (!this.answered) this._refreshCards();
            });
        });
    }

    _updateCategoryUI() {
        const cat = CATEGORIES[this.category];
        document.getElementById('catName').textContent = cat.name;
        document.getElementById('catHint').textContent = cat.hint;
    }

    _showSkeleton() {
        ['A', 'B'].forEach(side => {
            const card = document.getElementById(`card${side}`);
            card.classList.remove('selected-win', 'selected-lose', 'correct-answer', 'disabled');
            document.getElementById(`flag${side}`).textContent   = '⏳';
            document.getElementById(`name${side}`).textContent   = 'Завантаження...';
            document.getElementById(`region${side}`).textContent = '';
            ['1', '2', 'Main'].forEach(n => {
                document.getElementById(`stat${side}${n}`).innerHTML =
                    `<span class="skeleton" style="height:18px;width:${70 + Math.random() * 20}%;display:block"></span>`;
            });
        });
    }

    _refreshCards() {
        if (!this.battle) return;
        this.ui.renderCard('A', this.battle.countryA, this.category, !this.answered);
        this.ui.renderCard('B', this.battle.countryB, this.category, !this.answered);
        this.battle = new Battle(this.battle.countryA, this.battle.countryB, this.category);
    }

    async start() {
        this.round = 0; this.wins = 0;
        this.history = []; this.usedNames.clear();
        this.ui.updateScoreHeader(0, 0);
        this._updateCategoryUI();
        await this.nextRound();
    }

    async nextRound() {
        this.ui.hideResult();
        this.answered = false;

        if (this.round >= this.totalRounds) {
            this.ui.showEndgame(this.wins, this.totalRounds);
            return;
        }

        this.round++;
        this.ui.updateRound(this.round, this.totalRounds);
        this._showSkeleton();

        try {
            const [cA, cB] = await this.repo.getRandomPair(this.usedNames);
            this.usedNames.add(cA.name);
            this.usedNames.add(cB.name);
            this.battle = new Battle(cA, cB, this.category);
            this.ui.renderCard('A', cA, this.category, true);
            this.ui.renderCard('B', cB, this.category, true);
        } catch {
            document.getElementById('nameA').textContent = 'Помилка API';
            document.getElementById('nameB').textContent = 'Перевір інтернет';
        }
    }

    choose(side) {
        if (this.answered || !this.battle) return;
        this.answered = true;

        const isCorrect = this.battle.check(side);
        if (isCorrect) this.wins++;
        this.history.push(isCorrect);

        this.ui.markResult(side, this.battle);
        this.ui.showResult(isCorrect, this.battle);
        this.ui.updateScoreHeader(this.wins, this.round);
        this.ui.updateStreak(this.history);
    }

    restart() {
        document.getElementById('endgame').classList.remove('visible');
        document.getElementById('gameArea').style.display = '';
        this.start();
    }
}

const game = new Game();
game.start();