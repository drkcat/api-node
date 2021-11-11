import request from 'request';
import { capitalizeEachWord } from '../utils.js'

const busApiURL = 'https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/transporte-urbano/poste-autobus/tuzsa-';
// const busWebURL = 'http://www.urbanosdezaragoza.es/frm_esquemaparadatime.php?poste=';

const zaragoza = {
  busStation: (req, res) => {
    request(
      `${busApiURL}${req.params.stationNumber}.json?srsname=wgs84`,
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            const json = JSON.parse(body);
            const resp = {
              id: json.id,
              number: req.params.stationNumber,
              street: null,
              lines: null,
              transports: [],
              coordinates: [],
              source: 'official-api',
              sourceUrl: json.link,
              lastUpdated: json.lastUpdated,
            };
            resp.street = capitalizeEachWord(json.title.split(')')[1].slice(1).split('Lí')[0].trim())
            resp.lines = capitalizeEachWord(json.title.split(resp.street)[1].trim().replace('Líneas: ', ''))
            resp.coordinates = json.geometry.coordinates
            const transports = []
            json.destinos.map((destination) => {
              ['primero', 'segundo'].map(element => {
                const transport = {
                  line: destination.linea,
                  destination: capitalizeEachWord(destination.destino.replace(/(^,)|(,$)/g, '').replace(/(^\.)|(\.$)/g, ''), true),
                }
                if (destination[element].includes('minutos')) {
                  transports.push({
                    ...transport,
                    time: `${destination[element].replace(' minutos', '').replace(/(^\.)|(\.$)/g, '')} min.`
                  })
                }
                else if (destination[element]?.includes('Sin estimacin')) {
                  transports.push({
                    ...transport,
                    time: capitalizeEachWord(destination[element].replace(/(^\.)|(\.$)/g, '').replace('cin', 'ción'), true)
                  })
                } else {
                  transports.push({
                    ...transport,
                    time: capitalizeEachWord(destination[element])
                  })
                }
              })
            })
            resp.transports = transports.sort((a, b) => {
              if (a.time)
                if (a.time < b.time) {
                  return true
                }
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

export default zaragoza;
