
function viewArtifactOrLandmark() {
  if (PATH == 'artifacts') {
    return viewArtifactsIndex();
  }
  if (PATH == 'landmarks') {
    return viewLandmarksIndex();
  }

  const [storyType, storyId, extraText] = PATH.split('/');
  const story = DATABASE.storyRef[storyId];

  if (!story || extraText) {
    return pageNotFound();
  }

  if (storyType == 'artifact' || storyType == 'landmark') {
    return viewOneArtifactOrLandmark(storyType, story);
  }

  return pageNotFound();
}

function viewArtifactsIndex() {
  setPageTitle('Artifacts');
  h1('Artifacts and family heirlooms');

  const artifacts = DATABASE.stories.filter(story => {
    return story.type == 'artifact' || story.tags.artifact;
  });

  artifacts.forEach((story, i) => {
    artifactBlock(story, {
      largeHeader: true,
    });
  });
}

function viewLandmarksIndex() {
  setPageTitle('Landmarks');
  h1('Landmarks and buildings');

  const stories = DATABASE.stories.filter(story => {
    return story.type == 'landmark';
  });

  stories.forEach(story => {
    h2(story.title);

    if (story.summary) {
      rend('<p style="margin-left: 10px">' + story.summary + '</p>');
    }

    rend($makePeopleList(story.people, 'photo'));
  });
}

function viewOneArtifactOrLandmark(storyType, story) {
  headerTrail([storyType]);
  h1(story.title);

  [story.date.format, story.location.format, story.summary].forEach(val => {
    if (val) {
      rend('<p style="margin-top: 20px;">' + val + '</p>');
    }
  });

  if (story.people.length) {
    h2('People');
    rend($makePeopleList(story.people, 'photo'));
  }
}

function artifactBlock(story, specs) {
  const $box = $('<div>');

  if (specs.largeHeader) {
    $box.append('<h2>' + story.title + '</h2>');
  } else {
    $box.css('margin-left', '15px');
    $box.append('<p>' + linkToStory(story) + '</p>');
    if (!specs.firstItem) {
      $box.css('margin-top', '20px');
    }
  }

  if (story.summary) {
    if (specs.largeHeader) {
      $box.append('<p style="margin-left: 10px">' + story.summary + '</p>');
    } else {
      $box.append('<p style="margin-top: 5px">' + story.summary + '</p>');
    }
  }

  $box.append($makePeopleList(specs.people || story.people, 'photo'));

  if (story.type == 'book') {
    $box.append(
      '<p style="margin: 10px">' +
        localLink('book/' + story._id, 'read book ' + RIGHT_ARROW) +
      '</p>'
    );
  }

  rend($box);
}