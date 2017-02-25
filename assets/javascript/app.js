/*=========================================================================
*Developer:Khoi Nguyen
*Date: 2/22/2017
*UCSD Code Bootcamp: Homework #6
In this assignment, attempting a modular object literal
design pattern. Keeping methods and functionality as separate 
as possible. Idea is to keep code sectioned for better maintenance and 
readability. Also, a single contained object.
==========================================================================*/
var gif = {
  authKey: "&api_key=dc6zaTOxFJmzC&limit=10",
  queryURLBase: "http://api.giphy.com/v1/gifs/search?",
  queryTerm: null,
  newUrl: null,
  topics: ["superman", "batman", "the flash", "wonder woman", "green lantern",
  "hawk girl", "iron man", "spiderman", "thor", "hulk", "magneto", "cyclops",
  "Gizmo Duck", "black panther", "captain america", "mighty mouse", 
  "darkwing duck"],
  status: false,
  
  //main controller init function 
  init: function () {
    this.cacheDom();
    this.bindEvents();
    this.renderBtns();
  },
  /*cache the DOM so we are not searching through the DOM over and over again.*/
  cacheDom: function () {
    //one time search of DOM 
    this.$submitBtn = $("#submit-btn");
    this.$searchTerm = $("#searchTerm");
    this.$btnArea = $("#place-btns");
    this.$dom = $(document.body);
    this.$stillGifs = $("#place-gifs");
  },
  //dedicated method for binding click events
  bindEvents: function () {
    /*listener for submit button click from user.
    Using bind(this) to keep context of the gif obj*/
    this.$submitBtn.on("click", this.addNewTopic.bind(this));
    /*using delagated events with selector for on() to apply
    listener to newly created / dynamic buttons.*/
    this.$dom.on("click", ".btn-success",this.runQueryBtnPanel);
    //listener for clicks on the still gif
    this.$dom.on("click", ".gif", this.changeStateGif);

  },
  //changing between still and animated resrouces from giphy.
  changeStateGif: function() {
    //maintaining context with self, this case the img clicked on.
    var self = $(this);
    var state = self.attr("data-state");
    var animate = self.attr("data-animate");
    var still = self.attr("data-still");
    //detected that image is still, change to animate url and update data-state to animate.
    if(state === "still") {
        self.attr("src", animate);
        self.attr("data-state", "animate");
    }//change to still url and update data sate to still.
    else {
        self.attr("src", still );
        self.attr("data-state", "still");
    }
  },//end of changeStateGif
  //recreates buttons and adds to the jumbotron from topics array.
  renderBtns: function () {
    //removing older set of buttons before adding on new set from pushed array.
    $(".btn-success").remove();
    //dynamically adding buttons to the jumbotron area.
    for(var i = 0; i < this.topics.length; i++) {
      var btn = $("<button>")
      btn.addClass("btn btn-lg btn-success");
      btn.attr("value", i);
      btn.text(this.topics[i]);
      this.$btnArea.append(btn);
    }
  },//end of renderBtns
  /*dedicated method who's sole purpose is to render 
  elements to the dom btn area per user input.*/
  addNewTopic: function () {
    console.log(this.$searchTerm.val());
    //pushing new user input to the array topics.
    gif.topics.push(this.$searchTerm.val());
    //now that we have pushed the new topic item, call renderBtns to recreate btns.
    gif.renderBtns();
    $("form").trigger("reset");
  },//end of addNewTopic
  renderGifs: function (data) {
    //remove existing img before appending new set of 10
    $(".container-gif").remove();
    //loop through ajax response data obj and dynamically append newly created elements to the DOM.
    for(var i = 0; i < data.data.length; i++){
      //dynamically creating new div container to hold both p and img of gif  
      var div = $("<div class='container-gif'>");
      var p = $("<p>");
      var str = p.text("Rating: " + data.data[i].rating);
      div.append(p);
      //dynamically creating img element and retreiving both static and dynamic url
      var img = $("<img>")
      var imageUrl = data.data[i].images.fixed_height.url;
      var static = data.data[i].images.fixed_height_still.url;
      //adding attributes to the image for still and animate options, finally append to div.
      img.addClass("gif");
      img.attr("src", static);
      //data still attr + url
      img.attr("data-still", static);
      //data animate attr + url
      img.attr("data-animate", imageUrl);
      //default state is still.
      img.attr("data-state", "still");
      div.append(img);
      //append entire div to the parent div with id="place-gifs."
      this.$stillGifs.append(div);
    }
  },//end of renderGifs
  //this method, assumes the responsibility of calling the API (request)
  //and dynamically appending DOM elements onto the HTML.
  runQueryBtnPanel: function () {
    console.log($(this).text());
    //console.log(this.queryTerm); 
    gif.queryTerm = $(this).text()
    gif.newUrl = gif.queryURLBase + "q=" + gif.queryTerm + gif.authKey;
    console.log(gif.newUrl);
    //ajax request via API from giphy
    $.ajax({
      url: gif.newUrl,
      method: "GET"
    }).done(function(response) { 
      //callback asynchronously from API when done. Package is JSON format 'response'.
      console.log(response);
      //calling the renderGifs method to append the payload.
      gif.renderGifs(response);
    });//end of ajax call back function. 
  }//end of runQueryBtnPanel
}
//initiating the object gif
gif.init();



