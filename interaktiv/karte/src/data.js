import {redraw} from './line';
import * as d3 from 'd3-jetpack/build/d3v4+jetpack';


var maps = {};

maps['parteienfoerderungen_gemeinden_2017'] = {
  title: 'Wie hoch die Parteienförderung Ihrer Gemeinde war',
  description: `Verbuchte Ausgaben pro Kopf für Transfers an private Organisationen ohne Erwerbszweck für gewählte Gemeindeorgane im Jahr 2017.<br />
  Farben: <span class="scalevalue">unterdurchschnittlich</span>, <span class="scalevalue">durchschnittlich</span>, <span class="scalevalue">überdurchschnittlich</span>`,
  data: 'parteienfoerderungen_gemeinden_2017.csv',
  source: 'Statistik Austria',
  scale: 'category-multi',
  search: true,
  colorschemes: [['#f1f1f1', '#62a87c', '#9B9B9B','#af3b6e']],
  categories: ['keine', 'unterdurchschnittlich', 'durchschnittlich', 'überdurchschnittlich'],
  value: (d) => (isNaN(d.sollprokopf) || d.sollprokopf == 0) ? ['keine'] : [(d.sollprokopf<1.3 ? 'unterdurchschnittlich' : (d.sollprokopf < 2.81 ? 'durchschnittlich' : 'überdurchschnittlich' ))],
  tooltip: function(d,p,pctfmt,numfmt) {
    if(d.sollprokopf==0) {
         return `In ${d.name} wurde keine Parteienförderung im Haushalt verbucht.`
    }
    console.log(d.soll);
    return `In ${d.name} gingen ${numfmt(d.soll)} Euro aus der Gemeindekasse an Parteien. <br />
            Das sind ${pctfmt(d.sollprokopf)} Euro pro Gemeindebürger.
            Das ist im bundesweiten Vergleich ${(d.sollprokopf<1.3 ? 'unterdurchschnittlich' : (d.sollprokopf < 2.81 ? 'durchschnittlich' : 'überdurchschnittlich' ))} viel.`;
  },
  bundesland_message: `<a href="https://addendum.org" target="_blank"><img src="addendum-logo.png" /></a>`
};

maps['verwaltungsausgabenprokopf'] = {
  title: 'Gestiegene Verwaltungsausgaben in fast allen fusionierten Gemeinden',
  description: `Vergleich des Drei-Jahres-Durchschnitts für Verwaltungsausgaben pro Kopf vor und nach der Reform.`,
  data: 'verwaltungsausgabenprokopf.csv',
  topojson: 'gemeindegrenzen_2018_splitter_topo.json',
  source: '',
  scale: 'linear_or_null',
  search: true,
  feature_name_override: 'name',
  colorschemes: ['#516d87', '#f1f1f1','#a54657'],
  colorscheme_null: 'lightyellow',
  categories: [-25,0,25],
  value: (d) => [d.gsrbetr=='Ja', d.avg_diff],
  tooltip: function(d,p,pctfmt,numfmt,changepctfmt,changefmt) {
      return `${
          d.gsrbetr=='Ja'?`
            In den drei Jahren nach der Reform lagen die durchschnittlichen Verwaltungsausgaben in ${d.name} pro Kopf ${changepctfmt(Math.abs(d.avg_diff))} % ${d.avg_diff<0?'unter':'über'} den Ausgaben davor.
            `:`
            ${d.name} war nicht von der Gemeindestrukturreform 2015 betroffen.`
      }

      <div class="chart" style="height: 150px"></div>`;
  },
  bundesland_message: ``,
  post_draw_tooltip: function(elem, source_feature, fmt) {
      setTimeout(() => {
          var data = source_feature.data;
          var jahre = Object.keys(data).filter(x => !isNaN(+x)).sort().map(x => +x);
          var line = jahre.map((j) => {return {'xvalue': j, 'yvalue': data[j], 'title': '',
            active: true,
            label: ``,
            text: `${j}: ${fmt(data[j])} €`,
            radius: 1 }});

          redraw([
            line
          ],
            d3.select(elem).selectAppend('div.chart'), {
            xfmt: (x) => x,
            ylabel: '',
            yline: 2015
        }, true);
      }, 100)
  }
};


maps['wahlbeteiligung'] = {
  title: 'Wie viel Wert Ihre Stimme bei Landtagswahlen verloren hat',
  description: `Vergleich des potentiellen Einflusses einer Wählerstimme auf die Zusammensetzung des Gemeinderates vor und nach der Gemeindestrukturreform.`,
  data: 'wahlen_bordermanned_wb_long.csv',
  topojson: 'gemeindegrenzen_2018_splitter_topo.json',
  source: '',
  scale: 'linear_or_null',
  search: true,
  feature_name_override: 'name',
  colorschemes: ['#516d87', '#f1f1f1','#a54657'].reverse(),
  colorscheme_null: 'lightyellow',
  categories: [-50,0,5],
  value: (d) => [true, d.diff_pct],
  tooltip: function(d,p,pctfmt,numfmt,changepctfmt,changefmt) {
      return `<h4>${d.name}</h4>Änderung des Stimmeineinflusses: ${changepctfmt(d.diff_pct)}%<br />${d.gsrbetr=='Ja'?' ':'keine '}Fusionsgemeinde<br />`;
      //`<div class="chart" style="height: 150px"></div>`;
  },
  bundesland_message: ``,
  /*
  post_draw_tooltip: function(elem, source_feature, fmt) {
      setTimeout(() => {
          console.log(elem.innerHTML)
          var data = source_feature.data;
          var jahre = Object.keys(data).filter(x => !isNaN(+x)).sort().map(x => +x);
          var line = jahre.map((j) => {return {'xvalue': j, 'yvalue': data[j], 'title': '',
            active: true,
            label: ``,
            text: `${j}: ${fmt(data[j])} €`,
            radius: 1 }});

            console.log(line);

          redraw([
            line
          ],
            d3.select(elem).selectAppend('div.chart'), {
            xfmt: (x) => x,
            ylabel: '',
            yline: 2015
        }, true);
    }, 100)
}*/
};

Object.keys(maps).map((x) => {maps[x].map=x});

export { maps };
