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
      $(".article[data-index='"+ index +"']").remove();
  })

  // populate note form with any existing notes and add article id to note form when note button is clicked
  $(".notes").on("click", function(){
      $.get("/getnote/"+$(this).attr("data-article-id"), function(data){
          if(data){
              $("#noteText").html(data[0].notes);
          }
      });

      var idInput = $("<input>").attr(
          {
              type: "hidden",
              name: "articleId",
              "value": $(this).attr("data-article-id")
        });
        $("#note-form").append(idInput);
  });

}); // end document ready function