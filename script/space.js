/**
 * Module that registers spaaaaaaaaace!
 */
var Space = {	
	SHIP_SPEED: 3,
	BASE_ASTEROID_DELAY: 500,
	BASE_ASTEROID_SPEED: 1500,
	FTB_SPEED: 60000,
	STAR_WIDTH: 3000,
	STAR_HEIGHT: 3000,
	NUM_STARS: 200,
	STAR_SPEED: 60000,
	FRAME_DELAY: 100,
	stars: null,
	backStars: null,
	ship: null,
	lastMove: null,
	done: false,
	shipX: null,
	shipY: null,
	
	hull: 0,
	
	name: "Space",
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// Create the Space panel
		this.panel = $('<div>').attr('id', "spacePanel")
			.addClass('location')
			.appendTo('#outerSlider');
		
		// Create the ship
		Space.ship = $('<div>').text("@").attr('id', 'ship').appendTo(this.panel);
		
		// Create the hull display
		var h = $('<div>').attr('id', 'hullRemaining').appendTo(this.panel);
		$('<div>').addClass('row_key').text(_('hull: ')).appendTo(h);
		$('<div>').addClass('row_val').appendTo(h);
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Space.handleStateUpdates);
	},
	
	options: {}, // Nothing for now
	
	onArrival: function() {
		Space.done = false;
		Engine.keyLock = false;
		Space.hull = Ship.getMaxHull();
		Space.altitude = 0;
		Space.setTitle();
		AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_SPACE);
		Space.updateHull();
		
		Space.up = 
		Space.down = 
		Space.left = 
		Space.right = false;
		
		Space.ship.css({
			top: '350px',
			left: '350px'
		});
		Space.startAscent();
		Space._shipTimer = setInterval(Space.moveShip, 33);
		Space._volumeTimer = setInterval(Space.lowerVolume, 1000);
		AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_SPACE);
	},
	
	setTitle: function() {
		if(Engine.activeModule == this) {
			var t;
			if(Space.altitude < 10) {
				t = _("Troposphere");
			} else if(Space.altitude < 20) {
				t = _("Stratosphere");
			} else if(Space.altitude < 30) {
				t = _("Mesosphere");
			} else if(Space.altitude < 45) {
				t = _("Thermosphere");
			} else if(Space.altitude < 60){
				t = _("Exosphere");
			} else {
				t = _("Space");
			}
			document.title = t;
		}
	},
	
	getSpeed: function() {
		return Space.SHIP_SPEED + $SM.get('game.spaceShip.thrusters');
	},
	
	updateHull: function() {
		$('div#hullRemaining div.row_val', Space.panel).text(Space.hull + '/' + Ship.getMaxHull());
	},
	
	createAsteroid: function(noNext) {
		var r = Math.random();
		var c;
		if(r < 0.2)
			c = '#';
		else if(r < 0.4)
			c = '$';
		else if(r < 0.6)
			c = '%';
		else if(r < 0.8)
			c = '&';
		else
			c = 'H';
		
		var x = Math.floor(Math.random() * 700);
		var a = $('<div>').addClass('asteroid').text(c).appendTo('#spacePanel').css('left', x + 'px');
		a.data({
			xMin: x,
			xMax: x + a.width(),
			height: a.height()
		});
		a.animate({
			top: '740px'
		}, {
			duration: Space.BASE_ASTEROID_SPEED - Math.floor(Math.random() * (Space.BASE_ASTEROID_SPEED * 0.65)),
			easing: 'linear', 
			progress: function() {
				// Collision detection
				var t = $(this);
				if(t.data('xMin') <= Space.shipX && t.data('xMax') >= Space.shipX) {
					var aY = t.css('top');
					aY = parseFloat(aY.substring(0, aY.length - 2));
					
					if(aY <= Space.shipY && aY + t.data('height') >= Space.shipY) {
						// Collision
						Engine.log('collision');
						t.remove();
						Space.hull--;
						Space.updateHull();

						// play audio on asteroid hit
						// higher altitudes play higher frequency hits
						var r = Math.floor(Math.random() * 2);
						if(Space.altitude > 40) {
							r += 6;
							AudioEngine.playSound(AudioLibrary['ASTEROID_HIT_' + r]);
						} else if(Space.altitude > 20) {
							r += 4;
							AudioEngine.playSound(AudioLibrary['ASTEROID_HIT_' + r]);
						} else  {
							r += 1;
							AudioEngine.playSound(AudioLibrary['ASTEROID_HIT_' + r]);
						}

						if(Space.hull === 0) {
							Space.crash();
						}
					}
				}
			},
			complete: function() {
				$(this).remove();
			}
		});
		if(!noNext) {
			
			// Harder
			if(Space.altitude > 10) {
				Space.createAsteroid(true);
			}
			
			// HARDER
			if(Space.altitude > 20) {
				Space.createAsteroid(true);
				Space.createAsteroid(true);
			}
			
			// HAAAAAARDERRRRR!!!!1
			if(Space.altitude > 40) {
				Space.createAsteroid(true);
				Space.createAsteroid(true);
			}
			
			if(!Space.done) {
				Engine.setTimeout(Space.createAsteroid, 1000 - (Space.altitude * 10), true);
			}
		}
	},
	
	moveShip: function() {
		var x = Space.ship.css('left');
		x = parseFloat(x.substring(0, x.length - 2));
		var y = Space.ship.css('top');
		y = parseFloat(y.substring(0, y.length - 2));
		
		var dx = 0, dy = 0;
		
		if(Space.up) {
			dy -= Space.getSpeed();
		} else if(Space.down) {
			dy += Space.getSpeed();
		}
		if(Space.left) {
			dx -= Space.getSpeed();
		} else if(Space.right) {
			dx += Space.getSpeed();
		}
		
		if(dx !== 0 && dy !== 0) {
			dx = dx / Math.sqrt(2);
			dy = dy / Math.sqrt(2);
		}
		
		if(Space.lastMove != null) {
			var dt = Date.now() - Space.lastMove;
			dx *= dt / 33;
			dy *= dt / 33;
		}
		
		x = x + dx;
		y = y + dy;
		if(x < 10) {
			x = 10;
		} else if(x > 690) {
			x = 690;
		}
		if(y < 10) {
			y = 10;
		} else if(y > 690) {
			y = 690;
		}
		
		Space.shipX = x;
		Space.shipY = y;
		
		Space.ship.css({
			left: x + 'px',
			top: y + 'px'
		});

		Space.lastMove = Date.now();
	},
	
	startAscent: function() {
		var body_color;
		var to_color;
		if (Engine.isLightsOff()) {
			body_color = '#272823';
			to_color = '#EEEEEE';
		}
		else {
			body_color = '#FFFFFF';
			to_color = '#000000';
		}

		$('body').addClass('noMask').css({backgroundColor: body_color}).animate({
			backgroundColor: to_color
		}, {
			duration: Space.FTB_SPEED, 
			easing: 'linear',
			progress: function() {
				var cur = $('body').css('background-color');
				var s = 'linear-gradient(rgba' + cur.substring(3, cur.length - 1) + ', 0) 0%, rgba' + 
					cur.substring(3, cur.length - 1) + ', 1) 100%)';
				$('#notifyGradient').attr('style', 'background-color:'+cur+';background:-webkit-' + s + ';background:' + s);
			},
			complete: Space.endGame
		});
		Space.drawStars();
		Space._timer = setInterval(function() {
			Space.altitude += 1;
			if(Space.altitude % 10 === 0) {
				Space.setTitle();
			}
			if(Space.altitude > 60) {
				clearInterval(Space._timer);
			}
		}, 1000);
		
		Space._panelTimeout = Engine.setTimeout(function() {
			if (Engine.isLightsOff())
				$('#spacePanel, .menu, select.menuBtn').animate({color: '#272823'}, 500, 'linear');
			else
				$('#spacePanel, .menu, select.menuBtn').animate({color: 'white'}, 500, 'linear');
		}, Space.FTB_SPEED / 2, true);
		
		Space.createAsteroid();
	},

	drawStars: function(duration) {
		var starsContainer = $('<div>').attr('id', 'starsContainer').appendTo('body');
		Space.stars = $('<div>').css('bottom', '0px').attr('id', 'stars').appendTo(starsContainer);
		var s1 = $('<div>').css({
			width: Space.STAR_WIDTH + 'px',
			height: Space.STAR_HEIGHT + 'px'
		});
		var s2 = s1.clone();
		Space.stars.append(s1).append(s2);
		Space.drawStarAsync(s1, s2, 0);
		Space.stars.data('speed', Space.STAR_SPEED);
		Space.startAnimation(Space.stars);
		
		Space.starsBack = $('<div>').css('bottom', '0px').attr('id', 'starsBack').appendTo(starsContainer);
		s1 = $('<div>').css({
			width: Space.STAR_WIDTH + 'px',
			height: Space.STAR_HEIGHT + 'px'
		});
		s2 = s1.clone();
		Space.starsBack.append(s1).append(s2);
		Space.drawStarAsync(s1, s2, 0);
		Space.starsBack.data('speed', Space.STAR_SPEED * 2);
		Space.startAnimation(Space.starsBack);
	},
	
	startAnimation: function(el) {
		el.animate({bottom: '-3000px'}, el.data('speed'), 'linear', function() {
			$(this).css('bottom', '0px');
			Space.startAnimation($(this));
		});
	},
	
	drawStarAsync: function(el, el2, num) {
		var top = Math.floor(Math.random() * Space.STAR_HEIGHT) + 'px';
		var left = Math.floor(Math.random() * Space.STAR_WIDTH) + 'px';
		$('<div>').text('.').addClass('star').css({
			top: top,
			left: left
		}).appendTo(el);
		$('<div>').text('.').addClass('star').css({
			top: top,
			left: left
		}).appendTo(el2);
		if(num < Space.NUM_STARS) {
			Engine.setTimeout(function() { Space.drawStarAsync(el, el2, num + 1); }, 100);
		}
	},
	
	crash: function() {
		if(Space.done) return;
		Engine.keyLock = true;
		Space.done = true;
		clearInterval(Space._timer);
		clearInterval(Space._shipTimer);
		clearInterval(Space._volumeTimer);
		clearTimeout(Space._panelTimeout);
		var body_color;
		if (Engine.isLightsOff())
			body_color = '#272823';
		else
			body_color = '#FFFFFF';
		// Craaaaash!
		$('body').removeClass('noMask').stop().animate({
			backgroundColor: body_color
		}, {
			duration: 300, 
			progress: function() {
				var cur = $('body').css('background-color');
				var s = 'linear-gradient(rgba' + cur.substring(3, cur.length - 1) + ', 0) 0%, rgba' + 
					cur.substring(3, cur.length - 1) + ', 1) 100%)';
				$('#notifyGradient').attr('style', 'background-color:'+cur+';background:-webkit-' + s + ';background:' + s);
			},
			complete: function() {
				Space.stars.remove();
				Space.starsBack.remove();
				Space.stars = Space.starsBack = null;
				$('#starsContainer').remove();
				$('body').attr('style', '');
				$('#notifyGradient').attr('style', '');	
				$('#spacePanel').attr('style', '');			
			}
		});
		$('.menu, select.menuBtn').animate({color: '#666'}, 300, 'linear');
		$('#outerSlider').animate({top: '0px'}, 300, 'linear');
		Engine.activeModule = Ship;
		Ship.onArrival();
		Button.cooldown($('#liftoffButton'));
		Engine.event('progress', 'crash');
		AudioEngine.playSound(AudioLibrary.CRASH);
	},
	
	endGame: function() {
		if(Space.done) return;
		Engine.event('progress', 'win');
		Space.done = true;
		clearInterval(Space._timer);
		clearInterval(Space._shipTimer);
		clearInterval(Space._volumeTimer);
		clearTimeout(Engine._saveTimer);
		clearTimeout(Outside._popTimeout);
		clearTimeout(Engine._incomeTimeout);
		clearTimeout(Events._eventTimeout);
		clearTimeout(Room._fireTimer);
		clearTimeout(Room._tempTimer);
		for(var j in Room.Craftables) {
			Room.Craftables[j].button = null;
		}
		for(var k in Room.TradeGoods) {
			Room.TradeGoods[k].button = null;
		}
		delete Outside._popTimeout;
		
		AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_ENDING);

		$('#hullRemaining', Space.panel).animate({opacity: 0}, 500, 'linear');
		Space.ship.animate({
			top: '350px',
			left: '240px'
		}, 3000, 'linear', function() {
			Engine.setTimeout(function() {
				Space.ship.animate({
					top: '-100px'
				}, 200, 'linear', function() {
					// Restart everything! Play FOREVER!
					$('#outerSlider').css({'left': '0px', 'top': '0px'});
					$('#locationSlider, #worldPanel, #spacePanel, #notifications').remove();
					$('#header').empty();
					Engine.setTimeout(function() {
						$('body').stop();
						var container_color;
						if (Engine.isLightsOff())
							container_color = '#EEE';
						else
							container_color = '#000';
						$('#starsContainer').animate({
							opacity: 0,
							'background-color': container_color
						}, {
							duration: 2000, 
							progress: function() {
								var cur = $('body').css('background-color');
								var s = 'linear-gradient(rgba' + cur.substring(3, cur.length - 1) + ', 0) 0%, rgba' + 
									cur.substring(3, cur.length - 1) + ', 1) 100%)';
								$('#notifyGradient').attr('style', 'background-color:'+cur+';background:-webkit-' + s + ';background:' + s);
							},
							complete: function() {
								Engine.GAME_OVER = true;
								Score.save();
								Prestige.save();
						
								$('<center>')
									.addClass('centerCont')
									.appendTo('body');
								$('<span>')
									.addClass('endGame')
									.text(_('score for this game: {0}', Score.calculateScore()))
									.appendTo('.centerCont')
									.animate({opacity:1},1500);
								$('<br />')
									.appendTo('.centerCont');
								$('<span>')
									.addClass('endGame')
									.text(_('total score: {0}', Prestige.get().score))
									.appendTo('.centerCont')
									.animate({opacity:1},1500);
								$('<br />')
									.appendTo('.centerCont');
								$('<br />')
									.appendTo('.centerCont');
								$('#starsContainer').remove();
								$('#content, #notifications').remove();
								$('<span>')
									.addClass('endGame endGameOption')
									.text(_('restart.'))
									.click(Engine.confirmDelete)
									.appendTo('.centerCont')
									.animate({opacity:1},1500);
								$('<br />')
									.appendTo('.centerCont');
								$('<br />')
										.appendTo('.centerCont');
								$('<span>')
										.addClass('endGame')
										.text(_('expanded story. alternate ending. behind the scenes commentary. get the app.'))
										.appendTo('.centerCont')
										.animate({opacity:1}, 1500);
								$('<br />')
										.appendTo('.centerCont');
								$('<br />')
										.appendTo('.centerCont');
								$('<span>')
									.addClass('endGame endGameOption')
									.text(_('iOS.'))
									.click(function() { window.open('https://itunes.apple.com/app/apple-store/id736683061?pt=2073437&ct=gameover&mt=8'); })
									.appendTo('.centerCont')
									.animate({opacity:1},1500);
								$('<br />')
										.appendTo('.centerCont');
								$('<span>')
										.addClass('endGame endGameOption')
										.text(_('android.'))
										.click(function() { window.open('https://play.google.com/store/apps/details?id=com.yourcompany.adarkroom'); })
										.appendTo('.centerCont')
										.animate({opacity:1},1500);
								Engine.options = {};
								Engine.deleteSave(true);
							}
						});
					}, 2000);
				});
			}, 2000);
		});
	},
	
	keyDown: function(event) {
		switch(event.which) {
			case 38: // Up
			case 87:
				Space.up = true;
				Engine.log('up on');
				break;
			case 40: // Down
			case 83:
				Space.down = true;
				Engine.log('down on');
				break;
			case 37: // Left
			case 65:
				Space.left = true;
				Engine.log('left on');
				break;
			case 39: // Right
			case 68:
				Space.right = true;
				Engine.log('right on');
				break;
		}
	},
	
	keyUp: function(event) {
		switch(event.which) {
			case 38: // Up
			case 87:
				Space.up = false;
				Engine.log('up off');
				break;
			case 40: // Down
			case 83:
				Space.down = false;
				Engine.log('down off');
				break;
			case 37: // Left
			case 65:
				Space.left = false;
				Engine.log('left off');
				break;
			case 39: // Right
			case 68:
				Space.right = false;
				Engine.log('right off');
				break;
		}
	},
	
	handleStateUpdates: function(e){
		
	},
	
	lowerVolume: function () {
		if (Space.done) return;
		
		// lower audio as ship gets further into space
		var progress = Space.altitude / 60;
		var newVolume = 1.0 - progress;
		AudioEngine.setBackgroundMusicVolume(newVolume, 0.3);
	}
};
