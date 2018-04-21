var hotKeys= {
    'stab': {
        'keyCode': 113,
        'text': '[Q]'
    },
    'swing': {
        'keyCode': 119,
        'text': '[W]'
    },
    'slash': {
        'keyCode': 101,
        'text': '[E]'
    },
    'thrust': {
        'keyCode': 114,
        'text': '[R]'
    },
    'shoot': {
        'keyCode': 97,
        'text': '[A]'
    },
    'blast': {
        'keyCode': 115,
        'text': '[S]'
    },
    'lob': {
        'keyCode': 100,
        'text': '[D]'
    },
    'tangle': {
        'keyCode': 102,
        'text': '[F]'
    },
    'punch': {
        'keyCode': 122,
        'text': '[Z]'
    },
    'eat': {
        'keyCode': 120,
        'text': '[X]'
    },
    'meds': {
        'keyCode': 99,
        'text': '[C]'
    }
};

function bindHotKeys() {
    $('body').bind('keypress', function(e) {
        // Debug: Print keyCode
        // console.log(e.keyCode);

        // Simulate Mouse Click on Buttons.
        if(e.keyCode==hotKeys.stab.keyCode){
            // Stab Bone Spear.
            $("#attack_bone-spear").trigger("click");
        }
        if(e.keyCode==hotKeys.swing.keyCode){
            // Swing Iron Sword.
            $("#attack_iron-sword").trigger("click");
        }
        if(e.keyCode==hotKeys.slash.keyCode){
            // Slash Steel Sword.
            $("#attack_steel-sword").trigger("click");
        }
        if(e.keyCode==hotKeys.thrust.keyCode){
            // Thrust Bayonet.
            $("#attack_bayonet").trigger("click");
        }
        if(e.keyCode==hotKeys.shoot.keyCode){
            // Shoot Rifle.
            $("#attack_rifle").trigger("click");
        }
        if(e.keyCode==hotKeys.blast.keyCode){
            // Blast Laser Rifle.
            $("#attack_laser-rifle").trigger("click");
        }
        if(e.keyCode==hotKeys.lob.keyCode){
            // Lob Grenade.
            $("#attack_grenade").trigger("click");
        }
        if(e.keyCode==hotKeys.tangle.keyCode){
            // Bolas Tangle.
            $("#attack_bolas").trigger("click");
        }
        if(e.keyCode==hotKeys.punch.keyCode){
            // Punch.
            $("#attack_fist").trigger("click");
        }
        if(e.keyCode==hotKeys.eat.keyCode){
            // Eat Cured Meat.
            $("#eat").trigger("click");
        }
        if(e.keyCode==hotKeys.meds.keyCode){
            // Use Medicine.
            $("#meds").trigger("click");
        }
    });
}