
function viewPlaces() {
  const places = getPlacesList();

  if (places.length == 0) {
    return viewPlacesIndex();
  }

  rend('<p>' + localLink('places', 'Places') + '</p>');

  places.forEach(place => {
    rend('<p>' + place  + '</p>');
  });

  if (places.length == 1) {
    setPageTitle(places[0]);
    rend('<h1>' + places[0] + '</h1>');
    viewPlacesByCountry(places[0]);
  }
}

function getPlacesList() {
  if (PATH == 'places') {
    return [];
  }

  return PATH.replace('places/', '').replace(/\+/g, ' ').split('/');
}

function viewPlacesIndex() {
  setPageTitle('Places');
  rend('<h1>Places</h1>');

  const countryList = [];
  const listByCountry = {};
  listByCountry['Not Specified'] = [];

  [...DATABASE.events, ...DATABASE.sources].forEach(item => {
    let country = item.location.country;

    if (country) {
      if (!listByCountry[country]) {
        countryList.push(country);
        listByCountry[country] = [];
      }
    } else {
      country = 'Not Specified';
    }

    listByCountry[country].push(item);
  });

  countryList.forEach(country => {
    let path = country.replace(/ /g, '+');
    rend(
      '<p>' +
        localLink('places/' + path, country) +
        ' (' + listByCountry[country].length + ')' +
      '</p>'
    );
  });
}

function viewPlacesByCountry(country) {
  const region1List = [];
  const listByRegion = {};
  listByRegion['Not Specified'] = [];

  [...DATABASE.events, ...DATABASE.sources].forEach(item => {
    if (item.location.country != country) {
      return;
    }

    let region = item.location.region1;

    if (region) {
      if (!listByRegion[region]) {
        region1List.push(region);
        listByRegion[region] = [];
      }
    } else {
      region = 'Not Specified';
    }

    listByRegion[region].push(item);
  });

  [...region1List, 'Not Specified'].forEach(region => {
    let regionPath = region;
    let regionText = region;

    if (regionPath == 'Not Specified') {
      regionPath = 'Other';
    } if (country == 'United States') {
      regionText = USA_STATES[regionPath || ''] || regionPath;
    }

    let path = (country + '/' + regionPath).replace(/ /g, '+');

    rend(
      '<p>' +
        localLink('places/' + path, regionText) +
        ' (' + listByRegion[region].length + ')' +
      '</p>'
    );
  });
}
