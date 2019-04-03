
function viewPlaces() {
  const places = getPlacesList();

  if (places.length == 0) {
    return viewPlacesIndex();
  }

  showPageTitleAndHeader(places);

  if (places.length == 1) {
    return viewPlacesByCountry(places[0].true);
  }

  if (places.length == 2) {
    return;
  }

  if (places.length == 3) {
    return;
  }

  if (places.length == 4) {
    return;
  }

  rend('<h1>Place not found</h1>');
}

function showPageTitleAndHeader(places) {
  let mostSpecificPlace = places[places.length - 1].text;

  setPageTitle(mostSpecificPlace);

  let headerTrail = '<p class="header-trail">' + localLink('places', 'Places');
  let tempPath = 'places';

  for (let i = 0; i < places.length - 1; i++) {
    tempPath += '/' + places[i].path;
    headerTrail += ' &#8594; ' + localLink(tempPath, places[i].text);
  }

  rend(headerTrail + '</p>');

  rend('<h1>' + mostSpecificPlace + '</h1>');
}

function getPlacesList() {
  if (PATH == 'places') {
    return [];
  }

  let places = PATH.replace('places/', '').split('/').map(place => {
    return {
      path: place,
      true: place.replace(/\+/g, ' '),
      text: place.replace(/\+/g, ' '),
    };
  });

  if (places.length == 0) {
    return [];
  }

  if (places[0].text == 'United States' || places[0].text == 'USA') {
    places[0].path = 'USA';
    places[0].text = 'United States';
    places[0].true = 'United States';

    if (places.length > 1) {
      if (USA_STATES[places[1].text]) {
        places[1].text = USA_STATES[places[1].text];
      }
    }
  }

  return places;
}

function viewPlacesIndex() {
  setPageTitle('Places');
  rend('<h1>Places</h1>');

  const countryList = [];
  const listByCountry = {};
  listByCountry['none'] = [];

  [...DATABASE.events, ...DATABASE.sources].forEach(item => {
    let country = item.location.country;

    if (country) {
      if (!listByCountry[country]) {
        countryList.push(country);
        listByCountry[country] = [];
      }
    } else {
      country = 'none';
    }

    listByCountry[country].push(item);
  });

  countryList.sort((a, b) => {
    let diff = listByCountry[b].length - listByCountry[a].length;
    return diff == 0 ? (a < b ? -1 : 1) : diff;
  });

  [...countryList, 'none'].forEach(country => {
    let [linkPath, linkText] = [country, country];

    if (country == 'United States') {
      linkPath = 'USA';
    } else if (country == 'none') {
      linkText = 'Country not specified';
    }

    linkPath = linkPath.replace(/ /g, '+');

    rend(
      '<p>' +
        localLink('places/' + linkPath, linkText) +
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

  region1List.sort((a, b) => {
    return a < b ? -1 : 1;
  });

  [...region1List, 'Not Specified'].forEach(region => {
    let regionPath = region;
    let regionText = region;

    if (regionPath == 'Not Specified') {
      regionPath = 'State not specified';
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
