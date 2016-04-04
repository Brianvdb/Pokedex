/**
 * Created by Gebruiker on 1-4-2016.
 */

function CatchController(api, databasecontroller, languagecontroller) {
    this.api = api;
    this.databasecontroller = databasecontroller;
    this.languagecontroller = languagecontroller;
}

CatchController.prototype = {
    init: function() {
        var self = this;
        this.finddistance = 300;
        this.secretpokemons = [];
        this.databasecontroller.getSecretPokemons(function(results) { self.onSecretLocationsReceived(results) });
        this.watchid = navigator.geolocation.watchPosition(function(position) { self.onLocationSuccess(position) }, function(error) { self.onError(error) });
    },
    onSecretLocationsReceived: function(results) {
        var self = this;
        for (var i = 0; i < results.rows.length; i++) {
            this.secretpokemons[i] = results.rows.item(i);
        }

        // show locations on ui
        var catchlist = $('#catchlist');
        catchlist.empty();
        for(i = 0; i < this.secretpokemons.length; i++) {
            var pokemon = this.secretpokemons[i];
            if (pokemon.found == 0) {
                catchlist.append('<li><a data-transition="slideup" href="navigatepokemon.html?lat=' + pokemon.lat + '&lng=' + pokemon.lng + '"><img src="img/secret-pokemon.png"/><h2 data-localized="secret_pokemon"></h2><p data-localized="secret_pokemon_notfound"></p></a></li>');
            } else {
                var url = this.api.getPokemonUrl(pokemon.pokemon_id);
                var imageUrl = this.api.getPokemonImageUrl(pokemon.pokemon_id);
                catchlist.append('<li><a data-transition="slideup" href="pokemonview.html?location=' + encodeURI(pokemon.location) + '&name=' + pokemon.pokemon_name + '&id=' + pokemon.pokemon_id + '&url=' + url + '"><img src="' + imageUrl + '"/><h2>' + pokemon.pokemon_name + '</h2><p>' + pokemon.location + '</p></a></li>');
            }
        }
        this.languagecontroller.invalidate();
        catchlist.listview("refresh");
    },
    // callback method which is called when user's position is fetched
    onLocationSuccess: function(position) {
        console.log('location success');
        var self = this;
        // determine if we found a new location
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $('#location').text('lat: ' + lat + ' lng: ' + lng);

        for(var i = 0; i < this.secretpokemons.length; i++) {
            var secretpokemon = this.secretpokemons[i];

            // if this location was already found, ignore it
            if(secretpokemon.found != 0) continue;

            var distance = this.getDistanceInMeters(lat, lng, secretpokemon.lat, secretpokemon.lng);
            console.log('location: ' + secretpokemon.location + ' distance: ' + distance);
            if(distance < this.finddistance) {
                // we found a pokemon.
                console.log('found pokemon: ' + secretpokemon.pokemon_name);
                this.databasecontroller.foundSecretPokemon(function(results) {self.onSecretLocationsReceived(results)}, secretpokemon);
            }
        }
    },
    // this method is called when we failed to fetch the user's location
    onError: function(error) {
        $('#location').text(error.message);
    },
    // calculates distance in meters from one location to another
    getDistanceInMeters: function(lat1, lon1, lat2, lon2) {
        var R = 6371000; // Radius of the earth in meters
        var dLat = this.deg2rad(lat2-lat1);
        var dLon = this.deg2rad(lon2-lon1);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in meters
        return d;
    },
    deg2rad: function(deg) {
        return deg * (Math.PI/180);
    }
};