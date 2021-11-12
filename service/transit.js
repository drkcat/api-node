import request from 'request';
import { capitalize, capitalizeEachWord, isInt } from '../utils.js'

const busApiURL = 'https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/transporte-urbano/poste-autobus/tuzsa-';
const busWebURL = 'https://zaragoza.avanzagrupo.com/wp-admin/admin-ajax.php?action=tiempos_de_llegada&selectPoste=';

const transit = {
  busStation: (req, res) => {
    const parseWeb = req.query.source && req.query.source === "web"
    const url = parseWeb ? busWebURL + req.params.stationNumber : `${busApiURL + req.params.stationNumber}.json?srsname=wgs84`
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          const resp = {
            id: req.params.stationNumber,
            street: null,
            lines: [],
            times: [],
            coordinates: [],
            source: null
          };
          if (!parseWeb) {
            const json = JSON.parse(body);
            resp.source = 'official-api'
            resp.sourceUrl = url
            resp.lastUpdated = json.lastUpdated
            resp.street = capitalizeEachWord(json.title.split(')')[1].slice(1).split('Lí')[0].trim())
            resp.lines = json.title.split(resp.street)[1].trim().replace('Líneas: ', '').split(', ')
            resp.coordinates = json.geometry.coordinates
            const times = []
            json.destinos.map((destination) => {
              ['primero', 'segundo'].map(element => {
                const transport = {
                  line: destination.linea,
                  destination: capitalizeEachWord(destination.destino.replace(/(^,)|(,$)/g, '').replace(/(^\.)|(\.$)/g, ''), true),
                }
                if (destination[element].includes('minutos')) {
                  times.push({
                    ...transport,
                    time: `${destination[element].replace(' minutos', '').replace(/(^\.)|(\.$)/g, '')} min.`
                  })
                }
                else if (destination[element]?.includes('Sin estimacin')) {
                  times.push({
                    ...transport,
                    time: capitalize(destination[element].replace(/(^\.)|(\.$)/g, '').replace('cin', 'ción'))
                  })
                } else {
                  times.push({
                    ...transport,
                    time: capitalize(destination[element])
                  })
                }
              })
            })
            resp.times = [...times]
          } else {
            resp.source = 'web'
            // TODO
          }
          resp.times.sort((a, b) => {
            if (a.time.includes('min') && b.time.includes('min')) {
              const sort = parseInt(a.time.split()[0]) < parseInt(b.time.split()[0]) ? -1 : 1
              return sort
            } else {
              if (a.time.includes('parada')) {
                return -1
              }
              if (b.time.includes('Sin')) {
                return 1
              }
            }
            return -1
          })
          res.send(resp);
        } catch (exception) {
          res.send({
            errors: {
              status: 404,
              message: exception.message
            },
          });
        }
      } else {
        res.send({
          errors: {
            status: 404,
          },
        });
      }
    },
    );
  },
};

export default transit;
