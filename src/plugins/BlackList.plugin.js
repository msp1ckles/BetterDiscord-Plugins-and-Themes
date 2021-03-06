//META{"name":"BlackList"}*//
var BlackList = function() {
	this.loadDatabase();
};
var debugging = false;
var AutoBans = {};
BlackList.prototype.load = function() {};
BlackList.prototype.start = function () {
	var _require = ['DiscordJS', 'https://raw.githubusercontent.com/Bluscream/BetterDiscord-Plugins-and-Themes/indev/plugins/0_DiscordJS.plugin.js', 'bot.ready'];
	if(BdApi.getPlugin(_require[0]) !== null){
		try{eval(_require[2]);
		}catch(e){
			Core.prototype.alert(BlackList.prototype.getName()+' - Requirement not started!',''+
				'A requirement is not started: <b>'+_require[0]+'<b><br>'+
				'<br>'+
				'Click <a onClick="'+
					'$(\'.btn-settings\').click();'+
					'setTimeout(function(){ $(\'#bd-settings-new\').click();'+
					'setTimeout(function(){ $(\'#'+_require[0]+'\').prop(\'checked\', true);'+
					' }, 750); }, 750);'+
				'">here</a> to enable it.<br>'+
			'');
			return;
		}
		var debug = BetterAPI.isDebug();
		AutoBans = BetterAPI.loadSettings('AutoBans', AutoBans);
		debugging = BetterAPI.isDebug();
		var _int = setInterval(function(){
			try{
				bot.on("ready", function (data) {
					clearInterval(_int);
				});
				bot.on("serverNewMember", function (server, user) {
					var _channel = server.channels[0];
					var _perms = _channel.permissionsOf(bot.user.id);
					if(!_perms.hasPermission('banMembers')){return;}
					for (var key in AutoBans) {
						if (!AutoBans.hasOwnProperty(key)) continue;
						if(AutoBans[key] == user.id){
							bot.banMember(user,server);
							console.warn(user.name+' blacklisted user on '+server.name);
						}// else if(key == user.username){
							// bot.banMember(user,server);
						// }
					}
				});
				clearInterval(_int)
			}catch(e){};
		}, 2000);
	}else{
		Core.prototype.alert('Required plugin not found!',''+
				'A requirement is missing: <b>'+_require[0]+'</b><br>'+
				'<br>'+
				'Click <a href="#" onClick="require(\'shell\').openExternal(\'http://betterdiscord.net/ghdl?url='+_require[1]+'\')">here</a> to download the plugin.<br>'+
				'Save the downloaded file to "'+process.env.APPDATA+'\BetterDiscord\\plugins\\".'+
			'');
			return null;
	}
	_require = null;
};
BlackList.prototype.onSwitch = function () {};
BlackList.prototype.getSettingsPanel = function() {
	var self = this;
	var settings = $('<div class="form" style="max-width:100%;"></div>');
	settings.append('<h1 style="font-weight: bold">Blacklisted users:</h1>');

	var rowHtml = "";
	rowHtml += '<div class="control-group BlackList-inputgroup">';
	rowHtml += '	<input style="width: 20%;" type="text" name="name" placeholder="Name">';
	rowHtml += '	<input style="width: 70%;" type="text" name="data" placeholder="UID">';
	rowHtml += '</div><br>';

	for (var key in AutoBans) {
		if (!AutoBans.hasOwnProperty(key)) continue;
		var row = $(rowHtml);
		row.find('input[name="name"]').val(key);
		row.find('input[name="data"]').val(AutoBans[key]);
		settings.append(row);
	}

	settings.append(rowHtml);

	var addButton = $('<button type="button" class="btn btn-primary">Add Row</div>')
		.click(function() {
			$(this).before(rowHtml);
		});

	var saveButton = $('<button type="button" class="btn btn-primary">Save</div>')
		.click(function() {
			AutoBans = {};
			settings.find('.BlackList-inputgroup').each(function(i, el) {
				var $e = $(el);
				var key = $e.find('input[name="name"]').val().trim();
				var data = $e.find('input[name="data"]').val().trim();
				if (key === "" || data === "") return;
				AutoBans[key] = data;
			});

			self.saveDatabase();
			self.checkAll();

			var $b = $(this).text('Saved!');
			setTimeout(function() {$b.text('Save');}, 1000);
		});

	settings.append(addButton);
	settings.append(saveButton);
	return settings;
};
BlackList.prototype.checkAll = function() {
	var _servers = bot.servers;
	for (var i = 0; i < _servers.length; i++) {
		BlackList.prototype.checkServer(_servers[i].id)
	}
};
BlackList.prototype.checkServer = function(sid) {
	var _server = bot.servers.get('id',sid);
	var _channel = _server.channels[0];
	var _perms = _channel.permissionsOf(bot.user.id);
	if(!_perms.hasPermission('banMembers')){return;}
	var _members = _server.members;
	for (var key in AutoBans) {
		if (!AutoBans.hasOwnProperty(key)) continue;
		for (var i = 0; i < _members.length; i++) {
			if( _members[i].id == AutoBans[key]){
				bot.banMember(_members[i].id,_server);
				console.warn(_members[i].name+' #'+_members[i].id+' blacklisted user banned on '+_server.name);
			}
		}
	}
};
BlackList.prototype.saveDatabase = function() {
	window.localStorage.AutoBans = JSON.stringify(AutoBans);
};
BlackList.prototype.loadDatabase = function() {
	if (window.localStorage.hasOwnProperty("AutoBans")) {
		var data = window.localStorage.AutoBans;
		AutoBans = JSON.parse(data);
	} else {
		AutoBans = {};
	}
};
BlackList.prototype.stop = function () {};
BlackList.prototype.unload = function () {};
BlackList.prototype.getName = function () {
	return "BlackList";
};
BlackList.prototype.getDescription = function () {
	return "A Discord.js blacklist in BetterDiscord.";
};
BlackList.prototype.getVersion = function () {
	return "1.0";
};
BlackList.prototype.getAuthor = function () {
	return "Bluscream, Decorater";
};
BlackList.prototype.onMessage = function () {};
try{exports.BlackList = BlackList;}catch(e){console.warn('Using old version, not exporting functions.');}