(function (Engine, Events, Dropbox, $) {

  /**
   * Module that enables a save of the gamestate to the dropbox datastore
   * @see https://www.dropbox.com/developers/datastore
   *
   * The dropbox datastore (dbds) connector lets you save your data to your own dropbox datastore
   * without jamming files to it.
   *
   * This connector uses the game engines own base64 encoder.
   */

  'use strict';

  if (!Engine) { return false; }  // Game Engine not available
  if (!Dropbox) { return false; } // Dropbox Connector not available

  var DropboxConnector = {

    options: {
      log: false,
      key: 'q7vyvfsakyfmp3o',
      table: 'adarkroom'
    },

    client: false,
    table: false,
    dropboxAccount: false,
    savegameKey: false,
    savegames: {0: null, 1: null, 2: null, 3: null, 4: null},

    init: function (options) {
      this.options = $.extend(
        this.options,
        options
      );

      this._log = this.options.log;

      this.client = new Dropbox.Client({key: DropboxConnector.options.key});
      this.connectToDropbox(false);

      return this;
    },

    startDropbox: function () {
      if (!DropboxConnector.client || !DropboxConnector.table) {
        DropboxConnector.startDropboxConnectEvent();
      } else {
        DropboxConnector.startDropboxImportEvent();
      }
    },

    /**
     * ******
     * Events
     * ******
     */

    startDropboxConnectEvent: function () {
      Events.startEvent({
        title: _('Dropbox connection'),
        scenes: {
          start: {
            text: [_('connect game to dropbox local storage')],
            buttons: {
              'connect': {
                text: _('connect'),
                nextScene: 'end',
                onChoose: function () {
                  DropboxConnector.connectToDropbox(DropboxConnector.startDropboxImportEvent);
                }
              },
              'cancel': {
                text: _('cancel'),
                nextScene: 'end'
              }
            }
          }
        }
      });
    },

    startDropboxImportEvent: function () {
      Events.startEvent({
        title: _('Dropbox Export / Import'),
        scenes: {
          start: {
            text: [_('export or import save data to dropbox datastorage'),
                  _('your are connected to dropbox with account / email ') + DropboxConnector.dropboxAccount],
            buttons: {
              'save': {
                text: _('save'),
                nextScene: {1: 'saveToSlot'}
              },
              'load': {
                text: _('load'),
                nextScene: {1: 'loadFromSlot'},
                onChoose: DropboxConnector.loadGamesFromDropbox
              },
              'signout': {
                text: _('signout'),
                nextScene: 'end',
                onChoose: DropboxConnector.signout
              },
              'cancel': {
                text: _('cancel'),
                nextScene: 'end'
              }
            }
          },
          saveToSlot: {
            text: [_('choose one slot to save to')],
            buttons: (function () {
              var buttons = {};

              $.each(DropboxConnector.savegames, function (n, savegame) {
                buttons['savegame' + n] = {
                  text: _('save to slot') + n + ' ' + (savegame ? DropboxConnector.prepareSaveDate(savegame.get('timestamp')) : 'empty'),
                  nextScene: 'end',
                  onChoose: function () {
                    DropboxConnector.log('Save to slot ' + n + ' initiated');
                    // timeout prevents error due to fade out animation of the previous event
                    Engine.setTimeout(function () {
                      DropboxConnector.log('Save to slot ' + n);
                      DropboxConnector.saveGameToDropbox(n, DropboxConnector.savedtoDropboxEvent);
                    }, 1000);
                  }
                };
              });

              buttons.cancel = {
                text: _('cancel'),
                nextScene: 'end'
              };

              return buttons;
            }())
          },
          loadFromSlot: {
            text: [_('choose one slot to load from')],
            buttons: (function () {
              var buttons = {};

              $.each(DropboxConnector.savegames, function (n, savegame) {
                if (savegame) {
                  buttons['savegame' + n] = {
                    text: _('load from slot') + n + ' ' + DropboxConnector.prepareSaveDate(savegame.get('timestamp')),
                    nextScene: 'end',
                    onChoose: function () {
                      DropboxConnector.log('Load from slot ' + n + ' initiated');
                      // timeout prevents error due to fade out animation of the previous event
                      Engine.setTimeout(function () {
                        DropboxConnector.log('Load from slot ' + n);
                        DropboxConnector.loadGameFromDropbox(n);
                      }, 1000);
                    }
                  };
                }
              });

              buttons.cancel = {
                text: _('cancel'),
                nextScene: 'end'
              };

              return buttons;
            }())
          }
        }
      });
    },

    savedtoDropboxEvent: function (success) {
      Events.startEvent({
        title: _('Dropbox Export / Import'),
        scenes: {
          start: {
            text: success ? [_('successfully saved to dropbox datastorage')] :
                [_('error while saving to dropbox datastorage')],
            buttons: {
              'ok': {
                text: _('ok'),
                nextScene: 'end'
              }
            }
          }
        }
      });
    },

    /**
     * ***************
     * functional code
     * ***************
     */

    /**
     * Initiate dropbox connection
     *
     * @param interactive
     * @param callback
     */
    connectToDropbox: function (interactive, callback) {

      DropboxConnector.log('start dropbox');

      var client = this.client;

      client.authenticate({interactive: interactive}, function (error) {
        if (error) {
          DropboxConnector.log('Dropbox Authentication error: ' + error);
        }
      });

      if (client.isAuthenticated()) {

        var datastoreManager = client.getDatastoreManager();
        datastoreManager.openDefaultDatastore(function (error, datastore) {
          if (error) {
            DropboxConnector.log('Error opening default datastore: ' + error);
          } else {
            DropboxConnector.table = datastore.getTable(DropboxConnector.options.table);
            DropboxConnector.loadGamesFromDropbox();

            DropboxConnector.log(DropboxConnector.client.credentials());

            DropboxConnector.client.getAccountInfo({}, function (error, info) {
              if (!error) {
                DropboxConnector.dropboxAccount = info.email;
              }
            });

            DropboxConnector.log("Got savegames", DropboxConnector.savegames);

            if (typeof callback === "function") {
              callback.call(DropboxConnector.table);
            }
          }
        });
      } else {
        DropboxConnector.log('Not connected to dropbox.');
      }
    },

    /**
     * Requests your savegames fom dbds
     *
     * @returns {*}
     */
    loadGamesFromDropbox: function () {
      var savegames = DropboxConnector.savegames;

      $.each(savegames, function (n) {
        var results = DropboxConnector.table.query({savegameId: DropboxConnector.prepareSavegameID(n)});
        savegames[n] = results[0];
      });

      return savegames;
    },

    /**
     * Imports a gamestate of a given slotnumber to your game
     *
     * @param slotnumber
     */
    loadGameFromDropbox: function (slotnumber) {

      var table = DropboxConnector.table;
      var id = DropboxConnector.prepareSavegameID(slotnumber);
      var results = table.query({savegameId: id});
      var record = results[0];

      if (record && record.get('gameState')) {
        Engine.import64(record.get('gameState'));
      }
    },

    /**
     * Saves a gamestate to a given slot in dbds
     *
     * @param slotnumber
     * @param callback
     */
    saveGameToDropbox: function (slotnumber, callback) {

      var table = DropboxConnector.table;
      var record = null;
      var success = false;
      var id = DropboxConnector.prepareSavegameID(slotnumber);

      var saveGame = {
        gameState: Engine.generateExport64(),
        timestamp: new Date().getTime()
      };

      if (DropboxConnector.savegames[slotnumber]) { // slot aleady used -> overwrite
        record = DropboxConnector.savegames[slotnumber];
        try {
          record.update(saveGame);
          DropboxConnector.log("Updated savegame ", slotnumber);
          success = true;
        } catch (e) {
          success = false;
        }

      } else {
        saveGame.savegameId = id;
        try {
          record = table.insert(saveGame);
          DropboxConnector.log("Inserted savegame ", record.getId());
          success = true;
        } catch (e) {
          success = false;
        }
      }
      if (typeof callback === "function") {
        callback(success);
      }
    },

    /**
     * Terminates the connection to your db account
     */
    signout: function () {
      DropboxConnector.client.signOut({}, function (error) {
        if (error) {
          alert('Error while logout from dropbox');
        } else {
          alert('Successfully signed out.');
          DropboxConnector.client = null;
          DropboxConnector.savegames = null;
          DropboxConnector.dropboxAccount = null;
        }
      });
    },

    /**
     * **************
     * Helper methods
     * **************
     */

    prepareSavegameID: function (slotnumber) {
      return 'adarkroom_savegame_' + slotnumber;
    },

    prepareSaveDate: function (timestamp) {
      var date = new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },

    log: function () {
      if (this._log) {
        console.log(arguments);
      }
    }
  };

  Engine.Dropbox = DropboxConnector;

})(Engine, Events, Dropbox, jQuery);