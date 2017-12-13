$( document ).ready(function() {
  var movie = $("#movie");
  var Movies = [];
  var displayPage = 1;
  var pageDisplayed = 0;
  var totalPages = 1;
  var columnsPerPage = 6;
  var columnSize = "col-xs-2";
  var rowsPerPage = 3;

  $(document).on("click", "#Search", function (){
    searchMovies(movie.val());
  });
  $(document).on('keyup', "#movie", function (e) {
      if (e.keyCode == 13) {
         searchMovies(movie.val());
      }
  });
  $(document).on("click", ".btn", function() {
    ChangePage($(this).text());
  });

  $(document).on("click", ".smallPic", function() {
      GetMovie($(this).data("imdbID"));
  });

  function ChangePage(page) {
    var x=Movies.length;
    if (page === "«") {
      displayPage = 1;
    } else if (page === "<") {
      if (displayPage > 1) displayPage--;
    } else if (page === ">") {
      if (displayPage < totalPages) displayPage++;
    } else if (page === "»") {
      displayPage = totalPages;
    } else {
      displayPage = parseInt(page);
    }
    updateDisplay();
    updateButtons();
  }

  function searchMovies(title) {
    var title = title.replace(" ", "+");
    var title = title.replace(":", "+");
    var title = title.replace("-", "+");
    var title = title.replace(",", "+");
    displayPage = 1;
    pageDisplayed = 0;
    totalPages = 1;
    Movies = [];
    getAllMovies(title, 1);
  }

  function getAllMovies(title, page) {
    var queryURL = "https://www.omdbapi.com/?s=" + title + "&page=" + page + "&plot=short&r=json&apikey=trilogy";
    $.ajax({ 
      url: queryURL, 
      method: "GET" })
    .done(function(response) {
      for (i=0; i<response.Search.length; i++) {
        Movies.push(response.Search[i]);
      }
      updateDisplay();
      updateButtons();
      if (response.totalResults > Movies.length) getAllMovies(title, page+1);
    })
  }

  function updateButtons(){
    var n = 10;
    var totalRows = Math.floor((Movies.length-1)/columnsPerPage)+1;
    var beg = displayPage;
    var end = displayPage + n;
    totalPages = Math.floor((totalRows-1)/rowsPerPage)+1;
    if (end > totalPages) {
      beg = totalPages - n;
      if (beg < 1) beg = 1;
      end = totalPages;
    }
    var pages = '<a href="#" class="btn btn-primary">&laquo;</a>';
    pages += '<a href="#" class="btn btn-primary">&lt;</a>';
    for (i=beg; i<=end; i++) {
      if (i === displayPage) {
        pages += '<a href="#" class="btn btn-primary bolded">' + i + '</a>';
      } else {
        pages += '<a href="#" class="btn btn-primary">' + i + '</a>';
      }
    }
    pages += '<a href="#" class="btn btn-primary">&gt;</a>';
    pages += '<a href="#" class="btn btn-primary">&raquo;</a>';
    $("#buttons").html(pages);
  }

  function updateDisplay() {
    if (pageDisplayed === displayPage) return;
    var beg = ((displayPage-1)*columnsPerPage*rowsPerPage);
    var end = (displayPage*columnsPerPage*rowsPerPage);
    if (i >= Movies.length) return;
    var html = $("#coverRows");
    html.html("");
    for (i=beg; i<end; i++) {
      if (i >= Movies.length) break;
      if ((i % columnsPerPage) === 0) {
        var row = $("<div>");
        row.addClass("row");
        html.append(row);
      }
      var col = $("<div>");
      col.addClass(columnSize)
      row.append(col);
      var img = $("<img>");
      img.addClass("smallPic");
      img.attr("src", Movies[i].Poster);
      img.attr("alt", Movies[i].Title + " [" + Movies[i].Year + "]");
      img.attr("title", Movies[i].Title + " [" + Movies[i].Year + "]");
      img.data("imdbID",Movies[i].imdbID)
      col.append(img);
      }
    pageDisplayed = displayPage;
  }

  function GetMovie(imdbID) {
    var queryURL = "https://www.omdbapi.com/?i=" + imdbID + "&y=&plot=Full&apikey=trilogy";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
      $("#poster").attr("src", response.Poster);
      $("#title").text(response.Title + ' (' + response.Year + ')');
      var details = '';
      details += 'Type: ' + response.Type;
      details += '<br>';
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
      DataPopupOpen("moviePopup");
    });
  };
})