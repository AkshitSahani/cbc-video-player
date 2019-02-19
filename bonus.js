document.addEventListener("DOMContentLoaded", function() {
  var video = document.querySelector('#hls-video');
  // var video = document.getElementById('video');
  // console.log('video', video);
   if(Hls.isSupported()) {
     var hls = new Hls();
     hls.loadSource('https://mobilehls-vh.akamaihd.net/i/prodVideo/digitalArchives/CBC_Digital_Archives_VMS/108/895/AR-NETWORK-CALLED-INTERNET%2Cxcodemix%2C210.mp4,,.csmil/master.m3u8?hdnea=ip=65.92.195.31~st=1550534616~exp=1550537646~acl=/i/prodVideo/digitalArchives/CBC_Digital_Archives_VMS/108/895/AR-NETWORK-CALLED-INTERNET*~id=85f846b7-2a9f-42ad-97b5-d856749ed88b~hmac=e9f0070bc8db59da7b2def16dff3683bae710469217d0cb6f13a24e2d82eb03a');
     hls.attachMedia(video);
     hls.on(Hls.Events.MANIFEST_PARSED,function() {
       video.play();
   });
  }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://mobilehls-vh.akamaihd.net/i/prodVideo/digitalArchives/CBC_Digital_Archives_VMS/108/895/AR-NETWORK-CALLED-INTERNET%2Cxcodemix%2C210.mp4,,.csmil/master.m3u8?hdnea=ip=65.92.195.31~st=1550534616~exp=1550537646~acl=/i/prodVideo/digitalArchives/CBC_Digital_Archives_VMS/108/895/AR-NETWORK-CALLED-INTERNET*~id=85f846b7-2a9f-42ad-97b5-d856749ed88b~hmac=e9f0070bc8db59da7b2def16dff3683bae710469217d0cb6f13a24e2d82eb03a';
      video.addEventListener('loadedmetadata',function() {
        video.play();
      });
    }
});
