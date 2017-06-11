function articleCount(obj) {
    return obj.length;
};


// doc ready actions
$(document).ready(function(){
    
    // add click listeners to save buttons
  $(".save").on("click",function(){
      
      // what article on the page is this?
      var index=$(this).attr("data-index");
      // build article object for post route based on index
      var thisArticle = {
          headline: $("a[data-link-index='"+index+"']").text(),
          link: $("a[data-link-index='"+index+"']").attr("href"),
          summary: $(".summary[data-summary-index='"+index+"']").text()
      };
      $.post("/save",thisArticle);

      // now remove article from index page
      $(".article[data-index='"+ index +"']").slideUp("slow");  
    })

  // add click listener to remove button; we're not handling this entirely in back end because we want a nice slide-up action
  $(".remove").on("click",function(){
    $.get("/remove/"+$(this).attr("data-article-id"), function(success){
        if (success.message) {
            $(".article[data-id='"+success.id+"']").slideUp("slow");
        }
    })
});

  // populate note form with any existing notes and add article id to note form when note button is clicked
  $(".notes").on("click", function(){
      $.get("/getnote/"+$(this).attr("data-article-id"), function(data){
          if(data){
              $("#noteText").html(data[0].notes);
          }
      });

    // update hidden articleId input with article id, so we can match note with right article; this will get passed to the "/addnote" post route
    $("#articleId").attr("value",$(this).attr("data-article-id"));
  });

  // fun random tilt effect for each article well
  $(".well").each(function(index,element){
      var tilt = Math.floor((Math.random() * 5) -2);
      $(element).css("transform","rotate("+tilt+"deg)");
  })

}); // end document ready function