
function loadContent() {
  if (PATH == '') {
    return ViewHome.byUrl();
  }

  if (PATH == 'people') {
    return viewPeople();
  }

  if (PATH.match('person/')) {
    return ViewPerson.byUrl();
  }

  if (PATH == 'events') {
    return viewEvents();
  }

  if (PATH.length > 5 && PATH.slice(0, 6) == 'source') {
    return routeSources();
  }

  if (PATH.match('search')) {
    return SearchResults.byUrl();
  }

  if (PATH.match('place')) {
    return ViewPlace.byUrl() || pageNotFound();
  }

  if (PATH == 'test' && ENV == 'dev') {
    return viewTests();
  }

  if (PATH.match('image/')) {
    return viewImage();
  }

  if (PATH.match('topic/')) {
    return viewTopic();
  }

  if (PATH.match('year/')) {
    return viewYear();
  }

  if (PATH.match('about/')) {
    return viewAbout();
  }

  if (PATH.match('artifact') || PATH.match('landmark')) {
    return ViewStoryIndex.byUrl() || ViewStoryArtifactOrLandmark.byUrl()
      || pageNotFound();
  }

  if (PATH.match('cemeter') || PATH.match('newspaper')) {
    return ViewStoryIndex.byUrl() || ViewCemeteryOrNewspaper.byUrl()
      || pageNotFound();
  }

  if (PATH.match('book')) {
    return ViewStoryIndex.byUrl() || ViewStoryBook.byUrl()
      || pageNotFound();
  }

  return pageNotFound();
}

function viewPeople() {
  setPageTitle('People');
  rend('<h1>All People</h1>');
  rend($makePeopleList(DATABASE.people, 'photo'));
}

function viewTests() {
  setPageTitle('Tests');
  rend('<h1>Tests</h1>');
}

function pageNotFound() {
  setPageTitle('Page Not Found');
  rend('<h1>Page Not Found</h1>');
}
