var serials = [];
var serialList = [];

window.onload = function() {
  load();
};

function load() {
  chrome.storage.local.get(['serials', 'serialList'], function(result) { serials = result.serials;
                                                                         serialList = result.serialList;
                                                                         
  if (serials === undefined) generateSerials();
   
  if (serialList === undefined) {
    serialList = [];
    generateSerialList();
    document.getElementById('menu').innerHTML = 'Keep open to continue initialization.';
  }
  else if (serials !== undefined && serialList !== undefined) {
    console.log('load ... OK');
    generateMainMenu();
    
  }
  });
}

function generateSerialList() {
  for(var i = 0; i < serials.length; i++) {
    findLastEpisode(serials[i]);
  }
}

function findLastEpisode(name) {
  var season = 1, episode = 1, tmp = 0;
  loadNextEpisode(name, season, episode, tmp);
}

function loadNextEpisode(name, season, episode, tmp) {
  var xmlhttp;
  
  if (window.XMLHttpRequest)
  {
    xmlhttp = new XMLHttpRequest();
  } 
  else
  {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      //doc = (new DOMParser).parseFromString(xmlhttp.responseText,"text/html");
      tmp = episode;
      episode++;
      loadNextEpisode(name, season, episode, tmp);
    } else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
      if (episode == 1) {
        season--;
        episode = tmp;
        
        var curr = { name : name,
                     fullName : name,
                     watched : { episode : episode,
                                 season : season
                     },
                     seen : {
                       seen : false,
                       episode : episode,
                       season : season
                     }
                   };
                   serialList.push(curr);
        console.log(curr);
        if (serials.length === serialList.length) {save();document.getElementById('menu').innerHTML = 'Initialization completed.';}
      } else {
        season++;
        episode = 1;
        loadNextEpisode(name, season, episode, tmp);
      }
    }
  };
  
  xmlhttp.open('GET', createLink(name, season, episode), true);
  xmlhttp.send();
}

// show new episodes since watched

function checkForNew() {
  document.getElementById('tb').innerHTML = '';
  for(var i = 0; i < serialList.length; i++) {
    var season = serialList[i].watched.season;
    var episode = serialList[i].watched.episode + 1;
    loadNextEpisode2(serialList[i].name, season, episode);
  }
}

function loadNextEpisode2(name, season, episode) {

  var xmlhttp;
  
  if (window.XMLHttpRequest)
  {
    xmlhttp = new XMLHttpRequest();
  } 
  else
  {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      var tr = document.createElement('tr');
      var bt = document.createElement('button');
      var td;
      
      td = document.createElement('td');
      td.innerHTML = '<a href="' + createLink(name, season, episode) + '" target="_blank">' + findSerialInArray(name).fullName + '</a>';
      tr.appendChild(td);
      
      td = document.createElement('td');
      td.innerHTML = 'Ep  ' + episode;
      tr.appendChild(td);
      
      td = document.createElement('td');
      td.innerHTML = 'Se  ' + season;
      tr.appendChild(td);
      
      td = document.createElement('td');
      bt.innerHTML = 'Watched';
      bt.addEventListener('click', function() { var s = findSerialInArray(name);
                                                s.watched.episode = episode;
                                                s.watched.season = season;
                                                bt.disabled = true;
                                              }
                          );
      td.appendChild(bt);
      tr.appendChild(td);
      
      document.getElementById('tb').appendChild(tr);
      
      loadNextEpisode2(name, season, episode + 1);
    } else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
      if (episode === 1) {
      } else {
        season++;
        episode = 1;
        loadNextEpisode2(name, season, episode);
      }
    }
  };
  
  xmlhttp.open('GET', createLink(name, season, episode), true);
  xmlhttp.send();
}

// CRUD

function deleteSerial(name) {
  var index = serials.indexOf(name);
  if (index >= 0) {
    serials.splice( index, 1 );
  }
    
  index = serialList.indexOf(findSerialInArray(name));
  if (index >= 0) {
    serialList.splice( index, 1 );
  }
}

function updateSerial(serial) {
  var ser = findSerialInArray(serial.name);
  ser.fullName = serial.fullName;
  ser.watched.episode = serial.watched.episode;
  ser.watched.season = serial.watched.season;
  ser.seen.seen = serial.seen.seen;
  ser.seen.episode = serial.seen.episode;
  ser.seen.season = serial.seen.season;
}


function createSerialM(serial) {
  serials.push(serial.name);
  serialList.push({ name : serial.name,
                    fullName : serial.fullName,
                    watched : { episode : serial.watched.episode,
                             season : serial.watched.season },
                    seen : { seen : serial.seen.seen,
                             episode : serial.seen.episode,
                             season : serial.seen.season }
  });
}

// TODO add function to set watched to last episode
function createSerialA(serial) {
  serials.push(serial.name);
  serialList.push({ name : serial.name,
                    fullName : serial.fullName,
                    watched : { episode : serial.watched.episode,
                             season : serial.watched.season },
                    seen : { seen : serial.seen.seen,
                             episode : serial.seen.episode,
                             season : serial.seen.season }
  });
} 


function generateMainMenu() {
  var btn;
  var menu = document.getElementById('menu');
  
  btn = document.createElement('button');
  btn.innerHTML = 'Last watched';
  btn.addEventListener('click',generateTable);
  menu.appendChild(btn);
  
  btn = document.createElement('button');
  btn.innerHTML = 'Check new';
  btn.addEventListener('click',checkForNew);
  menu.appendChild(btn);
  
  
  //will be removed when ready
  btn = document.createElement('button');
  btn.innerHTML = 'Save';
  btn.addEventListener('click', save);
  menu.appendChild(btn);
}

// TODO add Events to buttons
function generateSerialMenu() {
  var btn;
  var menu = document.getElementById('submenu');
  
  btn = document.createElement('button');
  btn.innerHTML = 'Add';
  menu.appendChild(btn);
  
  btn = document.createElement('button');
  btn.innerHTML = 'Update';
  menu.appendChild(btn);
  
  btn = document.createElement('button');
  btn.innerHTML = 'Delete';
  menu.appendChild(btn);
  
  btn = document.createElement('button');
  btn.innerHTML = 'Back';
  menu.appendChild(btn);
  
  btn = document.createElement('button');
  btninnerHTML = 'Import';
  menu.appendChild(btn);
}

function generateTable() {
  var table = '<table>';
  
  for (var i = 0; i < serialList.length; i++) {
    table += '<tr><td>';
    table += serialList[i].fullName  + '</td><td> Ep ' + serialList[i].watched.episode + '</td><td> Se ' + serialList[i].watched.season;
    table += '</td></tr>';
  }
  
  table += '</table>';
  document.getElementById('tb').innerHTML = table;
}

function generateSerials() {
  serials = ['ncis', 'limitless', 'castle', 'agents-of-shield', 'madam-secretary', 'the-blacklist', 'elementary', 'forever', 'scorpion', 'ncis-los-angeles', 'ncis-new-orleans', 'hawaii-five-0', 'blindspot', 'agent-x'];
}

function findSerialInArray(name) {
  for (var i = 0; i < serialList.length; i++) {
    if(name === serialList[i].name) {
      return serialList[i];
    }
  }
}

function save() {
  chrome.storage.local.set( {'serials' : serials, 'serialList' : serialList }, function () { console.log('saved ' + Date()); });
}

function createLink(name, season, episode) {
  return 'http://putlocker.is/watch-' + name + '-tvshow-season-' + season + '-episode-' + episode + '-online-free-putlocker.html';
}