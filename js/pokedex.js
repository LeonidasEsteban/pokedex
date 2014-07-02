$(function(){

    var languaje     = "es";
    var pokeapi      = "http://pokeapi.co";
    var $pokedex     = $('#pokedex');
    var $sprite      = $('#sprite');
    var $description = $('#description');
    var $search      = $('#search');

    var pokemon = {
        obtenerDatos : function(url, success, error){
            var self = this;
            $.ajax({
                url: pokeapi+url,
                type: 'GET',
                crossDomain: true,
                dataType: 'jsonp',
                success: success,
                error: error,
            });
        },
        pokemonNoExiste : function(error){
            var self    = pokemon;
            var mensaje = "pokemón not found";

            $sprite.addClass('is-fullSize');
            self.imprimirSprite("images/error.gif");
            self.activarPokedex();
            self.traducir(mensaje);
            self.imprimirDescripcion(mensaje);

        },
        recibirDatos : function(data){
            var self              = pokemon;
            var allDescriptions   = data.descriptions.length;
            var randomDescription = Math.floor((Math.random() * allDescriptions) );
            var descriptionURI    = data.descriptions[randomDescription].resource_uri;
            var spriteURI         = data.sprites[0].resource_uri;
            self.hablar(data.name);
            self.obtenerDatos(descriptionURI,self.obtenerDescription);
            self.obtenerDatos(spriteURI,self.obtenerSprite);
            
        },
        obtenerSprite : function(sprite){
            var self = pokemon;
            sprite   = pokeapi+sprite.image;

            self.activarPokedex();
            $sprite.removeClass('is-fullSize');
            self.imprimirSprite(sprite);
        },
        imprimirSprite : function(image){
            $sprite.css('background-image',"url("+image+")");
        },
        activarPokedex : function(){
            $pokedex.addClass('is-active');
        },
        obtenerDescription : function(description){
            var self        = pokemon;
            var descripcion = description.description;

            if(languaje != "en"){
                self.traducir(descripcion);
            }else{
                self.hablar(descripcion);
                self.imprimirDescripcion(descripcion);
            }

        },
        imprimirDescripcion : function(description){
            $description.text(description);
        },
        traducir : function(texto){
            var self = this;
            $.ajax({
                url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140630T200611Z.8c833fba3982fa81.d0a1b7c936b9f26db56008f70f43fdd3fa8a8227&lang=en-'+languaje+'&text='+texto+'',
                type: 'GET',
                crossDomain: true,
                dataType: 'jsonp',
                success: function(data){

                    var descripcion = data.text[0];

                    self.hablar(descripcion);
                    self.imprimirDescripcion(descripcion);

                },
            });
        },
        hablar : function(texto){
            var msg  = new SpeechSynthesisUtterance();
            
            texto    = texto.toLowerCase();
            texto    = texto.replace('pokmon','pokemón');
            texto    = texto.split('.')[0];
            msg.lang = languaje;
            msg.text = texto;

            speechSynthesis.speak(msg);
            $('#light').addClass('is-animated');
            msg.onend =function(e){
                $('#light').removeClass('is-animated');
            };

        },
        buscarForm : function(){
            var self = this;
            $search.on('submit',function(e){
                e.preventDefault();
                var pokemonNum = $search.find('input').val();
                window.location.hash = pokemonNum;
                self.buscarPokemon(pokemonNum);
            });
        },
        buscarPokemon : function(pokemon){
            var self = this;
            if(pokemon){
                if(pokemon == "mary"){
                    pokemon = 25;
                }
                if(pokemon == "pau"){
                    pokemon = 509;
                }
                self.obtenerDatos('/api/v1/pokemon/'+pokemon+'/',self.recibirDatos, self.pokemonNoExiste);
            }
        },
        init : function(){
            var self = this;
            var pokemon = window.location.hash.split('#')[1];

            if(window.location.search){
                languaje = window.location.search.split('?')[1].split('/')[0];
            }

            self.buscarForm();
            self.buscarPokemon(pokemon);

        }
    };

    pokemon.init();


});