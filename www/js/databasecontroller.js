/**
 * Created by Gebruiker on 1-4-2016.
 */
function DatabaseController(api) {
    this.api = api;
}

DatabaseController.prototype = {
    init: function() {
        this.db = window.openDatabase('poke_database', '1.0', 'Pokedex Application Database', 2 * 1024 * 1024);
        var self = this;
        this.db.transaction(function(trans) {
            trans.executeSql("CREATE TABLE IF NOT EXISTS secretpokemon (lat, lng, pokemon_id, pokemon_name, location, found)");
            trans.executeSql("CREATE TABLE IF NOT EXISTS pokemon (id INTEGER PRIMARY KEY, name, base_experience, height, is_default, order_nr, weight)");
            self.getSecretPokemons(); // populates data if table is empty
        }, function(err) { self.onDatabaseError(undefined, err) });
    },

    getSecretPokemons: function(callback) {
        var self = this;
        this.db.transaction(function(trans) {
            trans.executeSql('SELECT * FROM secretpokemon ORDER BY found DESC', [], function(trans, results) {
                var length = results.rows.length;
                if(length == 0) {
                    self.addSecretPokemons(callback);
                } else {
                    if(callback) callback(results);
                }
            });
        }, function(err) { self.onDatabaseError(callback, err) });
    },

    addSecretPokemons: function(callback) {
        var self = this;
        this.db.transaction(function(trans) {
            var locations = [
                {lat: 51.688697, lng: 5.287521, pokemon_id: 5, pokemon_name: "charmeleon", location: "Avans Hogeschool"},
                {lat: 51.691357, lng: 5.29206, pokemon_id: 8, pokemon_name: "wartortle", location: "Domino's Pizza"},
                {lat: 51.690471, lng: 5.294583, pokemon_id: 40, pokemon_name: "wigglytuff", location: "AH TOGO"},
                {lat: 51.701651, lng: 5.286109, pokemon_id: 42, pokemon_name: "golbat", location: "Sition"},
                {lat: 51.690841, lng: 5.299928, pokemon_id: 9, pokemon_name: "blastoise", location: "Bistro de Eeterij"},
                {lat: 51.693948, lng: 5.314347, pokemon_id: 18, pokemon_name: "pidgeot", location: "Prins Hendrikpark"},
                {lat: 51.678004, lng: 5.337752, pokemon_id: 45, pokemon_name: "vileplume", location: "Golf Parc Pettelaar"},
                {lat: 51.684337, lng: 5.295502, pokemon_id: 98, pokemon_name: "krabby", location: "SOS Rommelmarkt"},
                {lat: 51.688415, lng: 5.307743, pokemon_id: 75, pokemon_name: "graveler", location: "Cafe de Smidse"},
                {lat: 51.685956, lng: 5.304016, pokemon_id: 55, pokemon_name: "golduck", location: "Stedelijk Museum 's-Hertogenbosch"}
            ];

            for(var i = 0; i < locations.length; i++) {
                var location = locations[i];
                trans.executeSql(
                    'INSERT INTO secretpokemon (lat, lng, pokemon_id, pokemon_name, location, found) VALUES (?,?,?,?,?,?)',
                    [ location.lat, location.lng, location.pokemon_id, location.pokemon_name, location.location, 0]);
            }

            self.getSecretPokemons(callback);
        }, self.onDatabaseError);
    },

    foundSecretPokemon: function(callback, pokemon) {
        var self = this;
        this.db.transaction(function(trans) {
            trans.executeSql('UPDATE secretpokemon SET found=1 WHERE pokemon_id=?', [pokemon.pokemon_id]);
            trans.executeSql('INSERT OR IGNORE INTO pokemon (id, name) VALUES (?,?)', [pokemon.pokemon_id, pokemon.pokemon_name]);
            self.getSecretPokemons(callback);
        }, function(err) { self.onDatabaseError(callback, err) });
    },

    cachePokemons: function(pokemons) {
        var self = this;
        this.db.transaction(function(trans) {
            for(var i = 0; i < pokemons.length; i++) {
                var pokemon = pokemons[i];
                trans.executeSql('INSERT OR IGNORE INTO pokemon (id, name) VALUES (?,?)', [pokemon.id, pokemon.name]);
            }
        }, function(err) { self.onDatabaseError(undefined, err) });
    },

    getPokemons: function(callback, offset) {
        var self = this;
        this.db.transaction(function(trans) {
            trans.executeSql('SELECT id, name FROM pokemon WHERE id > ? AND id <= ?', [offset, offset + 30], function(trans, results) {
                var length = results.rows.length;
                console.log('length: ' + length);
                if(length == 0) {
                    callback(undefined);
                } else {
                    var pokemons = [];
                    for (var i = 0; i < length; i++) {
                        var pokemon = results.rows.item(i);
                        pokemon.url = self.api.getPokemonUrl(pokemon.id);
                        pokemon.image = self.api.getPokemonImageUrl(pokemon.id);
                        pokemons[i] = pokemon;
                    }
                    callback(pokemons);
                }

            });
        }, function(err) { self.onDatabaseError(callback, err) });
    },

    cachePokemonData: function(pokemon) {
        var self = this;
        this.db.transaction(function(trans) {
            trans.executeSql(
                'UPDATE pokemon SET base_experience=?, height=?, is_default=?, order_nr=?, weight=? WHERE id=?',
                [pokemon.base_experience, pokemon.height, pokemon.is_default, pokemon.order, pokemon.weight, pokemon.id]
            );
        }, function(err) { self.onDatabaseError(undefined, err) });
    },

    getPokemon: function(callback, id) {
        var self = this;
        this.db.transaction(function(trans) {
            trans.executeSql('SELECT * FROM pokemon WHERE id=?', [id], function(trans, results) {
                var length = results.rows.length;
                if(length == 0) {
                    callback(undefined);
                } else {
                    var pokemon = results.rows.item(0);
                    // only return this pokemon if all data is known
                    if(!pokemon.order_nr) {
                        callback(undefined);
                        return;
                    }
                    pokemon.url = self.api.getPokemonUrl(pokemon.id);
                    pokemon.image = self.api.getPokemonImageUrl(pokemon.id);
                    pokemon.order = pokemon.order_nr;
                    callback(pokemon);
                }
            });
        }, function(err) { self.onDatabaseError(callback, err) });
    },

    onDatabaseError: function(callback, err) {
        console.log('database error: ' + err.message);
        if(callback) callback(undefined);
    }
};