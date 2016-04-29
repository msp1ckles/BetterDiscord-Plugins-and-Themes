//META{"name":"Utils"}*//
function Utils() {
	this.getName = function() { return "Utilities"; };
	this.getDescription = function() { return "Usefull stuff that didn't make it into a own plugin."; };
	this.getVersion = function() { return "1.0"; };
	this.getAuthor = function() { return "Bluscream"; };
}
Utils.prototype.load = function() {};
Utils.prototype.start = function() {
	var _require = ['BetterAPI', 'https://raw.githubusercontent.com/Bluscream/BetterDiscord-Plugins-and-Themes/master/plugins/0_BetterAPI.plugin.js', 'BetterAPI.isDebug()'];
	if(BdApi.getPlugin(_require[0]) !== null){
		try{eval(_require[2]);
		}catch(e){
			Core.prototype.alert('Private Plugin - Requirement not started!',''+
				'A requirement is not started: <b>'+_require[0]+'<b><br>'+
				'<br>'+
				'Click <a onClick="'+
					'$(\'.btn-settings\').click();'+
					'setTimeout(function(){ $(\'#bd-settings-new\').click();'+
					'setTimeout(function(){ $(\'#'+_require[0]+'\').prop(\'checked\', true);'+
					' }, 750); }, 750);'+
				'">here</a> to enable it.<br>'+
			'');
			return null;
		}
		/*$('div[data-reactid=".0.1.1.0.2.0"]').livequery(function(){
			BetterAPI.addLocationBar();
		});*/
		$('.server-info.server-name>span').livequery(function(){
			$('.server-info.server-name>span').each( function(i,e) { $(e).text($(e).text().replace(' by undefined', '')) });
			$('.server-info.server-region>span').each( function(i,e) {
				var _text = $(e).text();
				if(_text.contains('-')){
					_text = _text.replaceAll('-', ' ');
					_text = _text.toUpperCase();
				}else{ _text = _text.capitalizeFirstLetter(); }
				if(_text.contains('VIP')){
					_text = _text.replace('VIP', '');
					var p = $(e).parent().parent().find('.server-name').find('span');
					var _html = $(p).text();
					$(p).wrap('<div style="color:gold"></div>');
					$(p).append(' <img src="/assets/e4d52f4d69d7bba67e5fd70ffe26b70d.svg" width="16px"></img>');
				}
				$(e).text(_text);
			});
		});
	}else{
		Core.prototype.alert('Required plugin not found!',''+
			'A requirement is missing: <b>'+_require[0]+'</b><br>'+
			'<br>'+
			'Click <a style=""href="#" onClick="require(\'shell\').openExternal(\'http://betterdiscord.net/ghdl?url='+_require[1]+'\')">here</a> to download the plugin.<br>'+
			'Save the downloaded file to "'+process.env.APPDATA+'\BetterDiscord\\plugins\\".'+
		'');
		return null;
	}
	_require = null;
};
Utils.prototype.onSwitch = function() {
	//BetterAPI.createCharCounter();
	setTimeout(function() {
		var scrollPane = $(".scroller.messages").first();
        $(scrollPane).scrollTop(999999999);
		var scrollPane = $(".scroller.channel-members").first();
        $(scrollPane).scrollTop(0);
	}, 1000);
};
Utils.prototype.onBooth = function() {
	$('*').removeAttr( "disabled" );
	$('.channel-textarea').removeClass('channel-textarea-disabled');
	$('.emoji:not(.emote)').addClass('emote');
	//BetterAPI.createCharCounter();
	if(BetterAPI.elemExists("#bd-pub-button")){
		$('#bd-pub-button').text($('#bd-pub-button').text().capitalizeFirstLetter());
	}
	if(BetterAPI.elemExists('header[data-reactid$="$Direct Messages"]')){
		$('header[data-reactid$="$Direct Messages"]').html('PM\'s - <a onclick="$(\'.close\').click();">Clear all</a>');
	}
};
Utils.prototype.onMessage = function() {
	//Utils.updateCount();Utils.checkServerCount();
};
Utils.prototype.stop = function() {};
Utils.prototype.unload = function() {};
Utils.updateCount = function() {
	servers = localStorage.getItem('servers');
	localStorage.setItem('servers', BetterAPI.serverCount());
	users = localStorage.getItem('users');
	localStorage.setItem('users', BetterAPI.userCount());
}
Utils.checkUserCount = function() {
	_users = localStorage.getItem('users');
	if(users != _users){
		if (users < _users){
			alertify.success(Math.abs(users-_users)+' users(s) joined.');
		}else{
			alertify.error(Math.abs(users-_users)+' users(s) left.');
		}
	}
}
Utils.checkServerCount = function() {
	_servers = localStorage.getItem('servers');
	if(servers != _servers){
		if (servers < _servers){
			alertify.success(Math.abs(servers-_servers)+' server(s) added.');
		}else{
			alertify.error(Math.abs(servers-_servers)+' server(s) removed.');
		}
	}
}
Utils.clearDMs = function() {
	$('.close').each(function(i,el){
		$(el).click();
	});
}
try{exports.Utils = Utils;}catch(e){console.warn('Using old version, not exporting functions.')}