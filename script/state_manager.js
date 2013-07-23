/*
 * Module for handling States
 * 
 * All states should be get and set through the StateManager ($SM).
 * 
 * The manager is intended to handle all needed checks and error catching.
 * This includes creating the parents of layered/deep states so undefined states
 * do not need to be tested for and created beforehand.
 * 
 * When a state is changed, an update event is sent out containing the name of the state
 * changed or in the case of multiple changes (.setM, .addM) the parent class changed.
 * Event: type: 'stateUpdate', stateName: <path of state or parent state>
 * 
 * Original file created by: Michael Galusha
 */

var StateManager = {
		
	MAX_STORE: 99999999999999,
	
	options: {},
	
	init: function(options) {
		this.options = $.extend(
				this.options,
				options
		);
		
		//create categories
		var cats = [
				'features', //big features like buildings, location availability, unlocks, etc
				'stores', //little stuff, items, weapons, etc
				'character', //this is for player's character stats such as perks
				'income',
				'timers',
				'game', //mostly location related: fire temp, workers, population, world map, etc
				'playStats', //anything play related: play time, loads, etc
				];
		
		for(var which in cats) {
			if(!$SM.get(cats[which])) $SM.set(cats[which], {}); 
		};
	},
	
	//create the parent of a given state, recursive as needed
	createParent: function(stateName) {
		var err = 0;
		
		//parse path to find last child
		var lastDot = stateName.lastIndexOf('.'); //if ends with a dot, there is a coding bug, not like ending in a bracket, so don't account for it
		if(lastDot == stateName.length) {
			Engine.log('ERROR: '+stateName+' is invalid. Cannot end in a dot.');
			return;
		}
		var lastOB = stateName.lastIndexOf('[');
		//make sure last bracket isn't just end of the line
		var lastCB = stateName.substr(0, stateName.length -1).lastIndexOf(']');
		//find last child or return if no more children
		var cutoff = Math.max(lastDot, lastOB, lastCB);
		if(cutoff <= 0) return;
		
		var parentPath = $SM.buildPath(stateName.substr(0,cutoff));
			
		//try creating the parent
		try {
			eval('('+parentPath+') = {}');
		} catch (e) {
			//need to go up another level and make parent of whichParent
			$SM.createParent(stateName.substr(0,cutoff));
			//then it will definitely work if not, something is fubar
			eval('('+parentPath+') = {}');
		}
	},
	
	//set single state
	//if noEvent is true, the update event won't trigger, useful for setting multiple states first
	set: function(stateName, value, noEvent) {
		var fullPath = $SM.buildPath(stateName);
		
		//make sure the value isn't over the engine maximum
		if(typeof value == 'number' && value > $SM.MAX_STORE) value = $SM.MAX_STORE;
		
		try{
			eval('('+fullPath+') = value');
		} catch (e) {
			//parent doesn't exist, so make parent
			$SM.createParent(stateName);
			//now it will definitely work. if not, something is broken
			eval('('+fullPath+') = value');
		}
		
		//stores values can not be negative
		if(stateName.indexOf('stores') == 0 && $SM.get(stateName, true) < 0) {
			eval('('+fullPath+') = 0');;
			Engine.log('WARNING: state:' + stateName + ' can not be a negative value. Set to 0 instead.')
		}
		
		if(!noEvent) {
			Engine.saveGame();
			$SM.fireUpdate(stateName);
		}		
	},
	
	//sets a list of states
	setM: function(parentName, list, noEvent) {
		var whichParent = $SM.buildPath(parentName);
		
		//make sure the state exists to avoid errors,
		if($SM.get(parentName) == undefined) $SM.set(parentName, {}, true);
		
		for(var k in list){
			$SM.set(parentName+'[\''+k+'\']', list[k], true);
		}
		
		if(!noEvent) {
			Engine.saveGame();
			$SM.fireUpdate(parentName);
		}
	},
	
	//shortcut for altering number values, return 1 if state wasn't a number
	add: function(stateName, value, noEvent) {
		var err = 0;
		//0 if undefined, null (but not {}) should allow adding to new objects, helps avoid existence checks and NaN for stores
		//could also add in a true = 1 thing, to have something go from existing (true) to be a count, but that might be unwanted behavior
		var old = $SM.get(stateName, true);
		
		if(typeof old != 'number' || typeof value != 'number'){
			Engine.log('WARNING: Can not do math with state:'+stateName+' or value:'+value+' because at least one is not a number.');
			err = 1
		} else {
			$SM.set(stateName, old + value, noEvent); //setState handles event and save
		}
		
		return err;
	},
	
	//alters multiple number values, return number of fails
	addM: function(parentName, list, noEvent) {
		var err = 0;
		
		//make sure the parent exists to avoid errors
		if($SM.get(parentName) == undefined) $SM.set(parentName, {}, true);
		
		for(var k in list){
			if(!$SM.add(parentName+'[\''+k+'\']', list[k], true)) err++;
		}
		
		if(!noEvent) {
			Engine.saveGame();
			$SM.fireUpdate(parentName);
		}
		return err;
	},
	
	//return state, undefined or 0
	get: function(stateName, requestZero) {
		var whichState = null;
		var fullPath = $SM.buildPath(stateName, name);
		
		//catch errors if parent of state doesn't exist
		try{
			eval('whichState = ('+fullPath+')');
		} catch (e) {
			whichState = undefined;
		}
		
		//prevents repeated if undefined, null, false or {}, then x = 0 situations
		if((!whichState || whichState == {}) && requestZero) return 0;
		else return whichState;
	},
	
	remove: function(stateName) {
		var whichState = $SM.buildPath(whichState);
		try{
			delete eval(whichState);
		} catch (e) {
			//it didn't exist in the first place
			Engine.log('WARNING: Tried to remove non-existant state \''+stateName+'\'.');
		}
		Engine.saveGame();
		$SM.fireUpdate(stateName);
	},
	
	//creates full reference from input
	//hopefully this won't ever need to be more complicated
	buildPath: function(input){
		var dot = (input.charAt(0) == '[')? '' : '.'; //if it starts with [foo] no dot to join
		return 'State' + dot + input;
	},
	
	
	
	fireUpdate: function(stateName, save){
		if(stateName == undefined) stateName = 'all'; //best if this doesn't happen as it will trigger more stuff
		$.event.trigger({
				'type': 'stateUpdate',
				'stateName': stateName, 
		});
		if(save) Engine.saveGame();
	},
	
	handleStateUpdates: function(e){
		
	},
};

//alias
var $SM = StateManager;

//listener for StateManager update events
$(StateManager).on('stateUpdate', $SM.handleStateUpdates);