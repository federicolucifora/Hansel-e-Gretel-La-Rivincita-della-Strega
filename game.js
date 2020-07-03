var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update });
function preload() {}
function create() {}
function update() {}

var player;
var cursors;
var solid;
var player_invincibile;
var checkpoint_spento;
var checkpoint1_spento;
var checkpoint2_spento;
var checkpoint_raggiunto;
var posizione_montagne;
var posizione_alberi;
var posizione_partedavanti1;
var posizione_partedietro1;
var posizione_partedavanti2;
var posizione_partedietro2;
var posizione_partedavanti3;
var posizione_partedietro3;
var vite;
var counter;
var tutorial;
var livello_singolo;
var storia = true;
var livelli;
var tavola = 1;
var hansel;
var paused = false;
var storia_finita = false;

var mission_lv1_1 = false;
var mission_lv1_2 = false;
var mission_lv1_3 = false;

var mission_lv1_2_fattibile;
var mission_lv1_3_fattibile;

var mission_lv2_1 = false;
var mission_lv2_2 = false;
var mission_lv2_3 = false;
var mission_lv2_3_fattibile;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var livello1 = {

  preload:function() {
      if (hansel == true ){
      game.load.spritesheet('dude', 'assets1/dude.png', 59, 96);
      game.load.image('loser', 'assets1/loser-01-h.png');}
      else if (hansel == false){
      game.load.spritesheet('dude', 'assets1/girl.png', 69.5, 96);
      game.load.image('loser', 'assets1/loser-01-g.png');}
      game.load.spritesheet('water', 'assets1/water.png', 736, 681);
      game.load.tilemap('mappa', 'assets1/mappa.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', 'assets1/grass-tiles-2-small.png');

      game.load.spritesheet('checkpoint', 'assets1/checkpoint.png', 36, 83);
      game.load.spritesheet('pozione', 'assets1/mela.png', 193.5,264);
      game.load.image('vita', 'assets2/ciliegia.png');
      game.load.spritesheet('realvita', 'assets1/ciliegie.png', 173 ,244);
      game.load.image('sfondovite', 'assets1/sfondovite.png');

      game.load.image('montagne', 'assets1/montagne.png');
      game.load.image('alberi', 'assets1/alberi.png');
      game.load.image('skycave', 'assets1/skycave.png');
      game.load.image('casa', 'assets1/casa.png');


      game.load.spritesheet('ghost', 'assets1/baddie.png', 48 ,25);
      game.load.image('mplatform', 'assets1/mplatform.png');
      game.load.spritesheet('tplatform', 'assets1/tplatform.png', 64, 32);
      game.load.image('dplatform', 'assets1/water.png');

      game.load.image('pausa', 'assets1/pausa.png');
      game.load.image('menu_pausa', 'assets1/menu_pausa.png');
      game.load.image('stella', 'assets1/stella_centro1.png');
  },

create:function() {
  vite = 3;
  counter = 1;
  mission_lv1_2_fattibile = true;
  mission_lv1_3_fattibile = true;
  game.world.setBounds(0, 0, 5088, 1280);

  montagne = game.add.tileSprite(0, 0, 1024, 768, 'montagne')
  montagne.fixedToCamera = true;

  alberi = game.add.tileSprite(0, 0, 1024, 768, 'alberi')
  alberi.fixedToCamera = true;
  skycave = game.add.sprite(0, 0, 'skycave')

  map = game.add.tilemap('mappa');
  map.addTilesetImage('terreno', 'tiles')
  layer = map.createLayer('livello1');
  map.setCollisionBetween(1, 100);

  solid = true;
  player_invincibile = false;

  //inseriamo la casa
  casa = game.add.sprite(6, 32*5+10, 'casa');
  game.physics.arcade.enable(casa);
  casa.width = 128; casa.height = 180;

  // aggiungiamo il corvo
  ghost = createGhost(390,322,352,460);
  ghost2 = createGhost(600,322,576,812);
  ghost3 = createGhost(57*32,322,57*32,62*32+10);
  ghost4 = createGhost(66*32,322,66*32,73*32+10);
  ghost5 = createGhost(32*69,32*33,32*69,32*81+10);
  ghost6 = createGhost(2944,1218,2944,3148);
  ghost7 = createGhost(2976,674,2976,3244);
  ghost8 = createGhost(4352,386,4352,4524);
  ghost9 = createGhost(4576,354,4576,4812);

  // aggiungiamo la piattaforma che si muove
  mplatform = createMplatform(2816,960,960,672);
  mplatform2 = createMplatform(3296,1184,1184,704);
  mplatform3 = createMplatform(4096,864,864,640);
  mplatform4 = createMplatform(4000,480,704,480);
  mplatform5 = createMplatform(4096,576,576,352);

  // aggiungiamo la piattaforma che si muove
  tplatform = createTplatform(2528,352);
  tplatform2 = createTplatform(2720,1056);
  tplatform3 = createTplatform(3392,704);
  tplatform4 = createTplatform(3552,704);
  tplatform5 = createTplatform(3712,704);

  // aggiungiamo la piattaforma che uccide
  dplatform = createDplatform(1088,416);
  g.width = 736; g.height = 32;
  dplatform2 = createDplatform(105*32,40*32);
  g.width = 22*32; g.height = 5;

  // aggiungiamo la pozione
  pozione = createPozione(41*32,4*32);
  pozione2 = createPozione(75*32,34*32);

  // The checkpoint and its settings
  checkpoint_spento = true;
  checkpoint = game.add.sprite(2410, 238, 'checkpoint');
  game.physics.arcade.enable(checkpoint);
  checkpoint.animations.add('acceso', [1], 1, true);
  checkpoint.animations.add('spento', [0], 1, true);

  // The player and its settings
  invincible = false;
  player = game.add.sprite(5*32, 250, 'dude');
  if (hansel == true){
    player.width = 34; player.height = 50;
  }
  else if (hansel == false){
    player.width = 35; player.height = 48;
  }
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 700;
  player.animations.add('left', [0, 1, 2, 3], 8, true);
  player.animations.add('right', [5, 6, 7, 8], 8, true);

  water = game.add.sprite(34*32, 11*32+10, 'water');
  water.animations.add('moving', [0, 1, 2, 3], 4, true);
  water.animations.play('moving');

  sfondovite = game.add.sprite(16, 32, 'sfondovite');
  sfondovite.fixedToCamera = true;
  sfondovite.width = 200;
  sfondovite.height = 42;

  // aggiungiamo la vita
  vita = createVita(1*32+13.5, 39.5);
  vita2 = createVita(2*32+13.5, 39.5);
  vita3 = createVita(3*32+13, 39.5);
  vita4 = createVita(4*32+12.5, 39.5);
  vita5 = createVita(5*32+12, 39.5);

  // aggiungiamo la vita nel livello

  realvita2 = createRealvita(68*32, 30*32);
  realvita3 = createRealvita(96*32, 29*32);
  realvita4 = createRealvita(125*32, 9*32);
  realvita = createRealvita(67*32, 9*32);

  // pulsante per mettere in pausa
  pause_label = game.add.sprite(930, 27, 'pausa');
  pause_label.width = 50; pause_label.height = 50;
  pause_label.fixedToCamera = true;
  pause_label.inputEnabled = true;
  pause_label.events.onInputUp.add(function () {
      game.paused = true;
      menu_pausa = game.add.sprite(game.camera.x, game.camera.y, 'menu_pausa');
      if(mission_lv1_1 == true)
      {stella =game.add.sprite(game.camera.x+50, game.camera.y+231, 'stella')
       stella.width = 66; stella.height = 64.5};
      if(mission_lv1_2 == true)
      {stella2 = game.add.sprite(game.camera.x+50, game.camera.y+399, 'stella')
       stella2.width = 66; stella2.height = 64.5};
      if(mission_lv1_3 == true)
      {stella3 = game.add.sprite(game.camera.x+50, game.camera.y+565, 'stella')
       stella3.width = 66; stella3.height = 64.5};
   });
   // gioco in pausa
      game.input.onDown.add(unpause, self);
      function unpause(event){
          if(game.paused){
            if(event.x > 833 && event.x < 911 && event.y > 127 && event.y < 213 ){
                menu_pausa.destroy();
                if (mission_lv1_1 == true){
                  stella.destroy();}
                if (mission_lv1_2 == true){
                  stella2.destroy();}
                if(mission_lv1_3 == true){
                  stella3.destroy();}
                game.paused = false;
              }
            else if (event.x > 833 && event.x < 911 && event.y > 357 && event.y < 424 ){
              menu_pausa.destroy();
              if (mission_lv1_1 == true){
                stella.destroy();}
              if (mission_lv1_2 == true){
                stella2.destroy();}
              if(mission_lv1_3 == true){
                stella3.destroy();}
              game.paused = false;
              game.state.restart();
            }
            else if (event.x > 833 && event.x < 911 && event.y > 564 && event.y < 636 ){
              menu_pausa.destroy();
              if (mission_lv1_1 == true){
                stella.destroy();}
              if (mission_lv1_2 == true){
                stella2.destroy();}
              if(mission_lv1_3 == true){
                stella3.destroy();}
              game.paused = false;
              game.state.start('main_menu');
            }
          }
      };

  loser = game.add.sprite(0, 0, 'loser');
  loser.fixedToCamera =true;
  loser.alpha=0;

  cursors = game.input.keyboard.createCursorKeys()
  game.input.keyboard.addKey(Phaser.Keyboard.A);
  game.input.keyboard.addKey(Phaser.Keyboard.D);
  game.input.keyboard.addKey(Phaser.Keyboard.W);

  game.camera.follow(player);
},

////////////////////////////////////////////////////////////////////////////////
update:function() {

  if (player.x > 4958){
  mission_lv1_1 = true;
  if (mission_lv1_2_fattibile == true){
  mission_lv1_2 = true;}
  if (mission_lv1_3_fattibile == true){
  mission_lv1_3 = true;}
  game.state.start('evento_2')}
  if (player.x > 4958 && livello_singolo == true){
  game.state.start('livelli')}

      if (player.position.x> 32*16)
      {montagne.tilePosition.x = -1200*(player.x/5088);}
      else montagne.tilePosition.x= -1200*(32*16/5088);

      if (player.position.x> 32*16)
      {alberi.tilePosition.x = -2000*(player.x/5088);}
      else alberi.tilePosition.x= -2000*(32*16/5088);

      montagne.x = posizione_montagne;
      alberi.x = posizione_alberi;

    //ghost
    updateGhost(ghost);
    updateGhost(ghost2);
    updateGhost(ghost3);
    updateGhost(ghost4);
    updateGhost(ghost5);
    updateGhost(ghost6);
    updateGhost(ghost7);
    updateGhost(ghost8);
    updateGhost(ghost9);

    //mplatform
    updateMplatform(mplatform);
    updateMplatform(mplatform2);
    updateMplatform(mplatform3);
    updateMplatform(mplatform4);
    updateMplatform(mplatform5);

    //tplatform
    updateTplatform(tplatform);
    updateTplatform(tplatform2);
    updateTplatform(tplatform3);
    updateTplatform(tplatform4);
    updateTplatform(tplatform5);

    //dplatform
    updateDplatform(dplatform);
    updateDplatform(dplatform2);

    //pozione
    updatePozione(pozione);
    updatePozione(pozione2);

    //vita
    updateVita1(vita);
    updateVita1(vita2);
    updateVita1(vita3);
    updateVita1(vita4);
    updateVita1(vita5);

    //realvita
    updateRealvita(realvita);
    updateRealvita(realvita2);
    updateRealvita(realvita3);
    updateRealvita(realvita4);

    //funzione morte da nemico
    game.physics.arcade.overlap(ghost, player, function(g,pl) {
      player.body.touching.down = false;
      if(invincible==true)
      {g.kill()}
      else if(solid==true)
      {pl.kill()};
    });

    //checkpoint respawn
      if(player.alive == false && checkpoint_spento == true) {
        game.time.events.add(Phaser.Timer.SECOND * 0.3, function(){
          tplatform.reset(2528,352);
          tplatform2.reset(2720,1056);
          tplatform3.reset(3392,704);
          tplatform4.reset(3552,704);
          tplatform5.reset(3712,704);
          player.reset(5*32, 250);
          counter = 1;
        })
      }
      if (player.alive == false && checkpoint_spento == false){
        game.time.events.add(Phaser.Timer.SECOND * 0.3, function(){
          player.reset(76*32, 240);
          counter = 1;
          tplatform.reset(2528,352);
          tplatform2.reset(2720,1056);
          tplatform3.reset(3392,704);
          tplatform4.reset(3552,704);
          tplatform5.reset(3712,704);
        })
      }


    //checkpoint function on/off
     game.physics.arcade.overlap(player, checkpoint, function (){
       player.body.touching.down = false;
       if (vite != 0){
      checkpoint_spento = false;}
     });
     if (checkpoint_spento == true) {
      checkpoint.animations.play('spento');
     }
     else if (checkpoint_spento == false) {
      checkpoint.animations.play('acceso');
     }

     if (player.alive == false && vite == 0) {
       checkpoint_spento = true;
     }

     // movimento personaggio
     hitLayer = game.physics.arcade.collide(player, layer);
     player.body.velocity.x = 0;
     if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A))  {
          //  Move to the left
          player.body.velocity.x = -200;
          player.animations.play('left');
      }
     else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
          //  Move to the right
          player.body.velocity.x = 200;
          player.animations.play('right');
      }
     else {
          //  Stand still
          player.animations.stop();
          player.frame = 4;
      }
      if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)){
      if (player.body.onFloor() || player.body.touching.down)    {
          player.body.velocity.y = -330;
      }
    }
},

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGhost(x,y,leftLimit, rightLimit) {
  g = game.add.sprite(x,y,'ghost');
  g.width = 48; g.height = 25;
  g.anchor.setTo(0.5, 0);
  g.animations.add('leftg', [0, 1, 2, 3], 10, true);
  g.animations.add('rightg', [4, 5, 6, 7], 10, true);
  game.physics.arcade.enable(g);
  g.body.velocity.x = 100;
  g.leftLimit = leftLimit;
  g.rightLimit = rightLimit;
  g.animations.play('leftg');
  return g;
}


function updateGhost(ghost) {
  if(ghost.x <= ghost.leftLimit+24) {
    ghost.body.velocity.x = 100;
    ghost.scale.x = 1;
} else if (ghost.x >= ghost.rightLimit+24) {
    ghost.body.velocity.x = -100;
    ghost.scale.x = -1;
  }
  game.physics.arcade.overlap(ghost, player, function(e,p) {
    player.body.touching.down = false;
    if(player_invincibile == false)
              p.kill();
  })
}

// funzione per creazione piattaforma che si muove
function createMplatform(x,y,topLimit, bottomLimit) {
  g = game.add.sprite(x,y,'mplatform');
  g.width = 96; g.height = 32;
  game.physics.arcade.enable(g);
  g.body.velocity.y = 100;
  g.topLimit = topLimit;
  g.bottomLimit = bottomLimit;
  g.body.immovable = true;
  return g;
}

function updateMplatform(mplatform) {
  hitmplatform = game.physics.arcade.collide(player, mplatform);
  if(mplatform.y <= mplatform.bottomLimit) {
    mplatform.body.velocity.y = 70;
  } else if (mplatform.y >= mplatform.topLimit) {
    mplatform.body.velocity.y = -70;
  }

  if (hitmplatform && mplatform.body.touching.down && hitLayer) {
    player.kill();
  }
}

// funzione per creazione piattaforma a tempo
function createTplatform(x,y) {
  g = game.add.sprite(x,y,'tplatform');
  g.width = 64; g.height = 32;
  g.animations.add('aggiustata', [0], 1, true);
  g.animations.add('rotta', [1], 1, true);
  game.physics.arcade.enable(g);
  g.body.immovable = true;
  return g;
}

//scomparsa piattaforma a tempo
function updateTplatform(tplatform) {
game.physics.arcade.collide(player, tplatform, function(pl,tp) {
game.time.events.add(Phaser.Timer.SECOND *0.2, function(){
tp.animations.play('rotta');
})
game.time.events.add(Phaser.Timer.SECOND *1, function(){
  tp.animations.play('aggiustata')
  tp.kill();
})  })
}

// funzione per creazione lava
function createDplatform(x,y) {
  g = game.add.sprite(x,y,'dplatform');
  game.physics.arcade.enable(g);
  g.body.immovable = true;
  g.alpha =1;
  return g;
}

//funzione lava
function updateDplatform(dplatform) {
game.physics.arcade.collide(dplatform, player, function(pl,dp){
  dp.kill();
 })
}

// funzione creazione pozione
function createPozione(x,y) {
g = game.add.sprite(x,y,'pozione')
g.width = 30; g.height = 42;
game.physics.arcade.enable(g);
g.animations.add('moving', [0, 1, 2, 3], 4, true);
g.animations.play('moving')
return g;
}

//invincibilità pozione
function updatePozione(pozione) {
  game.physics.arcade.collide(player, pozione, function(player, pozione) {
      player.body.touching.down = false;
      pozione.kill();
      player_invincibile = true;
      player.alpha = 0.5;
      game.time.events.add(Phaser.Timer.SECOND * 7, function(){
      player_invincibile = false;
      player.alpha = 1;
      })
  })
  }

  // funzione creazione vita \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  function createVita(x,y) {
  vita = game.add.sprite(x,y,'vita');
  vita.fixedToCamera = true;
  vita.width = 19; vita.height = 28;
  game.physics.arcade.enable(vita);
  return vita;
  }

  function updateVita1(vita) {
    if (vite == 0) {
     loser.alpha=1;
     game.time.events.add(Phaser.Timer.SECOND * 4, function(){
     game.state.restart('livello1');
     loser.alpha=0;
   })
 }

    else if (vite == 1) {
      vita.alpha = 1;
      vita2.alpha = 0;
      vita3.alpha = 0;
      vita4.alpha = 0;
      vita5.alpha = 0;
    }
    else if (vite == 2) {
      vita.alpha = 1;
      vita2.alpha = 1;
      vita3.alpha = 0;
      vita4.alpha = 0;
      vita5.alpha = 0;
    }
    else if (vite == 3) {
      vita.alpha = 1;
      vita2.alpha = 1;
      vita3.alpha = 1;
      vita4.alpha = 0;
      vita5.alpha = 0;
    }
    else if (vite == 4) {
      vita.alpha = 1;
      vita2.alpha = 1;
      vita3.alpha = 1;
      vita4.alpha = 1;
      vita5.alpha = 0;
    }
    else if (vite == 5) {
      vita.alpha = 1;
      vita2.alpha = 1;
      vita3.alpha = 1;
      vita4.alpha = 1;
      vita5.alpha = 1;
    }
  }















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var livello2 = {
 preload:function() {
   if (hansel == true ){
   game.load.spritesheet('dude', 'assets2/dude.png', 59, 96);
   game.load.spritesheet('prigioniero', 'assets2/girl.png', 69.5, 96);
   game.load.image('loser', 'assets2/loser-02-h.png')
   game.load.image('menu_pausa', 'assets2/menu_pausa-h.png');}
   else if (hansel == false){
   game.load.spritesheet('dude', 'assets2/girl.png', 69.5, 96);
   game.load.spritesheet('prigioniero', 'assets2/dude.png', 59, 96);
   game.load.image('loser', 'assets2/loser-02-g.png')
   game.load.image('menu_pausa', 'assets2/menu_pausa-g.png');}
   game.load.image('stella', 'assets2/stella_centro1.png');

   game.load.image('pausa', 'assets2/pausa.png');
   game.load.spritesheet('strega', 'assets2/strega.png', 48, 96);
   game.load.tilemap('mappa', 'assets2/mappa2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets2/tiles.png');
    game.load.image('gabbia', 'assets2/gabbia.png');

    game.load.image('partedavanti1', 'assets2/partedavanti1.png');
    game.load.image('partedietro1', 'assets2/partedietro1.png');
    game.load.image('partedavanti2', 'assets2/partedavanti2.png');
    game.load.image('partedietro2', 'assets2/partedietro2.png');
    game.load.image('partedavanti3', 'assets2/partedavanti3.png');
    game.load.image('partedietro3', 'assets2/partedietro3.png');
    game.load.image('stanzafinale', 'assets2/stanzafinale.png');

    game.load.image('mplatform', 'assets2/mplatform.png');
    game.load.image('splatform', 'assets2/splatform.png');
    game.load.image('rplatform', 'assets2/rplatform.png');

    game.load.spritesheet('dplatform', 'assets2/cioccolata.png', 1664, 64);
    game.load.spritesheet('cioccolata', 'assets2/cioccolata.png', 9*32, 64);
    game.load.image('lindor', 'assets2/lindor.png');
    game.load.image('trapano', 'assets2/lecca_lecca.png');
    game.load.image('trapano2', 'assets2/lecca_lecca2.png');

    game.load.spritesheet('checkpoint', 'assets2/checkpoint.png', 36, 83);
    game.load.image('porta_on', 'assets2/porta_on.png');
    game.load.image('porta_off', 'assets2/porta_off.png');

    game.load.image('sfondovite', 'assets2/sfondovite.png');
    game.load.spritesheet('realvita', 'assets1/ciliegie.png', 173 ,244);
    game.load.image('vita', 'assets2/ciliegia.png');
},

////////////////////////////////////////////////////////////////////////////////

create:function() {
    vite = 3;
    counter = 1;
    mission_lv2_3_fattibile = true;
    checkpoint_raggiunto = 0;
    comandi_off = false;
    solid = true;
    player_invincibile = false;

    game.world.setBounds(0, 0, 7344, 1280);

    partedietro1 = game.add.tileSprite(0, 0, 1024, 768, 'partedietro1')
    partedietro1.fixedToCamera = true;

    partedavanti1 = game.add.tileSprite(0, 0, 1024, 768, 'partedavanti1')
    partedavanti1.fixedToCamera = true;

    partedietro2 = game.add.tileSprite(0, 0, 1024, 768, 'partedietro2')
    partedietro2.fixedToCamera = true;

    partedavanti2 = game.add.tileSprite(0, 0, 1024, 768, 'partedavanti2')
    partedavanti2.fixedToCamera = true;

    partedietro3 = game.add.tileSprite(0, 200, 1024, 768, 'partedietro3')
    partedietro3.fixedToCamera = true;

    partedavanti3 = game.add.tileSprite(0, 200, 1024, 768, 'partedavanti3')
    partedavanti3.fixedToCamera = true;

    stanzafinale = game.add.sprite(203*32, 0, 'stanzafinale')
    stanzafinale.width = 21*32; stanzafinale.height = 40*32;

    trapano = createTrapano(125*32+8,21*32,23.5*32,17*32);
    trapano2 = createTrapano(131*32+8,22*32,23.5*32,17*32);
    trapano3 = createTrapano(138*32+8,17*32,23.5*32,17*32);
    trapano4 = createTrapano(144*32+8,15*32,23.5*32,17*32);

    doppiotrapano_up = createdoppioTrapano_up(153*32+8, 36*32, 36*32, 32*32);
    doppiotrapano_down = createdoppioTrapano_down(153*32+8, 15*32, 19*32, 15*32);
    doppiotrapano_up2 = createdoppioTrapano_up(156*32+8, 35*32, 36*32, 32*32);
    doppiotrapano_down2 = createdoppioTrapano_down(156*32+8, 16*32, 19*32, 15*32);
    doppiotrapano_up3 = createdoppioTrapano_up(159*32+8, 34*32, 36*32, 32*32);
    doppiotrapano_down3 = createdoppioTrapano_down(159*32+8, 17*32, 19*32, 15*32);
    doppiotrapano_up4 = createdoppioTrapano_up(162*32+8, 33*32, 36*32, 32*32);
    doppiotrapano_down4 = createdoppioTrapano_down(162*32+8, 18*32, 19*32, 15*32);
    doppiotrapano_up5 = createdoppioTrapano_up(165*32+8, 32*32, 36*32, 32*32);
    doppiotrapano_down5 = createdoppioTrapano_down(165*32+8, 19*32, 19*32, 15*32);

    map = game.add.tilemap('mappa');
    map.addTilesetImage('terreno', 'tiles');
    layer = map.createLayer('livello1');
    map.setCollisionBetween(1, 100);

    // aggiungiamo la piattaforma che si muove verticalmente \\\\\\\\\\\\\\\\\\
    mplatform = createMplatform(62*32, 37*32, 38*32+20, 34*32);
    mplatform2 = createMplatform(67*32, 35*32, 38*32+20, 34*32);

    // aggiungiamo la piattaforma che si muove orizzontalmente \\\\\\\\\\\\\\\\
    splatform = createSplatform(34*32,35*32,34*32,37*32);
    splatform2 = createSplatform(43*32,35*32,43*32,47*32);

    // aggiungiamo teletrasporto \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    porta_on = createPorta_on(79*32-5,30*32+6);
    porta_on2 = createPorta_on(79*32-5,35*32+6);
    porta_on3 = createPorta_on(174*32-5,10*32+6);
    porta_on4 = createPorta_on(174*32-5,33*32+6);

    // aggiungiamo teletrasporto \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    porta_off = createPorta_off(108*32+5,10*32+6);
    porta_off2 = createPorta_off(108*32+5,33*32+6);
    porta_off3 = createPorta_off(203*32+5,14*32+6);

    // aggiungiamo i lindor \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    lindor = createLindor(116*32,14*32,14.5*32,10*32);
    lindor2 = createLindor(125*32,10*32,14.5*32,10*32);
    lindor3 = createLindor(127*32,5*32,14.5*32,10*32);

    // aggiungiamo la piattaforma che si muove a rombo \\\\\\\\\\\\\\\\\\\\\\\\
    rplatform = createRplatform(140*32, 12*32, 132*32, 140*32, 15*32, 9*32)
    rplatform2 = createRplatform(132*32, 12*32, 132*32, 140*32, 15*32, 9*32)
    rplatform3 = createRplatform(136*32, 15*32, 132*32, 140*32, 15*32, 9*32)
    rplatform4 = createRplatform(136*32, 9*32, 132*32, 140*32, 15*32, 9*32)

    rplatform_rev = createRplatform_rev(144*32, 10*32, 144*32, 152*32, 13*32, 7*32)
    rplatform_rev2 = createRplatform_rev(152*32, 10*32, 144*32, 152*32, 13*32, 7*32)

    rplatform5 = createRplatform(160*32, 9*32, 156*32, 164*32, 15*32, 9*32)
    rplatform6 = createRplatform(160*32, 15*32, 156*32, 164*32, 15*32, 9*32)
    rplatform7 = createRplatform(156*32, 12*32, 156*32, 164*32, 15*32, 9*32)
    rplatform8 = createRplatform(164*32, 12*32, 156*32, 164*32, 15*32, 9*32)

    // aggiungiamo la piattaforma che uccide \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    dplatform = createDplatform(17*32,38*32);
    g.width = 57*32; g.height = 64;
    dplatform2 = createDplatform(115*32,14*32);
    g.width = 52*32; g.height = 64;
    dplatform3 = createDplatform(121*32,39*32+30);
    g.width = 52*32; g.height = 2;
    g.alpha = 0;


    // The checkpoint and its settings \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    checkpoint1_spento = true;
    checkpoint2_spento = true;

    //funzione creazione checkpoint sotto
    checkpoint1 = game.add.sprite(113*32, 33.4*32, 'checkpoint');
    game.physics.arcade.enable(checkpoint1);
    checkpoint1.animations.add('acceso', [1], 1, true);
    checkpoint1.animations.add('spento', [0], 1, true);

    //funzione creazione checkpoint sopra
    checkpoint2 = game.add.sprite(113*32, 10.4*32, 'checkpoint');
    game.physics.arcade.enable(checkpoint2);
    checkpoint2.animations.add('acceso', [1], 1, true);
    checkpoint2.animations.add('spento', [0], 1, true);


    // aggiungiamo la vita nel livello
    realvita2 = createRealvita(68*32, 30*32);
    realvita3 = createRealvita(123*32, 11*32);
    realvita4 = createRealvita(148*32+16, 5*32);
    realvita5 = createRealvita(137*32, 34*32);
    realvita6 = createRealvita(149*32, 31*32);
    realvita = createRealvita(50*32, 36*32);

    // The player and its settings \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    invincible = false;
    player = game.add.sprite(1*32, 35*32, 'dude');
    game.physics.arcade.enable(player);
    if (hansel == true){
      player.width = 34; player.height = 50;}
    else if (hansel == false){
      player.width = 35; player.height = 48;};
    player.body.gravity.y = 700;
    player.animations.add('left', [0, 1, 2, 3], 7, true);
    player.animations.add('right', [5, 6, 7, 8], 7, true);

    // prigioniero
    prigioniero = game.add.sprite(206*32+10, 26*32, 'prigioniero');
    game.physics.arcade.enable(prigioniero);
    prigioniero.animations.add('fermo', [4], 1, true);
    prigioniero.animations.play('fermo');
    if (hansel == true){
      prigioniero.width = 34; prigioniero.height = 50;}
    else if (hansel == false){
      prigioniero.width = 35; prigioniero.height = 48;};

    // gabbia
    gabbia = game.add.sprite(6570.837 , 780.939,'gabbia');
    gabbia.width = 87.66; gabbia.height = 156.031;

    // strega
    g = game.add.sprite(218*32, 32*32+26,'strega');
    g.width = 40; g.height = 70;
    g.animations.add('leftg', [0, 1, 2, 3], 8, true);
    g.animations.add('rightg', [5, 6, 7, 8], 8, true);
    g.animations.add('paura', [4, 9], 6, true);
    game.physics.arcade.enable(g);
    g.body.gravity.y = 700;
    g.body.velocity.x = 100;
    g.leftLimit = 218*32;
    g.rightLimit = 221*32;

    cioccolata = game.add.sprite(209*32, 38*32, 'cioccolata');
    cioccolata.animations.add('moving', [0, 1, 2, 3], 4, true);
    cioccolata.animations.play('moving');

    sfondovite = game.add.sprite(16, 32, 'sfondovite');
    sfondovite.fixedToCamera = true;
    sfondovite.width = 200;
    sfondovite.height = 42;

    // aggiungiamo la vita \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    vita = createVita(1*32+13.5, 39.5);
    vita2 = createVita(2*32+13.5, 39.5);
    vita3 = createVita(3*32+13, 39.5);
    vita4 = createVita(4*32+12.5, 39.5);
    vita5 = createVita(5*32+12, 39.5);

    loser = game.add.sprite(0, 0, 'loser');
    loser.fixedToCamera =true;
    loser.alpha=0;

    // pulsante per mettere in pausa
    pause_label = game.add.sprite(930, 27, 'pausa');
    pause_label.width = 50; pause_label.height = 50;
    pause_label.fixedToCamera = true;
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        game.paused = true;
        menu_pausa = game.add.sprite(game.camera.x, game.camera.y, 'menu_pausa');
        if(mission_lv2_1 == true)
        {stella = game.add.sprite(game.camera.x+50, game.camera.y+231, 'stella')
         stella.width = 66; stella.height = 64.5};
        if(mission_lv2_2 == true)
        {stella2 = game.add.sprite(game.camera.x+50, game.camera.y+399, 'stella')
         stella2.width = 66; stella2.height = 64.5};
        if(mission_lv2_3 == true)
        {stella3 = game.add.sprite(game.camera.x+50, game.camera.y+565, 'stella')
         stella3.width = 66; stella3.height = 64.5};
     });
     // gioco in pausa
        game.input.onDown.add(unpause, self);
        function unpause(event){
            if(game.paused){
              if(event.x > 833 && event.x < 911 && event.y > 127 && event.y < 213 ){
                  menu_pausa.destroy();
                  if (mission_lv2_1 == true){
                    stella.destroy();}
                  if (mission_lv2_2 == true){
                    stella2.destroy();}
                  if(mission_lv2_3 == true){
                    stella3.destroy();}
                  game.paused = false;
                }
              else if (event.x > 833 && event.x < 911 && event.y > 357 && event.y < 424 ){
                menu_pausa.destroy();
                if (mission_lv2_1 == true){
                  stella.destroy();}
                if (mission_lv2_2 == true){
                  stella2.destroy();}
                if(mission_lv2_3 == true){
                  stella3.destroy();}
                game.paused = false;
                game.state.restart();
              }
              else if (event.x > 833 && event.x < 911 && event.y > 564 && event.y < 636 ){
                menu_pausa.destroy();
                if (mission_lv2_1 == true){
                  stella.destroy();}
                if (mission_lv2_2 == true){
                  stella2.destroy();}
                if(mission_lv2_3 == true){
                  stella3.destroy();}
                game.paused = false;
                game.state.start('main_menu');
              }
            }
        };

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKey(Phaser.Keyboard.A);
    game.input.keyboard.addKey(Phaser.Keyboard.D);
    game.input.keyboard.addKey(Phaser.Keyboard.W);

    game.camera.follow(player);
},

////////////////////////////////////////////////////////////////////////////////

update:function(){

  if (player.x >= g.rightLimit && player.y >= 32*32){
  if(vite == 1){
    mission_lv2_2 = true; }
  if(mission_lv2_3_fattibile == true){
    mission_lv2_3 = true;  }
  comandi_off = true;
  mission_lv2_1 = true;
  game.time.events.add(Phaser.Timer.SECOND * 2, function(){
  game.state.start('evento_3');
  })}
  if (player.x >= g.rightLimit && player.y >= 32*32 && livello_singolo == true){
  game.time.events.add(Phaser.Timer.SECOND * 2, function(){
  game.state.start('livelli')})}

  // movimento strega
  game.physics.arcade.collide(g, layer);
  if(g.x <= g.leftLimit) {
    g.body.velocity.x = 100;
    g.animations.play('rightg');
  }
  else if (g.x >= g.rightLimit) {
    g.body.velocity.x = -100;
    g.animations.play('leftg');
  }
  else if (player.x >= g.rightLimit && player.y >= 32*32 && g.body.onFloor()) {
    g.body.velocity.x = 0;
    g.body.velocity.y = -100;
    g.animations.play('paura');
  }


  //parallasse
  if (player.position.x> 32*16)
  {partedavanti1.tilePosition.x = -2000*(player.x/5088);}
  else partedavanti1.tilePosition.x= -2000*(32*16/5088);

  if (player.position.x> 32*16)
  {partedietro1.tilePosition.x = -1600*(player.x/5088);}
  else partedietro1.tilePosition.x= -1600*(32*16/5088);

  if (player.position.x<3156) {
    partedavanti1.alpha=1;
    partedietro1.alpha=1;
  }
  else {
    partedavanti1.alpha=0;
    partedietro1.alpha=0;
  }

  partedavanti1.x = posizione_partedavanti1;
  partedietro1.x = posizione_partedietro1;


  if (player.position.x> 3156 && player.position.y<640 && player.position.x<6496) {
    partedavanti2.tilePosition.x = -2000*((player.x-3156)/5088);
    partedavanti2.alpha=1;
  }
  else partedavanti2.alpha=0;

  if (player.position.x> 3156 && player.position.y<640 && player.position.x<6496) {
    partedietro2.tilePosition.x = -1600*((player.x-3156)/5088);
    partedietro2.alpha=1;
  }
  else partedietro2.alpha=0;

  partedavanti2.x = posizione_partedavanti2;
  partedietro2.x = posizione_partedietro2;


  if (player.position.x> 3156 && player.position.y > 640 && player.position.x<6496) {
    partedavanti3.alpha=1;
    partedavanti3.tilePosition.x = -2000*((player.x-3156)/5088);
  }
  else partedavanti3.alpha=0;

  if (player.position.x> 3156 && player.position.y > 640 && player.position.x<6496) {
    partedietro3.tilePosition.x = -1600*((player.x-3156)/5088);
    partedietro3.alpha=1;
  }
  else partedietro3.alpha=0;

  partedavanti3.x = posizione_partedavanti3;
  partedietro3.x = posizione_partedietro3;

  updateRplatform(rplatform);
  updateRplatform(rplatform2);
  updateRplatform(rplatform3);
  updateRplatform(rplatform4);

  updateRplatform_rev(rplatform_rev);
  updateRplatform_rev(rplatform_rev2);

  updateRplatform(rplatform5);
  updateRplatform(rplatform6);
  updateRplatform(rplatform7);
  updateRplatform(rplatform8);

  //Trapano
  updateTrapano(trapano);
  updateTrapano(trapano2);
  updateTrapano(trapano3);
  updateTrapano(trapano4);

  //mplatform
  updateMplatform(mplatform);
  updateMplatform(mplatform2);

  //splatform
  updateSplatform(splatform);
  updateSplatform(splatform2);

  //dplatform
  updateDplatform(dplatform);
  updateDplatform(dplatform2);
  updateDplatform(dplatform3);


  //lindor
  updateLindor(lindor);
  updateLindor(lindor2);
  updateLindor(lindor3);

  // doppio trapono
  updatedoppioTrapano_up(doppiotrapano_up);
  updatedoppioTrapano_down(doppiotrapano_down);
  updatedoppioTrapano_up(doppiotrapano_up2);
  updatedoppioTrapano_down(doppiotrapano_down2);
  updatedoppioTrapano_up(doppiotrapano_up3);
  updatedoppioTrapano_down(doppiotrapano_down3);
  updatedoppioTrapano_up(doppiotrapano_up4);
  updatedoppioTrapano_down(doppiotrapano_down4);
  updatedoppioTrapano_up(doppiotrapano_up5);
  updatedoppioTrapano_down(doppiotrapano_down5);

  //vita
  updateVita2(vita);
  updateVita2(vita2);
  updateVita2(vita3);
  updateVita2(vita4);
  updateVita2(vita5);

  //realvita
  updateRealvita(realvita2);
  updateRealvita(realvita3);
  updateRealvita(realvita4);
  updateRealvita(realvita5);
  updateRealvita(realvita6);
  updateRealvita(realvita);

  //checkpoint1
  if (player.alive == false && checkpoint_raggiunto == 1){
    game.time.events.add(Phaser.Timer.SECOND * 0.3, function(){
      player.reset(112*32, 34*32);
      counter = 1;
    })
  }
  else if (player.alive == false && checkpoint_raggiunto == 2 ){
    game.time.events.add(Phaser.Timer.SECOND * 0.3, function(){
      player.reset(112*32, 11*32);
      counter = 1;
    })
  }
  else if (player.alive == false && checkpoint_raggiunto == 0) {
    game.time.events.add(Phaser.Timer.SECOND * 0.3, function(){
      player.reset(1*32, 35*32);
      counter = 1;
    })
  }

  //checkpoint1 function on/off
  game.physics.arcade.overlap(player, checkpoint1, function (){
   player.body.touching.down = false;
   checkpoint1_spento = false;
   checkpoint_raggiunto = 1;
  });
  if (checkpoint1_spento == true) {
   checkpoint1.animations.play('spento');
  }
  if (checkpoint1_spento == false) {
   checkpoint1.animations.play('acceso');
  }

  //checkpoint2 function on/off
  game.physics.arcade.overlap(player, checkpoint2, function (){
   player.body.touching.down = false;
   checkpoint2_spento = false;
   checkpoint_raggiunto = 2;
  });
  if (checkpoint2_spento == true) {
   checkpoint2.animations.play('spento');
  }
  if (checkpoint2_spento == false) {
   checkpoint2.animations.play('acceso');
  }

   // movimento personaggio
   hitLayer = game.physics.arcade.collide(player, layer);
   player.body.velocity.x = 0;
   if(comandi_off == false) {
   if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A))  {

        player.body.velocity.x = -200;
        player.animations.play('left');
    }
   else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {

        player.body.velocity.x = 200;
        player.animations.play('right');
    }
   else {
        player.animations.stop();
        player.frame = 4;
    }
    if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        if(player.body.onFloor() || player.body.touching.down) {
            player.body.velocity.y = -330;
      }
    }
  }

// funzione teletrasporto strada sotto
  game.physics.arcade.overlap(player, porta_on, function() {
    if (player.x >= 79*32+10){
    player.reset(109*32, 34*32);
  }
  })
// funzione teletrasporto strada sopra
  game.physics.arcade.overlap(player, porta_on2, function() {
    if (player.x >= 79*32+10){
    player.reset(109*32, 11*32);
  }
  })
// funzione teletrasporto ultima stanza
  game.physics.arcade.overlap(player, porta_on3, function() {
      player.reset(204*32, 15*32);
  })
  game.physics.arcade.overlap(player, porta_on4 , function() {
      player.reset(204*32, 15*32);
  })
  }
}

////////////////////////////////////////////////////////////////////////////////
// funzione per creazione trapano
function createTrapano(x,y,topLimit, bottomLimit) {
  g = game.add.sprite(x,y,'trapano');
  g.width = 80; g.height = 12*32;
  game.physics.arcade.enable(g);
  g.body.velocity.y = 70;
  g.topLimit = topLimit;
  g.bottomLimit = bottomLimit;
  g.body.immovable = true;
  return g;
}

function updateTrapano(trapano) {
  if(trapano.y <= trapano.bottomLimit) {
    trapano.body.velocity.y = 1000;
  } else if (trapano.y >= trapano.topLimit) {
    trapano.body.velocity.y = - Math.random()* ((100-60)+1)-60 ;
  }
  game.physics.arcade.collide(player, trapano, function(pl,tr){
    if (trapano.body.velocity.y == 1000 && trapano.y >= 690)
    pl.kill();
   })
  }

  // funzione per creazione trapano
  function createdoppioTrapano_down(x,y,topLimit, bottomLimit) {
    g = game.add.sprite(x,y,'trapano');
    g.width = 80; g.height = 12*32;
    game.physics.arcade.enable(g);
    g.body.velocity.y = -80;
    g.topLimit = topLimit;
    g.bottomLimit = bottomLimit;
    g.body.immovable = true;
    return g;
  }

  function updatedoppioTrapano_down(doppiotrapano_down) {
    if(doppiotrapano_down.y <= doppiotrapano_down.bottomLimit) {
      doppiotrapano_down.body.velocity.y = 1000;
    } else if (doppiotrapano_down.y >= doppiotrapano_down.topLimit) {
      doppiotrapano_down.body.velocity.y = -80;
    }
    game.physics.arcade.collide(player, doppiotrapano_down, function(){})
  }


    function createdoppioTrapano_up(x,y,topLimit, bottomLimit) {
      g = game.add.sprite(x,y,'trapano2');
      g.width = 80; g.height = 12*32;
      game.physics.arcade.enable(g);
      g.body.velocity.y = 80;
      g.topLimit = topLimit;
      g.bottomLimit = bottomLimit;
      g.body.immovable = true;
      return g;
    }

    function updatedoppioTrapano_up(doppiotrapano_up) {
      if(doppiotrapano_up.y <= doppiotrapano_up.bottomLimit) {
        doppiotrapano_up.body.velocity.y = 80;
      } else if (doppiotrapano_up.y >= doppiotrapano_up.topLimit) {
        doppiotrapano_up.body.velocity.y = -1000;
      }
      game.physics.arcade.collide(player, doppiotrapano_up, function(pl,tr){
        if (doppiotrapano_up.y <= 33*32 && player.body.touching.down )
        pl.kill();
       })
      }

// funzione per creazione piattaforma che si muove verticalmente //////////////
function createMplatform(x,y,topLimit, bottomLimit) {
  g = game.add.sprite(x,y,'mplatform');
  g.width = 96; g.height = 32;
  game.physics.arcade.enable(g);
  g.body.velocity.y = 70;
  g.topLimit = topLimit;
  g.bottomLimit = bottomLimit;
  g.body.immovable = true;
  return g;
}

function updateMplatform(mplatform) {
hitmplatform = game.physics.arcade.collide(player, mplatform);
  if(mplatform.y <= mplatform.bottomLimit) {
    mplatform.body.velocity.y = 70;
  } else if (mplatform.y >= mplatform.topLimit) {
    mplatform.body.velocity.y = -70;
  }
  if (hitmplatform && mplatform.body.touching.down && hitLayer) {
    player.kill();
  }
}

// funzione per creazione piattaforma che si muove orizzontalmente ////////////
function createSplatform(x,y, leftLimit, rightLimit) {
  g = game.add.sprite(x,y,'splatform');
  g.width = 128; g.height = 32;
  game.physics.arcade.enable(g);
  g.body.velocity.x = 70;
  g.leftLimit = leftLimit;
  g.rightLimit = rightLimit;
  g.body.immovable = true;
  return g;
}
function updateSplatform(splatform) {
  game.physics.arcade.collide(player, splatform);
  if(splatform.x <= splatform.leftLimit) {
    splatform.body.velocity.x = 70;
  } else if (splatform.x >= splatform.rightLimit) {
    splatform.body.velocity.x = -70;
  }
}

// funzione per creazione piattaforma che si muove a rombo ////////////////////
function createRplatform(x,y, leftLimit, rightLimit, topLimit, bottomLimit) {
  g = game.add.sprite(x,y,'rplatform');
  g.width = 64; g.height = 32;
  game.physics.arcade.enable(g);
  g.body.velocity.y = -15*3;
  g.body.velocity.x = 15*4;
  g.leftLimit = leftLimit;
  g.rightLimit = rightLimit;
  g.topLimit = topLimit;
  g.bottomLimit = bottomLimit;
  g.body.immovable = true;
  return g;
}
function updateRplatform(rplatform) {
game.physics.arcade.collide(player, rplatform);
  if(rplatform.x <= rplatform.leftLimit) {
    rplatform.body.velocity.y = -15*3;
    rplatform.body.velocity.x = 15*4;
  } else if (rplatform.x >= rplatform.rightLimit) {
    rplatform.body.velocity.y = 15*3;
    rplatform.body.velocity.x = -15*4;
  }
  else if (rplatform.y <= rplatform.bottomLimit) {
    rplatform.body.velocity.y = 15*3;
    rplatform.body.velocity.x = 15*4;
  }
  else if (rplatform.y >= rplatform.topLimit) {
    rplatform.body.velocity.y = -15*3;
    rplatform.body.velocity.x = -15*4;
  }
}

function createRplatform_rev(x,y, leftLimit, rightLimit, topLimit, bottomLimit) {
  g = game.add.sprite(x,y,'rplatform');
  g.width = 64; g.height = 32;
  game.physics.arcade.enable(g);
  g.body.velocity.y = -15*3;
  g.body.velocity.x = 15*4;
  g.leftLimit = leftLimit;
  g.rightLimit = rightLimit;
  g.topLimit = topLimit;
  g.bottomLimit = bottomLimit;
  g.body.immovable = true;
  return g;
}
function updateRplatform_rev(rplatform_rev) {
game.physics.arcade.collide(player, rplatform_rev);
  if(rplatform_rev.x <= rplatform_rev.leftLimit) {
    rplatform_rev.body.velocity.y = 15*3;
    rplatform_rev.body.velocity.x = 15*4;
  } else if (rplatform_rev.x >= rplatform_rev.rightLimit) {
    rplatform_rev.body.velocity.y = -15*3;
    rplatform_rev.body.velocity.x = -15*4;
  }
  else if (rplatform_rev.y <= rplatform_rev.bottomLimit) {
    rplatform_rev.body.velocity.y = 15*3;
    rplatform_rev.body.velocity.x = -15*4;
  }
  else if (rplatform_rev.y >= rplatform_rev.topLimit) {
    rplatform_rev.body.velocity.y = -15*3;
    rplatform_rev.body.velocity.x = 15*4;
  }
}


// funzione per creazione lava ////////////////////////////////////////////////
function createDplatform(x,y) {
  g = game.add.sprite(x,y,'dplatform');
  game.physics.arcade.enable(g);
  g.body.immovable = true;
  g.animations.add('moving', [0, 1, 2, 3], 4, true);
  g.animations.play('moving')
  return g;
}
//funzione lava
function updateDplatform(dplatform) {
game.physics.arcade.collide(dplatform, player, function(pl,dp){
  dp.kill();
 })
}

// funzione per creazione lindor //////////////////////////////////////////////
function createLindor(x,y,topLimit, bottomLimit) {
  g = game.add.sprite(x,y,'lindor');
  g.width = 32; g.height = 32;
  game.physics.arcade.enable(g);
  g.body.gravity.y = 700;
  g.topLimit = topLimit;
  g.bottomLimit = bottomLimit;
  return g;
}

function updateLindor2(lindor) {
if (lindor.y >= lindor.topLimit ) {
      lindor.body.velocity.y = - 570;
    }
game.physics.arcade.overlap(lindor, player, function() {
    player.kill();
  })
}

function updateLindor(lindor) {
if (lindor.y > lindor.topLimit ) {
      lindor.body.velocity.y = - 570;
    }
game.physics.arcade.overlap(lindor, player, function() {
    player.kill();
  })
}

//porta
function createPorta_on(x,y) {
g = game.add.sprite(x,y,'porta_on')
g.width = 64; g.height = 90;
game.physics.arcade.enable(g);
return g;
}

function createPorta_off(x,y) {
g = game.add.sprite(x,y,'porta_off')
g.width = 64; g.height = 90;
game.physics.arcade.enable(g);
return g;
}

// funzione creazione vita \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function createVita(x,y) {
vita = game.add.sprite(x,y,'vita');
vita.fixedToCamera = true;
vita.width = 19; vita.height = 28;
game.physics.arcade.enable(vita);
return vita;
}

function updateVita2(vita) {
  if (vite == 0) {
    loser.alpha=1;
    game.time.events.add(Phaser.Timer.SECOND * 4, function(){
    game.state.restart('livello2');
    loser.alpha=0;
})
}
  else if (vite == 1) {
    vita.alpha = 1;
    vita2.alpha = 0;
    vita3.alpha = 0;
    vita4.alpha = 0;
    vita5.alpha = 0;
  }

  else if (vite == 2) {
    vita.alpha = 1;
    vita2.alpha = 1;
    vita3.alpha = 0;
    vita4.alpha = 0;
    vita5.alpha = 0;
  }

  else if (vite == 3) {
    vita.alpha = 1;
    vita2.alpha = 1;
    vita3.alpha = 1;
    vita4.alpha = 0;
    vita5.alpha = 0;
  }

  else if (vite == 4) {
    vita.alpha = 1;
    vita2.alpha = 1;
    vita3.alpha = 1;
    vita4.alpha = 1;
    vita5.alpha = 0;
  }

  else if (vite == 5) {
    vita.alpha = 1;
    vita2.alpha = 1;
    vita3.alpha = 1;
    vita4.alpha = 1;
    vita5.alpha = 1;
  }
}

function createRealvita(x,y) {
realvita = game.add.sprite(x,y,'realvita');
realvita.width = 40; realvita.height = 60;
game.physics.arcade.enable(realvita);
realvita.animations.add('moving', [0, 1, 2, 3], 4, true);
realvita.animations.play('moving');
return realvita;
}

function updateRealvita(realvita) {
  if (player.alive == false && counter == 1) {
    counter = 0;
    player.alpha = 1;
    vite = vite - 1;
    mission_lv1_3_fattibile = false;
    mission_lv2_3_fattibile = false;
  }

// funzione per raccogliere vite
  else if (vite != 5 && game.physics.arcade.overlap(realvita, player, function() {
    player.body.touching.down = false;
    vite = vite + 1;
    realvita.kill();
    mission_lv1_2_fattibile = false;
  }));

  else if (vite == 5)
  {game.physics.arcade.overlap(realvita, player, function() {
    player.body.touching.down = false;
    realvita.kill();
  });}
}

var main_menu = {
  preload:function() {
  game.load.crossOrigin = 'anonymous';
  game.load.image('copertina', 'menu/copertina.png');
  game.load.image('play', 'menu/play.png');
  game.load.image('autori', 'menu/autori.png');
  game.load.image('crediti', 'menu/crediti.png');
  game.load.image('tutorial', 'menu/tutorial.png');
  },
  create:function() {
  image = game.add.sprite(0, 0, 'copertina');
  image.width = 1024; image.height = 768;

  play = game.add.sprite(715.596, 407, 'play');
  play.width = 260 ; play.height = 260 ;
  play.inputEnabled = true;
  play.events.onInputDown.add(this.playClick, this);

  autori = game.add.sprite(890.543 , 169.07 , 'autori');
  autori.width = 90.299 ; autori.height = 89.353 ;
  autori.inputEnabled = true;
  autori.events.onInputDown.add(this.autoriClick, this);

  crediti = game.add.sprite(885.877, 55.185 , 'crediti');
  crediti.width = 99.559 ; crediti.height = 101.759 ;
  crediti.inputEnabled = true;
  crediti.events.onInputDown.add(this.creditiClick, this);

  tutorial = game.add.sprite(884.291, 271.999, 'tutorial');
  tutorial.width = 105.436; tutorial.height = 89.8;
  tutorial.inputEnabled = true;
  tutorial.events.onInputDown.add(this.tutorialClick, this);
  },

  playClick: function(pointer) {
    if (storia_finita == false){
    game.state.start('scelta_personaggio')}
    else if (storia_finita == true){
    game.state.start('scelta_modalità')}},

  autoriClick: function(pointer) {
    game.state.start('autori')},

  creditiClick: function(pointer) {
    game.state.start('crediti')},

    tutorialClick: function(pointer) {
      game.state.start('tutorial')}
}

var autori = {
  preload:function() {
  game.load.image('autori', 'menu/pagina_autori.png');
  game.load.image('avanti', 'menu/return.png');
  },
  create:function() {
  autori = game.add.sprite(0,0, 'autori');

  avanti = game.add.sprite(910, 5, 'avanti');
  avanti.width = 100; avanti.height = 75;
  avanti.inputEnabled = true;
  avanti.events.onInputDown.add(this.avanti, this);
  },
  avanti: function(pointer) {
      game.state.start('main_menu')}
}

var crediti = {
  preload:function() {
  game.load.image('crediti', 'menu/pagina_crediti.png');
  game.load.image('avanti', 'menu/return.png');
  },
  create:function() {
  crediti = game.add.sprite(0,0, 'crediti');

  avanti = game.add.sprite(910, 5, 'avanti');
  avanti.width = 100; avanti.height = 75;
  avanti.inputEnabled = true;
  avanti.events.onInputDown.add(this.avanti, this);
  },
  avanti: function(pointer) {
      game.state.start('main_menu')}
}

var tutorial = {
  preload:function() {
  game.load.image('comandi', 'menu/comandi.png');
  game.load.image('items', 'menu/items.png');
  game.load.image('avanti', 'menu/play.png');
  },
  create:function() {
  tutorial = 1;
  items = game.add.sprite(0,0, 'items');
  comandi = game.add.sprite(0,0, 'comandi');
  avanti = game.add.sprite(910, 5, 'avanti');
  avanti.width = 100; avanti.height = 100;
  avanti.inputEnabled = true;
  avanti.events.onInputDown.add(this.avanti, this);
  },
  update:function() {
    if (tutorial == 2){
      comandi.kill();}
  },
  avanti: function(pointer) {
      tutorial = tutorial +1;
      if(tutorial==3){
      game.state.start('main_menu')}
}
}

var scelta_modalità = {
  preload:function() {
  game.load.crossOrigin = 'anonymous';
  game.load.image('storia', 'menu/modalit-storia.png');
  game.load.image('livelli', 'menu/modalit-livelli.png');
  game.load.image('modalità', 'menu/modalit.png');
  game.load.image('ritorna', 'menu/return.png');
  },
  create:function() {
  sfondo = game.add.sprite(0, 0, 'modalità');

  livelli = game.add.sprite(544.735 , 214.463, 'livelli');
  livelli.inputEnabled = true;
  livelli.events.onInputDown.add(this.livelli, this);

  storia = game.add.sprite(62.258 , 214.463 , 'storia');
  storia.inputEnabled = true;
  storia.events.onInputDown.add(this.storia, this);

  ritorna = game.add.sprite(910, 5, 'ritorna');
  ritorna.width = 100; ritorna.height = 75;
  ritorna.inputEnabled = true;
  ritorna.events.onInputDown.add(this.ritorna, this);
  },
  storia: function(pointer) {
    storia = true;
    game.state.start('scelta_personaggio')
  },
  livelli: function(pointer) {
    livelli = true;
    game.state.start('scelta_personaggio')
  },
  ritorna: function(pointer) {
    game.state.start('main_menu')
  }
}

var livelli = {
  preload:function() {
  game.load.crossOrigin = 'anonymous';
  game.load.image('sfondo', 'menu/livello.png');
  game.load.image('livello1', 'menu/livello1.png');
  game.load.image('livello2', 'menu/livello2.png');
  game.load.image('stella_centro', 'menu/stella_centro1.png');
  game.load.image('stella_sx', 'menu/stella_sx1.png');
  game.load.image('stella_dx', 'menu/stella_dx1.png');
  game.load.image('ritorna', 'menu/return.png');
  },
  create:function() {
  sfondo = game.add.sprite(0, 0, 'sfondo');

  livello1 = game.add.sprite(58.079, 293.545, 'livello1');
  livello1.inputEnabled = true;
  livello1.events.onInputDown.add(this.livello1, this);

  livello2 = game.add.sprite(540.885 , 293.545 , 'livello2');
  livello2.inputEnabled = true;
  livello2.events.onInputDown.add(this.livello2, this);

  ritorna = game.add.sprite(910, 5, 'ritorna');
  ritorna.width = 100; ritorna.height = 75;
  ritorna.inputEnabled = true;
  ritorna.events.onInputDown.add(this.ritorna, this);
},
update:function(){
  if(mission_lv1_1 == true){
  game.add.sprite(145.164 , 209.326 , 'stella_sx')  }
  if (mission_lv1_2 == true){
  game.add.sprite(223.243 , 185.343 , 'stella_centro')  }
  if (mission_lv1_3 == true){
  game.add.sprite(302.925 , 209.326, 'stella_dx')  }
  if (mission_lv2_1 == true){
  game.add.sprite(627.907  , 209.326 , 'stella_sx')  }
  if (mission_lv2_2 == true){
  game.add.sprite(705.985  , 185.343 , 'stella_centro')  }
  if (mission_lv2_3 == true){
  game.add.sprite(785.667  , 209.326, 'stella_dx')  }
  },
  livello1: function(pointer) {
   livello_singolo = true;
    game.state.start('livello1')
  },
  livello2: function(pointer) {
    livello_singolo = true;
    game.state.start('livello2')
  },
  ritorna: function(pointer) {
    livello_singolo = false;
    game.state.start('main_menu')
  }
}

var scelta_personaggio = {
  preload:function() {
  game.load.crossOrigin = 'anonymous';
  game.load.image('hansel', 'scelta-personaggio/personaggio-h.png');
  game.load.image('gretel', 'scelta-personaggio/personaggio-g.png');
  game.load.image('sfondo', 'scelta-personaggio/scelta-pers.png');
  game.load.image('ritorna', 'menu/return.png');
  },
  create:function() {
  sfondo = game.add.sprite(0, 0, 'sfondo');

  hansel = game.add.sprite(183, 172, 'hansel');
  hansel.inputEnabled = true;
  hansel.events.onInputDown.add(this.hansel, this);

  gretel = game.add.sprite(546, 165, 'gretel');
  gretel.inputEnabled = true;
  gretel.events.onInputDown.add(this.gretel, this);

  ritorna = game.add.sprite(910, 5, 'ritorna');
  ritorna.width = 100; ritorna.height = 75;
  ritorna.inputEnabled = true;
  ritorna.events.onInputDown.add(this.ritorna, this);
  },
  hansel: function(pointer) {
    hansel = true;
    if (livelli == true){
    game.state.start('livelli') }
    else {
    tavola = 1;
    game.state.start('evento_1')}
  },
  gretel: function(pointer) {
    hansel = false;
    if (livelli == true){
    game.state.start('livelli') }
    else {
    tavola = 1;
    game.state.start('evento_1')}
  },
  ritorna: function(pointer) {
  storia = false;
  livelli = false;
  game.state.start('main_menu')}

}

var evento_1 = {
  preload:function() {
  game.load.crossOrigin = 'anonymous';
  game.load.image('tavola1', 'tavole/1.png');
  game.load.image('tavola2', 'tavole/2.png');
  game.load.image('tavola3', 'tavole/3.png');
  game.load.image('tavola4', 'tavole/4.png');
  if (hansel == true ){
  game.load.image('tavola5', 'tavole/5-g.png');
  game.load.image('tavola7', 'tavole/7-h.png');}
  else if (hansel == false){
  game.load.image('tavola5', 'tavole/5-h.png');
  game.load.image('tavola7', 'tavole/7-g.png');}
  game.load.image('tavola6', 'tavole/6.png');
  game.load.image('tavola8', 'tavole/8.png');
  game.load.image('tavola9', 'tavole/9.png');
  game.load.image('avanti', 'tavole/freccia.png');
  },

  create:function() {
  tavola9 = game.add.sprite(0,0, 'tavola9');
  tavola9.width = 1024; tavola9.height = 768;
  tavola8 = game.add.sprite(0,0, 'tavola8');
  tavola7 = game.add.sprite(0,0, 'tavola7');
  tavola6 = game.add.sprite(0,0, 'tavola6');
  tavola5 = game.add.sprite(0,0, 'tavola5');
  tavola4 = game.add.sprite(0,0, 'tavola4');
  tavola3 = game.add.sprite(0,0, 'tavola3');
  tavola2 = game.add.sprite(0,0, 'tavola2');
  tavola1 = game.add.sprite(0,0, 'tavola1');

  avanti = game.add.sprite(910, 5, 'avanti');
  avanti.width = 100; avanti.height = 100;
  avanti.inputEnabled = true;
  avanti.events.onInputDown.add(this.avanti, this);
  },

  update:function() {
  if(tavola==2){
    tavola1.kill();}
    if(tavola==3){
      tavola2.kill();}
      if(tavola==4){
        tavola3.kill();}
        if(tavola==5){
          tavola4.kill();}
          if(tavola==6){
            tavola5.kill();}
            if(tavola==7){
              tavola6.kill();}
              if(tavola==8){
                tavola7.kill();}
                if(tavola==9){
                  tavola8.kill();}
  },
  avanti: function(pointer) {
    tavola = tavola +1;
    if(tavola==10){
    game.state.start('livello1')}
  },
}

var evento_2 = {
  preload:function() {
  game.load.crossOrigin = 'anonymous';
  game.load.image('tavola10', 'tavole/10.png');
  game.load.image('tavola11', 'tavole/11.png');
  game.load.image('tavola12', 'tavole/12.png');
  game.load.image('avanti', 'tavole/freccia.png');
  },

  create:function() {
  tavola12 = game.add.sprite(0,0, 'tavola12');
  tavola11 = game.add.sprite(0,0, 'tavola11');
  tavola10 = game.add.sprite(0,0, 'tavola10');

  avanti = game.add.sprite(910, 5, 'avanti');
  avanti.width = 100; avanti.height = 100;
  avanti.inputEnabled = true;
  avanti.events.onInputDown.add(this.avanti, this);
  },
  update:function() {
  if(tavola==11){
    tavola10.kill();}
    if(tavola==12){
      tavola11.kill();}
  },
  avanti: function(pointer) {
    tavola = tavola +1;
    if(tavola==13){
    game.state.start('livello2')}
  },
}

var evento_3 = {
  preload:function() {
  game.load.crossOrigin = 'anonymous';
  if (hansel == true ){
  game.load.image('tavola13', 'tavole/13-h.png');
  game.load.image('tavola14', 'tavole/14-g.png');}
  else if (hansel == false){
  game.load.image('tavola13', 'tavole/13-g.png');
  game.load.image('tavola14', 'tavole/14-h.png');}
  game.load.image('tavola15', 'tavole/15.png');
  game.load.image('avanti', 'tavole/freccia.png');
  },
  create:function() {
  tavola15 = game.add.sprite(0,0, 'tavola15');
  tavola14 = game.add.sprite(0,0, 'tavola14');
  tavola13 = game.add.sprite(0,0, 'tavola13');

  avanti = game.add.sprite(910, 5, 'avanti');
  avanti.width = 100; avanti.height = 100;
  avanti.inputEnabled = true;
  avanti.events.onInputDown.add(this.avanti, this);
  },
  update:function() {
  if(tavola==14){
    tavola13.kill();}
    if(tavola==15){
      tavola14.kill();}
  },
  avanti: function(pointer) {
    tavola = tavola +1;
    if(tavola==16){
    game.state.start('main_menu')
    storia_finita = true}
  },
}

game.state.add('main_menu', main_menu);
game.state.add('autori', autori);
game.state.add('crediti', crediti);
game.state.add('tutorial', tutorial);
game.state.add('scelta_modalità', scelta_modalità);

game.state.add('scelta_personaggio', scelta_personaggio);
game.state.add('livelli', livelli);
game.state.add('evento_1', evento_1);
game.state.add('evento_2', evento_2);
game.state.add('livello1', livello1);
game.state.add('livello2', livello2);
game.state.add('evento_3', evento_3);


game.state.start('main_menu');
