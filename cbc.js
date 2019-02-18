document.addEventListener("DOMContentLoaded", function() {
    // this function runs when the DOM is ready, i.e. when the document has been parsed
    // document.getElementById("user-greeting").textContent = "Welcome back, Bart";
  });
    // let myVideo = document.getElementById("video1");
    const regex = /^\d+$/;
    // let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var w=window,
    d=document,
    e=d.documentElement,
    g=d.getElementsByTagName('body')[0],
    x=w.innerWidth||e.clientWidth||g.clientWidth,
    y=w.innerHeight||e.clientHeight||g.clientHeight;
    // const {width, height} = document.get('window');
    // console.log(width, height);
    // let desc = document.getElementsByClassName('description')[0];
    //
    // let videoSrc = document.getElementById("vidSrc");
    //
    // let videoTitle = document.getElementsByClassName('title')[0];
    // console.log('videoTitle', videoTitle, videoSrc)
    const fetchVideo = async (id) => {
      try{
        console.log('inside fetch video function!!!')
        const response = await fetch(`https://www.cbc.ca/bistro/order?mediaId=${id}`);
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        console.log('JSON resposne', myJson);
        if(myJson.errors.length){
          createError('The id provided does not have a video associated with it! Please try again', 'search');
        }
        else{
          removeError();
          const {assetDescriptors, title, thumbnail, description, } = myJson.items[0];
          console.log(assetDescriptors, title, thumbnail, description);
          renderVideo(assetDescriptors[1].key, title, thumbnail, description);
        }
      }
      catch(e){
        console.log('error in fetching video', e);
        console.log('full error', e.response);
      }
    }

    onKeyPress = () => {
      let userInput = document.getElementsByTagName('input')[0].value;
      console.log('key pressed!!!', userInput);
      let submitButton = document.getElementsByClassName('submit')[0];
      userInput !== '' ? submitButton.disabled = false : submitButton.disabled = true;
    }

    onSubmit = () => {
      let userInput = document.getElementsByTagName('input')[0].value;
      console.log('videoID', userInput);
      if(regex.test(userInput)){
        removeError();
        return fetchVideo(userInput);
      }
      createError('Video Ids can only be numbers. Please try again!', 'search');
    }

    renderCourtesy = () => {
      let courtesy = document.createElement('p');
      courtesy.className = 'courtesy';
      let text = document.createTextNode('Video courtesy of ');
      courtesy.appendChild(text);
      courtesy.appendChild(createLink('https://www.cbc.ca', 'CBC'));
      return courtesy;
    }

    createLink = (url, text) => {
      let link = document.createElement('a');
      link.href = url;
      link.target = "_blank";
      link.innerHTML = text;
      return link;
    }

    renderTitle = (title) => {
      let heading = document.createElement('h2');
      heading.className = 'title';
      heading.innerHTML = title;
      return heading;
    }

    renderDescription = (desc) => {
      let description =  document.createElement('p');
      description.className = 'desc';
      description.innerHTML = desc;
      return description;
    }

    createVideo = (url) => {
      let video = document.createElement('video');
      video.className = 'video';
      video.autoplay = true;
      video.width = 500;
      let source = document.createElement('source');
      source.setAttribute('src', url);
      video.appendChild(source);
      return video;
    }

    createButtons = (video) => {
      let text = ['Play/Pause', 'Small', 'Normal', 'Big', 'Full Screen'];
      let videoDimensions = [0, 300, 500, 700]; //0th element doesnt matter

      let buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'buttons';

      for(var i = 0; i < 5; i++){
        let button = document.createElement('button');
        button.className = 'btn';
        if(i === 0){
          button.onclick = () => video.paused ? video.play() : video.pause();
        }
        else if(i > 3){
          button.onclick = () => {
            video.width = x;
            // video.width = width;
            video.height = y;
            // video.height = height;
            if (video.requestFullscreen) {
              video.requestFullscreen();
            }
            //  else if (video.msRequestFullscreen) {
            //   video.msRequestFullscreen();
            // } else if (video.mozRequestFullScreen) {
            //   video.mozRequestFullScreen();
            // } else if (video.webkitRequestFullscreen) {
            //   video.webkitRequestFullscreen();
            // }
          }
        }
        else{
          let width = videoDimensions[i];
          button.onclick = () => video.width = width;
        }
        button.innerHTML = text[i];
        buttonsContainer.appendChild(button);
      }
      return buttonsContainer;
    }

    renderVideo = (url, title, img, desc) => {
      let existingContainer = document.getElementsByClassName('vid-container');
      existingContainer.length ? existingContainer[0].parentNode.removeChild(existingContainer[0]) : null;

      let container = document.createElement('div');
      container.className = 'vid-container';
      let video = createVideo(url);
      let buttons = createButtons(video);
      // for(var i = 0; i < 4; i++){
      //   let button = document.createElement('button');
      //   if(i === 0){
      //     button.onclick = () => video.paused ? video.play() : video.pause();
      //   }
      //   else{
      //     let width = videoDimensions[i];
      //     button.onclick = () => video.width = width;
      //   }
      //   button.className = 'btn';
      //   button.innerHTML = text[i];
      //   buttonsContainer.appendChild(button);
      // }
      container.appendChild(renderTitle(title))
      container.appendChild(buttons);
      container.appendChild(video);
      container.appendChild(renderDescription(desc));
      container.appendChild(renderCourtesy());
      document.getElementsByTagName('body')[0].appendChild(container);
    }

    createError = (message, appendTo) => {
      removeError();
      let error = document.createElement('p');
      error.className = 'error';
      let errorText = document.createTextNode(message);
      error.appendChild(errorText);
      document.getElementsByClassName(appendTo)[0].appendChild(error);
    }

    removeError = () => {
      let error = document.getElementsByClassName('error')[0];
      error ? error.parentNode.removeChild(error) : null;
    }

// });
