'use strict';

import '../scss/app.scss';

const container = document.querySelector('.container');
const btn = document.querySelector('.button');
const from = document.querySelector('#from');
const to = document.querySelector('#to');
const sort = document.querySelector('#sort');

class App {
  #planets;
  #filtered;
  #bool = false;

  constructor() {
    this._loadAPI();

    btn.addEventListener('click', this._filterAPI.bind(this));
  }

  async _loadAPI() {
    const res = await fetch('https://swapi.dev/api/planets');
    const data = await res.json();
    this.#planets = data.results;

    this._printToPage(this.#planets, container);
  }

  _printToPage(what, where) {
    container.classList.add('visible');

    what.forEach(planet => {
      const data = planet.created.slice(0, 10).split('-').reverse().join('-');
      const ora = planet.created.slice(11, 16);
      const formatterd = `${data} ${ora}`;

      const html = `
        <div class="box">
          <div class="info">
            <div class="info__place">${planet.name}</div>
            <div class="info__date">${formatterd}</div>
          </div>
          <div class="time-line"></div>
        </div>
        `;

      where.insertAdjacentHTML('beforeend', html);
    });
  }

  _filterAPI(e) {
    e.preventDefault();

    // se si clicca su un bottone e se il bottone ha come valore search
    // svuota la sezione richiesta e riempila con i dati filtrati provenienti dall'API
    if (e.target.value) {
      if (e.target.value == 'search' && from.value != '') {
        container.innerHTML = '';

        // Filtro che prende 3 input (date)
        this.#filtered = this.#planets.filter(planet => {
          // li converte in millesecondi
          const dataFrom = new Date(`${from.value} 00:00`).getTime();
          const dataTo = new Date(`${to.value} 23:59`).getTime();
          const curData = new Date(planet.created).getTime();

          // e ritorna solo le date che si trovano tra l'input data di partenza e quello di fine
          return dataFrom <= curData && dataTo >= curData;
        });

        this._printToPage(this.#filtered, container);
      }

      // in caso di click sul botttone change
      // come prima viene svuotata la sezione
      if (e.target.value == 'change') {
        container.innerHTML = '';
        console.log('chanfe');
        this.#bool = !this.#bool;
        sort.innerText = this.#bool ? '↑' : '↓';

        // e viene stampato a schermo un array in ordine cronologico o ascendente in base ai click
        if (this.#filtered)
          this._printToPage(
            this._sorting(this.#filtered, this.#bool),
            container
          );
        else
          this._printToPage(
            this._sorting(this.#planets, this.#bool),
            container
          );
      }

      // Reset
      if (e.target.value == 'reset') {
        container.innerHTML = '';
        from.value = '';
        to.value = '';
        this._printToPage(this.#planets, container);
      }
    }
  }

  _sorting(what, bool) {
    return what.sort((a, b) => {
      const val1 = new Date(a.created).getTime();
      const val2 = new Date(b.created).getTime();

      return bool ? val1 + val2 : val1 - val2;
    });
  }
}

const app = new App();
