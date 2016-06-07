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

function save() {
	//noinspection JSUnresolvedVariable
	chrome.storage.local.set( {'serials' : serials, 'serialList' : serialList }, function () { console.log('saved ' + Date()); });
}

function generateSerialList() {
  for(var i = 0; i < serials.length; i++) {
	findLastEpisode(serials[i]);
  }
}

function findLastEpisode(name) {
  var season = 1, episode = 1, tmp = 0;
  initEpisode(name, season, episode, tmp);
}

function initEpisode(name, season, episode, tmp) {
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
	  tmp = episode;
	  episode++;
	  initEpisode(name, season, episode, tmp);
	} else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
	  if (episode == 1) {
		season--;
		episode = tmp;

		var curr = { name : name,
					 fullName : name,
					 episode : episode,
		  season : season
				   };
				   serialList.push(curr);
		console.log(curr);
		if (serials.length === serialList.length) {save();document.getElementById('menu').innerHTML = 'Initialization completed.';}
	  } else {
		season++;
		episode = 1;
		initEpisode(name, season, episode, tmp);
	  }
	}
  };
  
  xmlhttp.open('GET', createLink(name, season, episode), true);
  xmlhttp.send();
}

function checkForNew() {
  for(var i = 0; i < serialList.length; i++) {
	var season = serialList[i].season;
	var episode = serialList[i].episode + 1;
	loadNextEpisode(serialList[i].name, season, episode);
  }
}

function loadNextEpisode(name, season, episode) {

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
												s.episode = episode;
												s.season = season;
												bt.disabled = true;
											  }
						  );
	  td.appendChild(bt);
	  tr.appendChild(td);

	  document.getElementById('tb').appendChild(tr);

	  loadNextEpisode(name, season, episode + 1);
	} else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
	  if (episode === 1) {
	  } else {
		season++;
		episode = 1;
		loadNextEpisode(name, season, episode);
	  }
	}
  };
  
  xmlhttp.open('GET', createLink(name, season, episode), true);
  xmlhttp.send();
}

// CRUD
function createSerial(serial) {
  serials.push(serial.name);
  serialList.push(serial);
}

function updateSerial(linkName, serial) {
  var ser = findSerialInArray(serial.name);
  ser.fullName = serial.fullName;
  ser.episode = serial.episode;
  ser.season = serial.season;
}

function deleteSerial(linkName) {
  var index = serials.indexOf(name);
  if (index >= 0) {
	serials.splice( index, 1 );
  }

  index = serialList.indexOf(findSerialInArray(name));
  if (index >= 0) {
	serialList.splice( index, 1 );
  }
}

/*
function generateMainMenu() {
  var btn;
  var menu = document.getElementById('menu');
  
  btn = document.createElement('button');
  btn.innerHTML = 'Serials';
  btn.className = 'menubutton';
  btn.addEventListener('click',function() { generateSerialMenu(); generateSerialsTable();});
  menu.appendChild(btn);
  
  btn = document.createElement('button');
  btn.innerHTML = 'Last';
  btn.className = 'menubutton';
  btn.addEventListener('click',generateLastTable);
  menu.appendChild(btn);

  btn = document.createElement('button');
  btn.innerHTML = 'Latest';
  btn.className = 'menubutton';
  btn.addEventListener('click',checkForNew);
  menu.appendChild(btn);
  
  //will be removed when ready when not needed
  btn = document.createElement('button');
  btn.innerHTML = 'S';
  btn.className = 'menubutton';
  btn.addEventListener('click', save);
  menu.appendChild(btn);
}*/

function generateMainMenu() {
    var btn;
    var menu = document.getElementById('menu');

    btn = document.createElement('div');
    btn.innerHTML = 'Serials';
    btn.className = 'menubutton';
    btn.addEventListener('click',function() { clearPage();generateSerialMenu(); generateSerialsTable();});
    menu.appendChild(btn);

    btn = document.createElement('div');
    btn.innerHTML = 'Last';
    btn.className = 'menubutton';
    btn.addEventListener('click',function() {clearPage(); generateLastTable();});
    menu.appendChild(btn);

    btn = document.createElement('div');
    btn.innerHTML = 'Latest';
    btn.className = 'menubutton';
    btn.addEventListener('click',function() {clearPage(); checkForNew();});
    menu.appendChild(btn);
}

// TODO add Events to buttons
function generateSerialMenu() {
  clearPage();
  var btn;
  var menu = document.getElementById('submenu');
  
  btn = document.createElement('div');
  btn.innerHTML = 'New';
  btn.className = 'submenubutton'
  btn.addEventListener('click', function () {

	});
  menu.appendChild(btn);

  /*
  btn = document.createElement('button');
  btn.innerHTML = 'Back';
  btn.className = 'submenubutton';
  menu.appendChild(btn);
  */
  
  btn = document.createElement('div');
  btn.innerHTML = 'Import';
  btn.className = 'submenubutton';
  menu.appendChild(btn);
}

function generateSerialsTable() {
  var tb = document.getElementById('tb');
  var tr;
  var td;
  
  tb.innerHTML = '';
  
  for (var i = 0; i < serialList.length; i++) {
	tr = document.createElement('tr');

	td = document.createElement('td');
	td.innerHTML =  serialList[i].fullName;
	td.addEventListener('click', function () {clearTable(); document.getElementById('serial').appendChild(createForm());});
	tr.appendChild(td);
	tb.appendChild(tr);
  }
}

function generateLastTable() {
  var table = '<table>';
  
  for (var i = 0; i < serialList.length; i++) {
	table += '<tr><td>';
	table += serialList[i].fullName  + '</td><td> Ep ' + serialList[i].episode + '</td><td> Se ' + serialList[i].season;
	table += '</td></tr>';
  }
  
  table += '</table>';
  document.getElementById('tb').innerHTML = table;
}

function generateSerials() {
  serials = ['ncis'];
}

function findSerialInArray(linkName) {
  for (var i = 0; i < serialList.length; i++) {
	if(linkName === serialList[i].linkName) {
	  return serialList[i];
	}
  }
}

function createLink(linkName, season, episode) {
  return 'http://putlocker.is/watch-' + linkName + '-tvshow-season-' + season + '-episode-' + episode + '-online-free-putlocker.html';
}

function fullName(serial) {
  var xmlhttp;
  var patt = "Watch (.+) Season";
  
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
	  var doc = (new DOMParser()).parseFromString(xmlhttp.responseText,"text/html");
	  var fullName = doc.getElementById('title').match(patt)[1];
	  serial.fullName = fullName;
	}
  };
  
  xmlhttp.open('GET', createLink(serial.linkName, 1, 1), true);
  xmlhttp.send();
}

function linkName(serial) {
  serial.linkName = serial.fullName.replace(/\W+/g, '-').toLowerCase();
}

function createForm() {
	var form = document.createElement('div');
	var span, input, checkbox, btn;

	form.style.border = 'solid 1px';
	form.style.padding = '6px';
	form.paddingLeft = '20px';

	span = document.createElement('span');
	span.innerHTML = 'Full name: ';
	input = document.createElement('input');
	input.type = 'text';
	input.name = 'fullname';
	input.style.margin = '4px';
	input.style.marginLeft = '7px';
	checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.name = 'checkFull';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(checkbox);
	form.appendChild(document.createElement('br'));

	span = document.createElement('span');
	span.innerHTML = 'Link name: ';

	input = document.createElement('input');
	input.type = 'text';
	input.name = 'linkname';
	input.style.margin = '4px';
	checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.name = 'checkLink';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(checkbox);
	form.appendChild(document.createElement('br'));

	span = document.createElement('span');
	span.innerHTML = 'Episode: ';
	input = document.createElement('input');
	input.type = 'text';
	input.name = 'episode';
	input.style.width = '20px';
	input.style.margin = '4px';
	input.style.marginLeft = '17px';
	input.style.marginRight = '17px';
	form.appendChild(span);
	form.appendChild(input);

	span = document.createElement('span');
	span.innerHTML = 'Season: ';
	input = document.createElement('input');
	input.type = 'text';
	input.name = 'season';
	input.style.width = '20px';
	input.style.margin = '4px';
	input.style.marginLeft = '17px';
	checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.name = 'latest';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(checkbox);
	form.appendChild(document.createElement('br'));

	btn = document.createElement('button');
	btn.id = 'create';
	btn.innerHTML = 'Create';
	btn.style.margin = '6px 4px 0px 0px';
	btn.addEventListener('click', function () {

	});
	btn.setAttribute('disabled', 'true');
	form.appendChild(btn);

	btn = document.createElement('button');
	btn.id = 'back';
	btn.innerHTML = 'Back';
	btn.style.margin = '6px 0px 0px 5px';
	btn.addEventListener('click', function () {

	});
	form.appendChild(btn);
	return form;
}

//TODO
function fillForm(form, serial) {

}

function lockForm(form) {
	var inputs = form.getElementsByTagName('input');
}

function unlockForm(form) {

}

//TODO
function parseForm(form) {
	var fullName, linkName, episode, season;

	if (form.getElementsByName('fullName').value == '') {
		alert('Error in fullName');
	}
}

function clearTable() {
	document.getElementById('tb').innerHTML = '';
}

function clearSubmenu() {
	document.getElementById('submenu').innerHTML = '';
}

function clearSerial() {
	document.getElementById('serial').innerHTML = '';
}

function clearPage() {
	clearSubmenu();
	clearTable();
	clearSerial();
}