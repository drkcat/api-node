import transit from '../service/transit.js';

const controllers = {
  about: (req, res) => {
    const aboutInfo = {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    };
    res.json(aboutInfo);
  },
  getBusStation: (req, res) => {
    transit.busStation(req, res, (err, dist) => {
      if (err) res.send(err);
      res.json(dist);
    });
  }
};

export default controllers;
