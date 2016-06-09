var serialList = [];

window.onload = function() {
    //noinspection JSUnresolvedVariable
    chrome.storage.local.get(['serialList'], function(result) {
        serialList = result.serialList;

        if (serialList === undefined) {
            serialList = [];
            console.log('No save or first run at ' + new Date());
        }
        else {
            console.log('Load completed at ' + new Date());
            showMainMenu();
        }
    });
};

function save() {
	//noinspection JSUnresolvedVariable
	chrome.storage.local.set( {'serialList' : serialList }, function () { console.log('saved ' + new Date()); });
}

/*
function findLastEpisode(name) {
  var season = 1, episode = 1, tmp = 0;
  initEpisode(name, season, episode, tmp);
}

function initEpisode(name, season, episode, tmp, serials) {
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
*/

function checkForNew() {
	showTable(generateNewSerialsTable());
    for(var i = 0; i < serialList.length; i++) {
	    var season = serialList[i].season;
	    var episode = serialList[i].episode + 1;
	    loadNextEpisode(serialList[i].linkName, season, episode);
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

// Generate menu

function generateMainMenu() {
    var menu = document.createElement('div');
	menu.id = 'menu';
	menu.className = 'menu';

    var btn = document.createElement('div');
    btn.innerHTML = 'Serials';
    btn.className = 'menubutton';
    btn.addEventListener('click',function() {
        clearPage();
        showSubmenu(generateSerialMenu());
        showTable(generateSerialsTable());
    });
    menu.appendChild(btn);

    btn = document.createElement('div');
    btn.innerHTML = 'Last';
    btn.className = 'menubutton';
    btn.addEventListener('click',function() {
        clearPage();
        showTable(generateLastTable());
    });
    menu.appendChild(btn);

    btn = document.createElement('div');
    btn.innerHTML = 'Latest';
    btn.className = 'menubutton';
    btn.addEventListener('click',function() {
        clearPage();
        checkForNew();});
    menu.appendChild(btn);

	return menu;
}

function generateSerialMenu() {
    var menu = document.createElement('div');
	menu.id = 'submenu';
	menu.className = 'submenu';
  
    var btn = document.createElement('div');
    btn.innerHTML = 'New';
    btn.className = 'submenubutton';
    btn.addEventListener('click', function () {
        clearMain();
	  document.getElementById('main').appendChild(createForm());
	});
    menu.appendChild(btn);

    btn = document.createElement('div');
    btn.innerHTML = 'Delete';
    btn.className = 'submenubutton';
    btn.addEventListener('click', function () {
        clearMain();
        showTable(generateDeleteSerialsTable());
    });
    menu.appendChild(btn);

	return menu;
}

function generateSettingsMenu() {
	var menu = document.createElement('div');
	menu.id = 'submenu';
	menu.className = 'submenu';
	
	var btn = document.createElement('div');
	btn.innerHTML = 'Import';
	btn.className = 'submenubutton';
    btn.addEventListener('cilck', function () {
        clearMain();
    });
	menu.appendChild(btn);

    var btn = document.createElement('div');
    btn.innerHTML = 'Export';
    btn.className = 'submenubutton';
    btn.addEventListener('click', function () {
        clearMain();
    });
    menu.appendChild(btn);
	
	return menu;
}

// Show menu

function showMainMenu() {
	document.getElementById('head').appendChild(generateMainMenu());
}

function showSubmenu(submenu) {
    clearSubmenu();
	document.getElementById('head').appendChild(submenu);
}

function showTable(table) {
    document.getElementById('main').appendChild(table);
}

//TODO
function showForm() {
    
}

//TODO
function showExport() {
    
}

//TODO
function showImport() {
    
}

// Generate table

function generateSerialsTable() {
	var tb, tr, td;
	
	tb = document.createElement('tb');

	for (var i = 0; i < serialList.length; i++) {
		tr = document.createElement('tr');
		td = document.createElement('td');

		td.innerHTML =  serialList[i].fullName;
		td.className = 'tableitem';
		td.addEventListener('click', function () {
			clearMain();
			document.getElementById('main').appendChild(createForm());});
		tr.appendChild(td);
		tb.appendChild(tr);
	}
	return tb;
}

//TODO
function generateDeleteSerialsTable() {
    var tb = document.createElement('tb');

    return tb;
}

function generateLastTable() {
    var tb, tr, td;
    tb = document.createElement('tb');
    
    for (var i = 0; i < serialList.length; i++) {
	    tr = document.createElement('tr');
        
        td = document.createElement('td');
        td.innerHTML = serialList[i].fullName;
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerHTML = ' Ep ' + serialList[i].episode;
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerHTML = ' Se ' + serialList[i].season;
        tr.appendChild(td);
        
        tb.appendChild(tr);
    }
  return tb;
}

function generateNewSerialsTable() {
	var tb = document.createElement('tb');
	tb.id = 'tb';
	return tb;
}

function addItemToNewSerialsTable(item) {
    
}

// Utilities

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

//TODO
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
  return serial.linkName = serial.fullName.replace(/\W+/g, '-').toLowerCase();
}

// Form operations

//TODO
function createForm() {
	var form = document.createElement('div');
	
    form.id = 'form';
	form.className = 'form';

	var span = document.createElement('span');
	span.innerHTML = 'Full name: ';
	var input = document.createElement('input');
	input.type = 'text';
	input.name = 'text';
    input.id = 'fullname';
	input.style.margin = '4px';
	input.style.marginLeft = '7px';
	var checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = 'checkFull';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(checkbox);
	form.appendChild(document.createElement('br'));

	span = document.createElement('span');
	span.innerHTML = 'Link name: ';

	input = document.createElement('input');
	input.type = 'text';
	input.name = 'text';
    input.id = 'linkname';
	input.style.margin = '4px';
	checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = 'checkLink';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(checkbox);
	form.appendChild(document.createElement('br'));

	span = document.createElement('span');
	span.innerHTML = 'Episode: ';
	input = document.createElement('input');
	input.type = 'text';
	input.name = 'numeric';
    input.id = 'episode';
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
	input.name = 'numeric';
    input.id = 'season';
	input.style.width = '20px';
	input.style.margin = '4px';
	input.style.marginLeft = '17px';
	checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = 'latest';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(checkbox);
	form.appendChild(document.createElement('br'));

	var btn = document.createElement('button');
	btn.id = 'create';
	btn.innerHTML = 'Create';
	btn.style.margin = '6px 4px 0px 0px';
	btn.addEventListener('click', function () {

	});
    form.appendChild(btn);

	btn = document.createElement('button');
	btn.id = 'clear';
	btn.innerHTML = 'Clear';
	btn.style.margin = '6px 0px 0px 5px';
	btn.addEventListener('click', function () {
		clearForm(form);
	});
	form.appendChild(btn);

	btn = document.createElement('button');
	btn.id = 'back';
	btn.innerHTML = 'Back';
	btn.style.margin = '6px 0px 0px 9px';
	btn.addEventListener('click', function () {
		clearMain();
		showTable(generateSerialsTable());
	});
	form.appendChild(btn);
	return form;
}

//TODO
function fillForm(form, serial) {

}

//TODO
function lockForm(form) {
	var inputs = form.getElementsByTagName('input');
}

//TODO
function unlockForm(form) {

}

//TODO
function parseForm(form) {
	var fullName, linkName, episode, season;

	if (form.getElementsByName('fullName').value == '') {
		alert('Error in fullName');
	}
}

//TODO
function clearForm() {
    
}

//Clearing

function clearSubmenu() {
	if (document.getElementById('head').childElementCount > 1) {
		var submenu = document.getElementById('head').lastChild;
		document.getElementById('head').removeChild(submenu);
	}
}

function clearPage() {
	clearSubmenu();
	clearMain();
}

function clearMain() {
    document.getElementById('main').innerHTML = '';
}