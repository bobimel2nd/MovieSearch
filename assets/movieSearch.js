$( document ).ready(function() {
  var movie = $("#movie");
  var pg = 1;
  var tp = 1;

  function ChangePage(page) {
    if (page === "«") {
      pg = 1;
    } else if (page === "&lt;") {
      if (pg > 1) pg--;
    } else if (page === "&gt;") {
      if (pg < tp) pg++;
    } else if (page === "»") {
      pg = tp;
    } else {
      pg = parseInt(page);
    }
    SearchMovie(movie.val(), pg);
  }

  $("#Search").on("click", function (){
    pg = 1;
    SearchMovie(movie.val(), pg);
  });
  $("#movie").on('keyup', function (e) {
      if (e.keyCode == 13) {
        pg = 1;
        SearchMovie(movie.val(), pg);
      }
  });

  function SearchMovie(title, page) {
    var title = title.replace(" ", "+")
    var title = title.replace(":", "+")
    var title = title.replace("-", "+")
    var queryURL = "https://www.omdbapi.com/?s=" + title + "&page=" + page + "&plot=short&r=json&apikey=trilogy";

    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
      // for each item returned
      for (i=0; i<10; i++) {
        var r = Math.floor(i/2);
        var c = (i%2)*5;
        var rowTds = $("table")
          .children()
          .eq(1)
          .children("tr")
          .eq(r)
          .children("td");
        if (i < response.Search.length) {
          // Setting the inner text of each td in the first row
          rowTds.eq(c+0).html('<img src="' + response.Search[i].Poster + '" alt="' + response.Search[i].imdbID + '" class="smallPic" height="50">');
          rowTds.eq(c+1).text(response.Search[i].Year);
          rowTds.eq(c+2).text(response.Search[i].Type);
          rowTds.eq(c+3).text(response.Search[i].Title);
        } else {
          rowTds.eq(c+0).html('');
          rowTds.eq(c+1).text('');
          rowTds.eq(c+2).text('');
          rowTds.eq(c+3).text('');
        }
      }
      // Total Pages
      tp = Math.floor(response.totalResults/10);
      if (response.totalResults%10 > 0) tp++;

      var n=10;
      if (tp < 10) n = tp;
      var s=page;
      var e=page+n;
      if (e > tp) {
        s = tp-n;
        e = tp;
      }
      var pages = '<a href="#" class="btn btn-primary">&laquo;</a>';
      pages += '<a href="#" class="btn btn-primary">&lt;</a>';
      for (i=s; i<=e; i++) {
        if (i === page) {
          pages += '<a href="#" class="btn btn-primary yellow">' + i + '</a>';
        } else {
          pages += '<a href="#" class="btn btn-primary">' + i + '</a>';
        }
      }
      pages += '<a href="#" class="btn btn-primary">&gt;</a>';
      pages += '<a href="#" class="btn btn-primary">&raquo;</a>';
      $("#buttons").html(pages);

      $('.btn').on("click", function() {
        ChangePage($(this).html());
      });

      // When the user clicks on an image, open the modal 
      $(".smallPic").on("click", function() {
          GetMovie($(this).attr("alt"));
          DataPopupOpen("moviePopup")
      });
    });
  }

  function GetMovie(imdbID) {
    var queryURL = "https://www.omdbapi.com/?i=" + imdbID + "&y=&plot=Full&apikey=trilogy";

    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
      $("#poster").attr("src", response.Poster);
      $("#title").text(response.Title + ' (' + response.Year + ')');
      var details = '';
      details += 'Rated: ' + response.Rated;
      details += '<br>';
      details += 'Released: ' + response.Released;
      details += '<br>';
      details += 'Runtime: ' + response.Runtime;
      details += '<br>';
      details += 'Director: ' + response.Director;
      details += '<br>';
      details += 'Cast: ' + response.Actors;
      details += '<br><br>';
      details += response.Plot;
      $("#details").html(details)
    });
  };
})