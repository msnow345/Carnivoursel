/*
+------------------------------------------------------------------------------+
|                                              
|  Jquery Plugin: VidScraper
|  
+------------------------------------------------------------------------------+
 */
  
  
(function( $ ){  

    $.fn.carniVoursel = function() {                                              
          

        //+------------------------------------------------------------------------+
      
        return this.each(function() {   

    
            var SETTINGS = {                            //User Amendable Settings

                //Slideshow Default Options
                fluid:false,                //If carousel is to be fluid
                slideWidth: 600,                
                slideHeight: 400,           
                infiniteCarousel: true,    //SORT OF WORKING BUT ENTIRELY GROSS. ONLY WORKS FORWARD.
                autoPlay:false,                 
                timer: 6000,

                //Youtube Options
                youTube:false,                  //If false, no options below this work.
                search: "Pug",                  //String to search for
                numberOfSlides: 5,              //Number of slides
                thumbnailStrip: false
            
            };


            var VARIABLES = {

                $this : $(this),

                parsedSearch : SETTINGS.search.replace(/ /g,"+"),

                channelUrl : "http://gdata.youtube.com/feeds/api/videos?q=" + SETTINGS.search.replace(/ /g,"+") + "&start-index=21&max-results=" + SETTINGS.numberOfSlides + "&v=2&alt=json" //Channel URL String formed from settings

            };


            var FUNCTIONS = {

                
                initMainFunction : function() {  


                    FUNCTIONS.checkVideos();         
                    
                    FUNCTIONS.setWrapper();

                    FUNCTIONS.bindControls();

                    FUNCTIONS.autoPlay();


                },


                populateVideos : function (){                               //Request data from youtube API, Wait for response.

                    var channel = (function () {
                      json = null;
                        $.ajax({
                            'async': false,                                 //Needs amending.!!!!!!!!!!!!!!!!!!!!!!
                            'global': false,
                            'url': VARIABLES.channelUrl,
                            'dataType': "json",
                            'success': function (data) {
                                json = data;
                            }
                        });

                        return json;

                    })(); 

                    return channel;

                },


                printVideos : function(channelStore){                   //Print Videos out to list based on number of slides.

                    var youtubeWrapper = $(".youtubelist");
                    var thumbnailWrapper = $(".thumbnails");

                    for (var i = 0; i < SETTINGS.numberOfSlides; i++) {

                        youtubeWrapper.append('<li><iframe class="youtube-player" type="text/html" height="' + SETTINGS.slideHeight + '" width="' + SETTINGS.slideWidth + '" src="' + channelStore.feed.entry[i].content.src + '"></iframe></li>');

                        if(SETTINGS.thumbnailStrip === true){

                            thumbnailWrapper.append('<li><img src="' + channelStore.feed.entry[i].media$group.media$thumbnail[0].url + '" /></li>');

                         }



                        }

                     },


                setWrapper : function(){

                    var wrapper = $('.wrapper');

                    wrapper.width(SETTINGS.slideWidth);

                },



                bindControls : function(){

                    var currentPosition;
                    var movement;
                    var movementPx;
                    var clone = false;
                    var youtubeWrapper = $(".youtubelist");
                    var next = VARIABLES.$this.find('.next');
                    var previous = VARIABLES.$this.find('.previous');


                    next.on('click', function(){

                        widthCheck = FUNCTIONS.slideWidth();

                        currentPosition = FUNCTIONS.getPosition();


                        if(SETTINGS.infiniteCarousel === true){

                        if(
                                currentPosition != "auto" && 
                                currentPosition  != "0px" && 
                                parseInt(currentPosition, 10) % SETTINGS.slideWidth !== 0
                        ){
                                console.log(parseInt(currentPosition, 10) % SETTINGS.slideWidth);
                                return false;

                        }


                        if( 
                                parseInt(currentPosition, 10) === -widthCheck + SETTINGS.slideWidth
                        ){

                                list = VARIABLES.$this.find('.youtubelist').children().last();
                               
                                shiftSlides = $(list);

                                shiftSlides.clone().prependTo(VARIABLES.$this.find('.youtubelist'));

                                VARIABLES.$this.find('.youtubelist').children().first().addClass('absolute');

                                clone = true;

                        }    

                        
                        }else{

                        if(
                                currentPosition != "auto" && 
                                currentPosition  != "0px" && 
                                parseInt(currentPosition, 10) % SETTINGS.slideWidth !== 0 ||
                                parseInt(currentPosition, 10) === -widthCheck 
                        ){
                                console.log(parseInt(currentPosition, 10) % SETTINGS.slideWidth);
                                return false;

                        }

                        }

                        switch(currentPosition){

                            case "":
                            $(".youtubelist").addClass('animation');
                            movementPx = "-" + SETTINGS.slideWidth + "px";
                            break;

                            case "auto":
                            $(".youtubelist").addClass('animation');
                            movementPx = "-" + SETTINGS.slideWidth + "px";
                            break;

                            case "0px": 
                            $(".youtubelist").addClass('animation');
                            movementPx = "-" + SETTINGS.slideWidth + "px";
                            break;

                            default:

                            movement = parseInt(currentPosition, 10) - SETTINGS.slideWidth;
                            movementPx = movement + 'px';
                            break;

                        }


                        youtubeWrapper.css({left: movementPx});


                        setTimeout(function(){

                            if( 
                                clone === true
                             ){

                                VARIABLES.$this.find('.youtubelist').children().first().removeClass('absolute');
                                
                                $(".youtubelist").removeClass('animation');

                                $(".youtubelist").removeAttr( 'style' );

                                VARIABLES.$this.find('.youtubelist').children().last().remove();

                                currentPosition = "0px";
                               
                                clone = false;

                        }

                        }, 350)
                        
                        

                    });


                    previous.on('click', function(){

                        widthCheck = FUNCTIONS.slideWidth();

                        currentPosition = FUNCTIONS.getPosition();

                        
                        if(SETTINGS.infiniteCarousel === true){

                        if(
                                parseInt(currentPosition, 10) % SETTINGS.slideWidth !== 0 
                        ){

                                return false;

                        }


                        if( 
                                parseInt(currentPosition, 10) === "0px" || parseInt(currentPosition, 10) === "auto"
                        ){

                                list = VARIABLES.$this.find('.youtubelist').children().last();
                               
                                shiftSlides = $(list);

                                shiftSlides.clone().prependTo(VARIABLES.$this.find('.youtubelist'));

                                VARIABLES.$this.find('.youtubelist').children().first().addClass('absolute');

                                clone = true;

                        }    

                        
                        }else{


                        if(
                        parseInt(currentPosition, 10) % SETTINGS.slideWidth !== 0 
                        ){


                            return false;
                        }

                    }

                        switch(currentPosition){

                            case "auto": 
                            movementPx = null;
                            break;

                            case "0px": 
                            movementPx = null;
                            break;

                            default:

                            movement = parseInt(currentPosition, 10) + SETTINGS.slideWidth;
                            movementPx = movement + 'px';
                            break;

                        }

                        // FUNCTIONS.infiniteOption();
                        youtubeWrapper.css({left: movementPx});
                        
                        
                    });

                },

                getPosition : function(){

                    var youtubeWrapperpos = $(".youtubelist").css('left');

                    return youtubeWrapperpos;

                },

                checkVideos : function(){

                    if(SETTINGS.youTube === true){

                    var channelStore = FUNCTIONS.populateVideos();
                    FUNCTIONS.printVideos(channelStore);

                     }else{
                     return false;
                    }

                },

                slideWidth: function(){   

                 var totalWidth = ((VARIABLES.$this.find('.youtubelist').children().size()) * SETTINGS.slideWidth) - SETTINGS.slideWidth;

                 return totalWidth;

                },


                infiniteOption: function(){   

                    if(SETTINGS.infiniteCarousel === true){

                        $list = VARIABLES.$this.find('.youtubelist li');
                       
                        $firstSlide = $list.first();

                        $lastSlide = $list.last();

                        $firstSlide.prependTo(VARIABLES.$this.find('.youtubelist'));

                        $lastSlide.appendTo(VARIABLES.$this.find('.youtubelist'));


                    }else{

                        return true;

                    }


                },

                resetLeft: function(){

                    var youtubeWrapper = $(".youtubelist");
                    youtubeWrapper.css({left: '0px'});

                },

                autoPlay: function(){

                    if(SETTINGS.autoPlay === true){


                        setInterval(function(){
                            $('.next').click();
                        }, SETTINGS.timer);

                    }
                }

            };

            //+----------------------------------------------------------------------+
      
            FUNCTIONS.initMainFunction();
           
            //+----------------------------------------------------------------------+

        });

    };
  
})( jQuery );