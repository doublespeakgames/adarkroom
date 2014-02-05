(function(){
	//only used for poedit to find translatable strings
	var keywords = [ _('wood'),_('builder'),_('teeth'),_('meat'),_('fur'),
	                 _('charm'),_('leather'),_('iron'), _('steel'), _('coal'),
	                 _('hut'), _('cart'), _('trap'), _('gatherer'),_('cloth'),
	                 _('torch'),_('medicine'),_('hunter'),_('trapper'),_('tanner'),
	                 _("charcutier"),_('iron miner'),_('coal miner'), _('sulphur miner'),  _('armourer'),
	                 _('steelworker'),_('bait'),_('cured meat'), _('scales'), _('compass'),
	                 _('scales'), _('bone spear'), _('rucksack'), _('l armour'), _('trading post'),
	                 _('lodge'), _('tannery'), _('smokehouse'), _('workshop'), _('cured meat')]; 
	delete keywords;
	
	//translate text in css by overriding attributes
	$("<style>").text('\
			div#stores:before{ content: \''+ _("stores") + '\'}\
			div#weapons:before{ content: \''+ _("weapons") + '\'}\
			div#buildBtns:before{ content: \''+ _("build:") + '\'}\
			div#craftBtns:before{ content: \''+ _("craft:") + '\'}\
			div#buyBtns:before{ content: \''+ _("buy:") + '\'}\
	').appendTo($('head'));
	
	// resize buttons so the text is not wrap
	function resizeButtons($div){
		var maxWidth = 0;
		$div.find('.button').css({
			width: "auto",
			display: "inline-block"
		}).each(function(){
			maxWidth = Math.max($(this).width(), maxWidth);
		}).css({
			display: "block",
			width: maxWidth+"px"
		});
	}
	
	parseOutsidePanel = false;
	$(document).on("DOMNodeInserted", "#outsidePanel",function(){
		resizeButtons($(this));
	});
	$(document).on("DOMNodeInserted", ".buttons",function(){
		resizeButtons($(this));
	});
	document.addEventListener("DOMNodeInserted", function(){
		if(parseOutsidePanel) return;
		else if($("#outsidePanel").length){
			resizeButtons($("#outsidePanel"));
			$('#outsidePanel')[0].addEventListener("DOMNodeInserted", resizeButtons($("#outsidePanel")));		
			parseOutsidePanel = true;
		}
	});
	
})();