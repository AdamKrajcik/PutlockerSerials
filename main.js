var serialList = [];

window.onload = function() {
    //noinspection JSUnresolvedVariable
    chrome.storage.sync.get(['serialList'], function(result) {
        serialList = result.serialList;

        if (serialList === undefined) {
            serialList = [];
            console.log('No save or first run at ' + new Date());
			showMainMenu();
        }
        else {
            console.log('Load completed at ' + new Date());
            showMainMenu();
        }
    });
};

function save() {
	//noinspection JSUnresolvedVariable
	chrome.storage.sync.set( {'serialList' : serialList }, function () { console.log('saved ' + new Date()); });
}

function checkForNew() {
	showTable(generateNewSerialsTable());
    for(var i = 0; i < serialList.length; i++) {
	    var season = serialList[i].season;
	    var episode = serialList[i].episode + 1;
	    findNextEpisode(serialList[i].linkName, season, episode);
    }
}

function findNextEpisode(linkName, season, episode) {

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
        addItemToNewSerialsTable(linkName, season, episode);
	} else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
	  if (episode === 1) {
	  } else {
		season++;
		episode = 1;
		findNextEpisode(linkName, season, episode);
	  }
	}
  };
  
  xmlhttp.open('GET', createLink(linkName, season, episode), true);
  xmlhttp.send();
}

function nextEpisodeOfSerial(linkName) {
	var serial = findSerialInArray(linkName);
	var episode = serial.episode + 1;
	var season = serial.season;
	findNextEpisode(linkName, season, episode);
}

// Generate menu

function generateMainMenu() {
    var menu = document.createElement('div');
	menu.id = 'menu';
	menu.className = 'menu';

    var btn = document.createElement('div');
    btn.innerHTML = 'Serials';
    btn.className = 'largemenubutton';
    btn.addEventListener('click',function() {
        clearPage();
        showSubmenu(generateSerialMenu());
        showTable(generateSerialsTable());
    });
    menu.appendChild(btn);
	
    btn = document.createElement('div');
    btn.innerHTML = 'Next';
    btn.className = 'largemenubutton';
    btn.addEventListener('click',function() {
        clearPage();
        checkForNew();});
    menu.appendChild(btn);

    btn = document.createElement('div');
    btn.innerHTML = 'S';
    btn.className = 'smallmenubutton';
    btn.addEventListener('click',function() {
        clearPage();
        showSubmenu(generateSettingsMenu());
    });
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
	  showForm(createForm());
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
    btn.addEventListener('click', function () {
        showForm(createImportForm());
    });
	menu.appendChild(btn);

    var btn = document.createElement('div');
    btn.innerHTML = 'Export';
    btn.className = 'submenubutton';
    btn.addEventListener('click', function () {
		showForm(createExportForm());
    });
    menu.appendChild(btn);
	
	return menu;
}

// Show menu

function showMainMenu() {
    clearPage();
	document.getElementById('head').appendChild(generateMainMenu());
}

function showSubmenu(submenu) {
    clearSubmenu();
	document.getElementById('head').appendChild(submenu);
}

function showTable(table) {
    clearMain();
    document.getElementById('main').appendChild(table);
}

function showForm(form) {
    clearMain();
    document.getElementById('main').appendChild(form);
}

// Generate table

function generateSerialsTable() {
	var tb, tr, td;
	tb = document.createElement('tb');

	for (var i = 0; i < serialList.length; i++) {
		tr = document.createElement('tr');
		tr.className = 'serialtablerow';
		
		td = document.createElement('td');
		td.innerHTML = serialList[i].fullName;
		td.className = 'nametableitem';
		td.id = i;
		td.addEventListener('click', function () {
			var form = createForm();
			fillForm(form, this.id);
			lockForm(form);
			showForm(form);
		});
		tr.appendChild(td);

		td = document.createElement('td');
		td.innerHTML = ' Ep ' + serialList[i].episode;
		td.className = 'episodetableitem';
		tr.appendChild(td);

		td = document.createElement('td');
		td.innerHTML = ' Se ' + serialList[i].season;
		td.className = 'seasontableitem';
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

function addItemToNewSerialsTable(name, season, episode) {
	var tr, btn, td, a;
	tr = document.createElement('tr');
	tr.className = 'serialtablerow';
	tr.id = name;

	td = document.createElement('td');
	td.className = 'nametableitem';
	btn = document.createElement('div');
	btn.className = 'watched';
	btn.addEventListener('click', function() {
		var s = findSerialInArray(name);
		s.episode = episode;
		s.season = season;
		save();
		document.getElementById('tb').removeChild(document.getElementById(s.linkName));
		nextEpisodeOfSerial(name);
	});

	td.appendChild(btn);
	a = document.createElement('a');
	a.href = createLink(name, season, episode);
	a.target = '_blank';
	a.innerHTML = findSerialInArray(name).fullName; //TO be rewritten
	td.appendChild(a);
	tr.appendChild(td);

	td = document.createElement('td');
	td.className = 'episodetableitem';
	td.innerHTML = 'Ep  ' + episode;
	tr.appendChild(td);

	td = document.createElement('td');
	td.className = 'seasontableitem';
	td.innerHTML = 'Se  ' + season;
	tr.appendChild(td);

	document.getElementById('tb').appendChild(tr);
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

function linkName(fullname) {
  return fullname.replace(/\W+/g, '-').toLowerCase();
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Form operations

function createForm() {
	var form = document.createElement('div');
	
    form.id = 'form';
	form.className = 'form';

	var span = document.createElement('span');
	span.innerHTML = 'Full name: ';
	var input = document.createElement('input');
	input.type = 'text';
	input.name = 'input';
    input.id = 'fullname';
    input.addEventListener('input', function () {
        document.getElementById('linkname').value = linkName(this.value);
    });
	input.style.margin = '4px';
	input.style.marginLeft = '7px';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(document.createElement('br'));

	span = document.createElement('span');
	span.innerHTML = 'Link name: ';

	input = document.createElement('input');
	input.type = 'text';
	input.name = 'input';
    input.id = 'linkname';
	input.style.margin = '4px';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(document.createElement('br'));

	span = document.createElement('span');
	span.innerHTML = 'Episode: ';
	input = document.createElement('input');
	input.type = 'text';
	input.name = 'input';
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
	input.name = 'input';
    input.id = 'season';
	input.style.width = '20px';
	input.style.margin = '4px';
	input.style.marginLeft = '17px';
	form.appendChild(span);
	form.appendChild(input);
	form.appendChild(document.createElement('br'));

	var btn = document.createElement('button');
	btn.id = 'create';
	btn.innerHTML = 'Create';
	btn.style.margin = '6px 0px 0px 0px';
	btn.addEventListener('click', function () {
		if (checkForm(form) && this.innerHTML === 'Create') {
			serialList.push(parseForm(form));
			save();
            clearMain();
            showTable(generateSerialsTable());
	    }
	});
	btn.addEventListener('click', function () {
		if (this.innerHTML === 'Save' && checkForm(form)) {
			serialList[this.name] = parseForm(form);
			save();
			showTable(generateSerialsTable());
		}
	});
    btn.addEventListener('click', function () {
        if (this.innerHTML === 'Update') {
            unlockForm(form);
            this.innerHTML = 'Save';
        }
    });

    form.appendChild(btn);

	btn = document.createElement('button');
	btn.id = 'clear';
	btn.innerHTML = 'Clear';
	btn.style.margin = '6px 0px 0px 9px';
	btn.addEventListener('click', function () {
		if (this.innerHTML === 'Clear') {
			clearForm(form);
		}
	});
	btn.addEventListener('click', function () {
		if (this.innerHTML === 'Delete') {
			serialList.splice(this.name, 1);
			save();
			showTable(generateSerialsTable());
		}
	});
	form.appendChild(btn);

	btn = document.createElement('button');
	btn.id = 'back';
	btn.innerHTML = 'Back';
	btn.style.margin = '6px 0px 0px 9px';
	btn.addEventListener('click', function () {
		showTable(generateSerialsTable());
	});
	form.appendChild(btn);
	return form;
}

function fillForm(form, id) {
    var inputs = form.getElementsByTagName('input');
	inputs[0].value = serialList[id].fullName;
	inputs[1].value = serialList[id].linkName;
	inputs[2].value = serialList[id].episode;
	inputs[3].value = serialList[id].season;

    form.getElementsByTagName('button')[0].innerHTML = 'Update';
	form.getElementsByTagName('button')[0].name = id;
	form.getElementsByTagName('button')[1].innerHTML = 'Delete';
	form.getElementsByTagName('button')[1].name = id;

}

function lockForm(form) {
	var inputs = form.getElementsByTagName('input');

	for (var i = 0; i < inputs.length; i++ ) {
        if (inputs[i].name === 'input') {
            inputs[i].disabled = true;
        }
	}

	//form.getElementsByTagName('button')[1].disabled = true;
}

function unlockForm(form) {
	var inputs = form.getElementsByTagName('input');

	for (var i = 0; i < inputs.length; i++ ) {
		inputs[i].disabled = false;
	}

    //form.getElementsByTagName('button')[1].disabled = false;
}

function parseForm(form) {
    var inputs = form.getElementsByTagName('input');
	var serial = {
		fullName : inputs[0].value,
		linkName : inputs[1].value,
		episode : parseInt(inputs[2].value),
		season : parseInt(inputs[3].value)
	};

	return serial;
}

function clearForm(form) {
    var inputs = form.getElementsByTagName('input');

    for (var i = 0; i < inputs.length; i++) {
		inputs[i].value = '';
    }
}

function checkForm(form) {
    //TODO implement checking of forms
    return true;
}


function createImportForm() {
	var form = document.createElement('div');
  
	form.id = 'form';
	form.className = 'form';
	
	var textarea = document.createElement('textarea');
	var chooseFile = document.createElement('input');
	chooseFile.type = 'file';
	chooseFile.id = 'fileInput';
	chooseFile.addEventListener('change', function(e) {
	  if (chooseFile.files[0].type.match(/text.*/)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					textArea.value = reader.result;
				};
				
				reader.readAsText(chooseFile.files[0]);	
	  } else {
	    conslole.log('Error when reading file:' + chooseFile.files[0]);
	  }
	});
	
	form.appendChild(chooseFile);
	
	
	textarea.className = 'data';
	textarea.id = 'textArea';
  form.appendChild(textarea);

    var btn = document.createElement('button');
    btn.style.marginTop = '6px';
    btn.innerHTML = 'Save';
    btn.addEventListener('click', function () {
        if (confirm('Warning! This process will delete all saved data. Do you wich to proceed')) {
            if (IsJsonString(textarea.value)) {
                serialList = JSON.parse(textarea.value);
                save();
                alert('Import complete.');
                showTable(generateSerialsTable());
            }
            else {
                alert('Error in JSON Import String.');
            }
        }
    });
    form.appendChild(btn);

    btn = document.createElement('button');
    btn.innerHTML = 'Back';
    btn.style.margin = '6px 0px 0px 9px';
    btn.addEventListener('click', function () {
        showTable(generateSerialsTable());
    });
    form.appendChild(btn);

    return form;
}

function createExportForm() {
	var form = document.createElement('div');

	form.id = 'form';
	form.className = 'form';
	var textarea = document.createElement('textarea');
	textarea.className = 'data';
    textarea.readOnly = true;
	textarea.value = JSON.stringify(serialList);
    textarea.addEventListener('click', function () {
        this.select();
    });

	var btn = document.createElement('button');
	btn.innerHTML = 'Back';
    btn.style.marginTop = '6px';
	btn.addEventListener('click', function () {
		showTable(generateSerialsTable());
	});

	form.appendChild(textarea);
	form.appendChild(btn);
	return form;
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

