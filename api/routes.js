import controller from './controller.js';

const routes = (app) => {
  app
    .route('/about').get(controller.about);
  app
    .route('/zgz/bus/stations/:stationNumber')
    .get(controller.getZaragozaBusStation);
};

export default routes;
