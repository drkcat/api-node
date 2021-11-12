import controller from './controller.js';

const routes = (app) => {
  app
    .route('/about').get(controller.about);
  app
    .route('/bus/stations/:stationNumber')
    .get(controller.getBusStation);
};

export default routes;
