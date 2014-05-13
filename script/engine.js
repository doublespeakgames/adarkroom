var Engine = {
		
	/* TODO *** MICHAEL IS A LAZY BASTARD AND DOES NOT WANT TO REFACTOR ***
	 * Here is what he should be doing:
	 * 	- All updating values (store numbers, incomes, etc...) should be objects that can register listeners to
	 * 	  value-change events. These events should be fired whenever a value (or group of values, I suppose) is updated.
	 * 	  That would be so elegant and awesome.
	 */
	SITE_URL: encodeURIComponent("http://adarkroom.doublespeakgames.com"),
	VERSION: 1.3,
	MAX_STORE: 99999999999999,
	SAVE_DISPLAY: 30 * 1000,
	GAME_OVER: false,
	
	//object event types
	topics: {},
		
	Perks: {
		'拳击手': {
			desc: '徒手伤害增加',
			notify: '学会了有目的地挥拳'
		},
		'武斗家': {
			desc: '徒手伤害再增加',
			notify: '学会了如何不用武器高效战斗'
		},
		'徒手宗师': {
			desc: '拳速翻倍，威力再增加',
			notify: '学会了如何更敏捷地不使用武器进攻'
		},
		'野蛮人': {
			desc: '近战武器伤害增加',
			notify: '学会了猛力地挥动武器'
		},
		'缓慢代谢': {
			desc: '不吃东西能走两倍路程',
			notify: '学会了如何忍耐饥饿'
		},
		'荒漠跳鼠': {
			desc: '不喝水能走两倍路程',
			notify: '学会了对这干燥空气的保有爱慕'
		},
		'避实就虚': {
			desc: '更高效地闪避攻击',
			notify: "学会了闪到对手打不着的地方"
		},
		'精密': {
			desc: '命中率提高',
			notify: '学会了预判对手的行动'
		},
		'侦查': {
			desc: '看得更远',
			notify: '学会了往前看'
		},
		'诡秘': {
			desc: '更好地规避狂野中的冲突',
			notify: '学会了隐匿身形'
		},
		'美食家': {
			desc: '吃东西的时候恢复更多生命',
			notify: '学会了吸收更多的营养'
		}
	},
	
	options: {
		state: null,
		debug: false,
		log: false
	},
		
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		this._debug = this.options.debug;
		this._log = this.options.log;
		
		// Check for HTML5 support
		if(!Engine.browserValid()) {
			window.location = 'browserWarning.html';
		}
		
		// Check for mobile
		if(Engine.isMobile()) {
			window.location = 'mobileWarning.html';
		}

		Engine.disableSelection();
		
		if(this.options.state != null) {
			window.State = this.options.state;
		} else {
			Engine.loadGame();
		}
		
		$('<div>').attr('id', 'locationSlider').appendTo('#main');
		
		var menu = $('<div>')
			.addClass('menu')
			.appendTo('body');

		 $('<span>')
			.addClass('lightsOff menuBtn')
			.text('关灯')
			.click(Engine.turnLightsOff)
			.appendTo(menu);
		
		$('<span>')
			.addClass('menuBtn')
			.text('重启')
			.click(Engine.confirmDelete)
			.appendTo(menu);
		
		$('<span>')
			.addClass('menuBtn')
			.text('分享')
			.click(Engine.share)
			.appendTo(menu);
      
		$('<span>')
			.addClass('menuBtn')
			.text('存档')
			.click(Engine.exportImport)
			.appendTo(menu);
			
		$('<span>')
			.addClass('menuBtn')
			.text('移动版')
			.click(function() { window.open('https://itunes.apple.com/us/app/a-dark-room/id736683061'); })
			.appendTo(menu);	
		
		// Register keypress handlers
		$('body').off('keydown').keydown(Engine.keyDown);
		$('body').off('keyup').keyup(Engine.keyUp);

		// Register swipe handlers
		swipeElement = $('#outerSlider');
		swipeElement.on('swipeleft', Engine.swipeLeft);
		swipeElement.on('swiperight', Engine.swipeRight);
		swipeElement.on('swipeup', Engine.swipeUp);
		swipeElement.on('swipedown', Engine.swipeDown);
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Engine.handleStateUpdates);

		$SM.init();
		Notifications.init();
		Events.init();
		Room.init();
		
		if(typeof $SM.get('stores.wood') != 'undefined') {
			Outside.init();
		}
		if($SM.get('stores.compass', true) > 0) {
			Path.init();
		}
		if($SM.get('features.location.spaceShip')) {
			Ship.init();
		}
		
		Engine.travelTo(Room);

	},
	
	browserValid: function() {
		return location.search.indexOf('ignorebrowser=true') >= 0 || (
				typeof Storage != 'undefined' &&
				!oldIE);
	},
	
	isMobile: function() {
		return location.search.indexOf('ignorebrowser=true') < 0 &&
			/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
	},
	
	saveGame: function() {
		if(typeof Storage != 'undefined' && localStorage) {
			if(Engine._saveTimer != null) {
				clearTimeout(Engine._saveTimer);
			}
			if(typeof Engine._lastNotify == 'undefined' || Date.now() - Engine._lastNotify > Engine.SAVE_DISPLAY){
				$('#saveNotify').css('opacity', 1).animate({opacity: 0}, 1000, 'linear');
				Engine._lastNotify = Date.now();
			}
			localStorage.gameState = JSON.stringify(State);
		}
	},
	
	loadGame: function() {
		try {
			var savedState = JSON.parse(localStorage.gameState);
			if(savedState) {
				State = savedState;
				$SM.updateOldState();
				Engine.log("loaded save!");
			}
		} catch(e) {
			State = {};
			$SM.set('version', Engine.VERSION);
			Engine.event('progress', 'new game');
		}
	},
	
  exportImport: function() {
    Events.startEvent({
			title: '导出 / 导入',
			scenes: {
				start: {
					text: ['导出或导入存档以备份',
					       '或用以在不同电脑之间分享进度'],
					buttons: {
						'export': {
							text: '导出',
							onChoose: Engine.export64
						},
						'import': {
							text: '导入',
							nextScene: {1: 'confirm'},
						},
						'cancel': {
							text: '取消',
							nextScene: 'end'
						}
					}
				},
				'confirm': {
					text: ['你确定吗？',
					       '如果存档代码无效，所有数据均会丢失。',
					       '此操作不可撤销。'],
					buttons: {
						'yes': {
							text: '是',
							nextScene: 'end',
							onChoose: Engine.import64
						},
						'no': {
							text: '否',
							nextScene: 'end'
						}
					}
				}
			}
		});
  },
  
  export64: function() {
    Engine.saveGame();
    var string64 = Base64.encode(localStorage.gameState);
    string64 = string64.replace(/\s/g, '');
    string64 = string64.replace(/\./g, '');
    string64 = string64.replace(/\n/g, '');
    Engine.enableSelection();
    Events.startEvent({
    	title: 'Export',
    	scenes: {
    		start: {
    			text: ['保存存档代码'],
    			textarea: string64,
    			buttons: {
    				'done': {
    					text: '已完成',
    					nextScene: 'end',
    					onChoose: Engine.disableSelection
    				}
    			}
    		}
    	}
    });
  },
  
  import64: function() {
    var string64 = prompt("此处可填入存档代码。","");
    string64 = string64.replace(/\s/g, '');
    string64 = string64.replace(/\./g, '');
    string64 = string64.replace(/\n/g, '');
    var decodedSave = Base64.decode(string64);
    localStorage.gameState = decodedSave;
    location.reload();
  },
  
	event: function(cat, act) {
		if(typeof ga === 'function') {
			ga('send', 'event', cat, act);
		}
	},
	
	confirmDelete: function() {
		Events.startEvent({
			title: '重开?',
			scenes: {
				start: {
					text: ['重开游戏?'],
					buttons: {
						'yes': {
							text: '是',
							nextScene: 'end',
							onChoose: Engine.deleteSave
						},
						'no': {
							text: '否',
							nextScene: 'end'
						}
					}
				}
			}
		});
	},
	
	deleteSave: function(noReload) {
    	if(typeof Storage != 'undefined' && localStorage) {
    		var prestige = Prestige.get();
    		window.State = {};
    		localStorage.clear();
    		Prestige.set(prestige);
    	}
    	if(!noReload) {
    		location.reload();
    	}
	},
	
	share: function() {
		Events.startEvent({
			title: '分享',
			scenes: {
				start: {
					text: ['分享给你的好友。'],
					buttons: {
						'facebook': {
							text: '脸书',
							nextScene: 'end',
							onChoose: function() {
								window.open('https://www.facebook.com/sharer/sharer.php?u=' + Engine.SITE_URL, 'sharer', 'width=626,height=436,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no');
							}
						},
						'google': {
							text:'环聊',
							nextScene: 'end',
							onChoose: function() {
								window.open('https://plus.google.com/share?url=' + Engine.SITE_URL, 'sharer', 'width=480,height=436,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no');
							}
						},
						'twitter': {
							text: '推特',
							onChoose: function() {
								window.open('https://twitter.com/intent/tweet?text=A%20Dark%20Room&url=' + Engine.SITE_URL, 'sharer', 'width=660,height=260,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');
							},
							nextScene: 'end'
						},
						'reddit': {
							text: '红迪',
							onChoose: function() {
								window.open('http://www.reddit.com/submit?url=' + Engine.SITE_URL, 'sharer', 'width=960,height=700,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');
							},
							nextScene: 'end'
						},
						'close': {
							text: 'close',
							nextScene: 'end'
						}
					}
				}
			}
		}, {width: '400px'});
	},

 	findStylesheet: function(title) {
 	  	for(var i=0; i<document.styleSheets.length; i++) {
 	      	var sheet = document.styleSheets[i];
 	      	if(sheet.title == title) {
 	        	return sheet;
 	      	}
 	    }
 	    return null;
 	},

 	isLightsOff: function() {
 		var darkCss = Engine.findStylesheet('darkenLights');
 		if (darkCss != null) {
 			if (darkCss.disabled)
 				return false;
 			return true;
 		}
 		return false;
 	},
 	
 	turnLightsOff: function() {
 	  	var darkCss = Engine.findStylesheet('darkenLights');
 	    if (darkCss == null) {
 	      	$('head').append('<link rel="stylesheet" href="css/dark.css" type="text/css" title="darkenLights" />');
 	      	Engine.turnLightsOff;
 	      	$('.lightsOff').text('lights on.');
 	    }
 	  	else if (darkCss.disabled) {
 	    	darkCss.disabled = false;
 	    	$('.lightsOff').text('lights on.');
 	  	}
 	   	else {
 	     	$("#darkenLights").attr("disabled", "disabled");
 	     	darkCss.disabled = true;
 	     	$('.lightsOff').text('lights off.');
 	   	}
 	},
	
	// Gets a guid
	getGuid: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	},
	
	activeModule: null,
	
	travelTo: function(module) {
		if(Engine.activeModule != module) {
			var currentIndex = Engine.activeModule ? $('.location').index(Engine.activeModule.panel) : 1;
			$('div.headerButton').removeClass('selected');
			module.tab.addClass('selected');

			var slider = $('#locationSlider');
			var stores = $('#storesContainer');
			var panelIndex = $('.location').index(module.panel);
			var diff = Math.abs(panelIndex - currentIndex);
			slider.animate({left: -(panelIndex * 700) + 'px'}, 300 * diff);

			if($SM.get('stores.wood') != undefined) {
			// FIXME Why does this work if there's an animation queue...?
				stores.animate({right: -(panelIndex * 700) + 'px'}, 300 * diff);
			}
			
			Engine.activeModule = module;

			module.onArrival(diff);

			if(Engine.activeModule == Room || Engine.activeModule == Path) {
				// Don't fade out the weapons if we're switching to a module
				// where we're going to keep showing them anyway.
				if (module != Room && module != Path) {
					$('div#weapons').animate({opacity: 0}, 300);
				}
			}

			if(module == Room || module == Path) {
				$('div#weapons').animate({opacity: 1}, 300);
			}

			
			
			Notifications.printQueue(module);
		}
	},

	// Move the stores panel beneath top_container (or to top: 0px if top_container
	// either hasn't been filled in or is null) using transition_diff to sync with
	// the animation in Engine.travelTo().
	moveStoresView: function(top_container, transition_diff) {
		var stores = $('#storesContainer');

		// If we don't have a storesContainer yet, leave.
		if(typeof(stores) === 'undefined') return;

		if(typeof(transition_diff) === 'undefined') transition_diff = 1;

		if(top_container === null) {
			stores.animate({top: '0px'}, {queue: false, duration: 300 * transition_diff});
		}
		else if(!top_container.length) {
			stores.animate({top: '0px'}, {queue: false, duration: 300 * transition_diff});
		}
		else {
			stores.animate({top: top_container.height() + 26 + 'px'},
						   {queue: false, duration: 300 * transition_diff});
		}
	},
	
	log: function(msg) {
		if(this._log) {
			console.log(msg);
		}
	},
	
	updateSlider: function() {
		var slider = $('#locationSlider');
		slider.width((slider.children().length * 700) + 'px');
	},
	
	updateOuterSlider: function() {
		var slider = $('#outerSlider');
		slider.width((slider.children().length * 700) + 'px');
	},
	
	getIncomeMsg: function(num, delay) {
		return (num > 0 ? "+" : "") + num + " per " + delay + "s";
	},
	
	keyDown: function(e) {
		if(!Engine.keyPressed && !Engine.keyLock) {
			Engine.pressed = true;
			if(Engine.activeModule.keyDown) {
				Engine.activeModule.keyDown(e);
			}
		}
		return false;
	},
	
	keyUp: function(e) {
		Engine.pressed = false;
		if(Engine.activeModule.keyUp) {
			Engine.activeModule.keyUp(e);
		}
        else
        {
            switch(e.which) {
                case 38: // Up
                case 87:
                    Engine.log('up');
                    break;
                case 40: // Down
                case 83:
                    Engine.log('down');
                    break;
                case 37: // Left
                case 65:
                    if(Engine.activeModule == Ship && Path.tab)
                        Engine.travelTo(Path);
                    else if(Engine.activeModule == Path && Outside.tab)
                        Engine.travelTo(Outside);
                    else if(Engine.activeModule == Outside && Room.tab)
                        Engine.travelTo(Room);
                    Engine.log('left');
                    break;
                case 39: // Right
                case 68:
                    if(Engine.activeModule == Room && Outside.tab)
                        Engine.travelTo(Outside);
                    else if(Engine.activeModule == Outside && Path.tab)
                        Engine.travelTo(Path);
                    else if(Engine.activeModule == Path && Ship.tab)
                        Engine.travelTo(Ship);
                    Engine.log('right');
                    break;
            }
		}
	
		return false;
	},

	swipeLeft: function(e) {
		if(Engine.activeModule.swipeLeft) {
			Engine.activeModule.swipeLeft(e);
		}
	},

	swipeRight: function(e) {
		if(Engine.activeModule.swipeRight) {
			Engine.activeModule.swipeRight(e);
		}
	},

	swipeUp: function(e) {
		if(Engine.activeModule.swipeUp) {
			Engine.activeModule.swipeUp(e);
		}
	},

	swipeDown: function(e) {
		if(Engine.activeModule.swipeDown) {
			Engine.activeModule.swipeDown(e);
		}
	},

	disableSelection: function() {
		document.onselectstart = function() {return false;} // this is for IE
		document.onmousedown = function() {return false;} // this is for the rest
	},

	enableSelection: function() {
		document.onselectstart = function() {return true;}
		document.onmousedown = function() {return true;}
	},
	
	handleStateUpdates: function(e){
		
	}
};

//create jQuery Callbacks() to handle object events 
$.Dispatch = function( id ) {
	var callbacks,
		topic = id && Engine.topics[ id ];
	if ( !topic ) {
		callbacks = jQuery.Callbacks();
		topic = {
				publish: callbacks.fire,
				subscribe: callbacks.add,
				unsubscribe: callbacks.remove
		};
		if ( id ) {
			Engine.topics[ id ] = topic;
		}
	}
	return topic;
};

$(function() {
	Engine.init();
});
