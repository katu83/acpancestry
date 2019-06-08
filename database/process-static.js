
function processDatabase() {
  DATABASE.personRef = {};
  DATABASE.sourceRef = {};

  DATABASE.people.forEach(person => {
    DATABASE.personRef[person._id] = person;
    DATABASE.personRef[person.customId] = person;
  });

  DATABASE.sources.forEach(source => {
    DATABASE.sourceRef[source._id] = source;
  });

  DATABASE.people = DATABASE.people.map(getProcessedPerson);
  DATABASE.people.forEach(addPersonChildSiblings);

  DATABASE.events = DATABASE.events.map(getProcessedEvent);

  DATABASE.sources = DATABASE.sources.map(getProcessedSource);

  DATABASE.citations = DATABASE.citations.map(getProcessedCitation);

  findSourceGroups();
}

function getProcessedPerson(person) {
  ['parents', 'spouses', 'children'].forEach(relationship => {
    person[relationship] = person[relationship].map(otherPerson => {
      return DATABASE.personRef[otherPerson];
    });

    person[relationship] = removeNullValues(person[relationship]);
  });

  person.siblings = [];
  person.links = person.links || [];
  person.citations = [];
  person.profileImage = person.profileImage || 'public/images/generic-profile-picture.png';

  return person;
}

function addPersonChildSiblings(person) {
  person.children.forEach((sibling1, i) => {
    const otherSiblings = person.children.slice(i + 1);
    otherSiblings.forEach(sibling2 => {
      if (sibling1.siblings.indexOf(sibling2) === -1) {
        sibling1.siblings.push(sibling2);
        sibling2.siblings.push(sibling1);
      }
    });
  });
}

function getProcessedEvent(event) {
  event.people = event.people.map(person => {
    person = DATABASE.personRef[person];

    if ((event.title === 'birth' || event.title === 'death')
        && person[event.title] === undefined) {
      person[event.title] = event;
    } else if (event.title === 'birth and death') {
      person.birth = person.birth || event;
      person.death = person.death || event;
    }

    return person;
  });

  event.date = event.date || {};
  event.date.format = formatDate(event.date);
  event.location = event.location || {};
  event.location.format = formatLocation(event.location);

  return event;
}

function getProcessedSource(source) {
  source.people = source.people.map(person => {
    return DATABASE.personRef[person];
  });

  source.people = removeNullValues(source.people);

  source.date = source.date || {};
  source.date.format = formatDate(source.date);
  source.location = source.location || {};
  source.location.format = formatLocation(source.location);
  source.citations = [];

  return source;
}

function getProcessedCitation(citation) {
  citation.person = DATABASE.personRef[citation.person];
  citation.source = DATABASE.sourceRef[citation.source];
  citation.person.citations.push(citation);
  citation.source.citations.push(citation);
  return citation;
}

function removeNullValues(array) {
  return array.filter(value => value != null);
}

function findSourceGroups() {
  // For each source group, there might be a designated "SOURCE GROUP" source that holds
  // general information about the group.

  DATABASE.sources.forEach(source => {
    source.isGroupMain = source.title.toLowerCase() == 'source group';
  });

  DATABASE.sourceGroups = DATABASE.sources.filter(source => source.isGroupMain);
  DATABASE.sources = DATABASE.sources.filter(source => !source.isGroupMain);

  DATABASE.sourceGroups.forEach(sourceGroupMain => {
    sourceGroupMain.sourceList = DATABASE.sources.filter(source => {
      if (source.type == sourceGroupMain.type && source.title == sourceGroupMain.title) {
        source.sourceGroup = sourceGroupMain;
        return true;
      }
      return false;
    });
  });
}
