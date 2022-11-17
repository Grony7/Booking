import {renderAdSuitable} from './rendering-ads.js';
import {activateAdFormField, addAddress} from './form-states.js';

const NUMBER_OF_SIMILAR_ADS = 10;

const STARTING_POSITION = {
  lat: 35.69042,
  lng: 139.75181,
};

const map = L.map('map-canvas')
  .on('load', () => {
    activateAdFormField();
  });
const markerGroup = L.layerGroup().addTo(map);
addAddress(STARTING_POSITION);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const icon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const mainMarker = L.marker(
  STARTING_POSITION,
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainMarker.on('moveend', (evt) => {
  const coordinates = evt.target.getLatLng();
  addAddress(coordinates);
});

const renderMap = () => {
  map.setView(STARTING_POSITION, 13);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  mainMarker.addTo(map);
};


const renderMapPoints = (points) => {
  points.forEach((point) => {
    const {lat, lng} = point.location;
    const marker = L.marker(
      {
        lat,
        lng,
      },
      {
        icon,
      },
    );
    marker
      .addTo(markerGroup)
      .bindPopup(renderAdSuitable(point));
  });
};

const setAdPoints = (points) => {
  markerGroup.clearLayers();
  renderMapPoints(points.slice(0, NUMBER_OF_SIMILAR_ADS));
};

const returnMapPoints = (coordinates) => mainMarker.setLatLng(coordinates);

const resetMap = () => {
  addAddress(STARTING_POSITION);
  returnMapPoints(STARTING_POSITION);
};

export {renderMap, setAdPoints, returnMapPoints, resetMap};

