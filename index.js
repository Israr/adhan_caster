var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var mdns = require('mdns');

// any mp4, webm, mp3 or jpg file with the proper contentType.
// for other sounds : https://www.islamcan.com/audio/adhan/index.shtml
const mediaUrl ='https://www.islamcan.com/audio/adhan/azan2.mp3'
const mediaType ='video/mp4'
const imageArt='https://www.wikihow.com/images/thumb/d/d1/Call-the-Adhan-Step-2-Version-4.jpg/aid275455-v4-728px-Call-the-Adhan-Step-2-Version-4.jpg.webp'

// create mdns browser and search for GoogleCast sinks
var browser = mdns.createBrowser(mdns.tcp('googlecast'));
browser.on('serviceUp', service => {
  console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
  onDeviceUp(service.addresses[0]);
  browser.stop();
});
browser.start();

const onDeviceUp = device => {
  var client = new Client();
  client.connect(device, () => {
    console.log('connected, launching app ...');
    client.launch(DefaultMediaReceiver, (err, player) => {
      var media = {
        contentId: mediaUrl,
        contentType: mediaType,
        streamType: 'BUFFERED', // LIVE
        // title and cover displayed while buffering
        metadata: { type: 0, metadataType: 0,
          title: "Azan",
          images: [{url:imageArt}]
        }
      };
      player.on('status',s => {console.log('status broadcast playerState=%s', s.playerState); client.close()});
      console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);
      player.load(media, { autoplay: true }, (err, status) => {
        console.log(status)
        //console.log('media loaded playerState=%s', status.playerState);
      });
    });
  });
  client.on('error', err => {
    console.log('Error: %s', err.message);
    client.close();
  })
}

console.log("Looking for services")
