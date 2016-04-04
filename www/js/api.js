/**
 * Created by Brian on 31-3-2016.
 */
function API(app) {
    this.baseurl = "http://pokeapi.co/api/v2/pokemon/";
    this.imageurl = "http://pokeapi.co/media/sprites/pokemon/";
    this.app = app;
}

API.prototype = {
    getPokemons: function (offset, callback) {
        var self = this;
        $.getJSON(this.baseurl + '?limit=30&offset=' + offset, function (data) {
            console.log(data);
            // parse response, add some data
            var results = data.results;
            for (var i = 0; i < results.length; i++) {
                var pokemon = results[i];
                var urlparts = pokemon.url.split("/");
                if (urlparts && urlparts.length > 0) {
                    var number = urlparts[urlparts.length - 2];
                    pokemon.image = self.getPokemonImageUrl(number);
                    pokemon.id = number;

                }
            }
            self.app.databasecontroller.cachePokemons(results);
            callback(results);
        });
    },
    getPokemon: function (id, callback) {
        var self = this;
        $.getJSON(this.getPokemonUrl(id), function (pokemon) {
            pokemon.id = id;
            self.app.databasecontroller.cachePokemonData(pokemon);
            callback(pokemon);
        });
    },
    getPokemonUrl: function (id) {
        return this.baseurl + id;
    },
    getPokemonImageUrl: function (id) {
        return this.imageurl + id + '.png';
    }
};