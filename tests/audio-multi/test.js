asyncTest("Audio: Multiple Playback", function( async ) {
  var type,
      dead = false,
      tick = 0,
      loaded = 0,
      codecs = {
        "mp3": 'audio/mpeg; codecs="mp3"',
        "ogg": 'audio/ogg; codecs="vorbis"',
        "wav": 'audio/wav; codecs="1"',
        "aac": 'audio/mp4; codecs="mp4a.40.2"'
      },
      audios = [
        new Audio(),
        new Audio()
      ];

  type = Object.keys( codecs ).filter(function( ext ) {
    return (/probably|maybe/).test( audios[ 0 ].canPlayType( codecs[ ext ] ) );
  })[ 0 ];

  audios[ 0 ].src = "/tests/audio-multi/amp." + type;
  audios[ 1 ].src = "/tests/audio-multi/chirp." + type;

  async.step(function() {
    audios.forEach(function( audio ) {
      audio.addEventListener( "playing", function() {
        tick++;

        if ( tick === audios.length && !dead ) {
          async.step(function() {
            assert( true, "Multiple audio playback supported (used: " + type + ")" );
            dead = true;
            async.done();
          });
        }
      }, false );

      audio.addEventListener( "loadeddata", function() {
        loaded++;
        audio.play();
        audio.volume = 0;
        audio.muted = true;

        if ( loaded === audios.length ) {
          setTimeout(function() {
            if ( !dead ) {
              async.step(function() {
                assert( false, "Browser failed to load audio" );
                dead = true;
                async.done();
              });
            }
          }, 1000 );
        }
      }, false );
    });
  });
});
