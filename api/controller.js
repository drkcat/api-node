import zaragozaTransit from '../service/zaragoza-transit.js';

const controllers = {
  about: (req, res) => {
    const aboutInfo = {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    };
    res.json(aboutInfo);
  },
  getZaragozaBusStation: (req, res) => {
    zaragozaTransit.busStation(req, res, (err, dist) => {
      if (err) res.send(err);
      res.json(dist);
    });
  }
};

export default controllers;
