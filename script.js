var categories;
var sites;

async function loadJson(file) {
  const response = await fetch(file);
  return await response.json();
}

async function showRandomQuote() {
  quotes = await loadJson('./data/quotes.json');
  var quote = quotes[Math.floor(Math.random() * quotes.length)];
  $("#quote").text(quote);
}

async function showCategories() {
  if (!categories) {
    categories = await loadJson('./data/categories.json');
  }

  var keys = Object.keys(categories);

  keys.forEach(key => {
    var text = $("<p></p>").text(categories[key].shortTitle);
    var div = $("<div></div>")
      .addClass("category-image")
      .attr("id", key)
      .css({
        "background-image": "url('" + categories[key].image + "')",
        "background-size": "cover"
      })
      .append(text);

    $("#categoryList").append(div);
  });
}


async function loadSitesByCategory() {
  var sitesData = await loadJson('./data/sites.json');

  sites = {};
  Object.keys(categories).forEach(key => {   // assumes categories is already loaded
    sites[key] = [];
  });

  // Add each site to categories
  sitesData.forEach(site => {
    site["categories"].forEach(category => {
      sites[category].push(site);
    });
    sites["all"].push(site);
  });

  // Sort alphabetical
  Object.keys(categories).forEach(key => {
    sites[key].sort(function(a, b) {
      if (a["title"] < b["title"]) return -1;
      if (a["title"] > b["title"]) return 1;
      return 0;
    })
  });

}

async function showLinks(category) {
  if (sites == null) { await loadSitesByCategory(); }

  $("#linkList").html(""); // clear any previous links

  sites[category].forEach(site => {
    var siteDiv = $("<div></div>").addClass("link");
    var link = $("<a></a>").attr("href", site["url"]);
    link.append($("<p></p>").text(site["title"]));
    siteDiv.append(link);
    siteDiv.append($("<p></p>").addClass("description").text(site["description"]));
    $("#linkList").append(siteDiv);
  })
}

async function makeLinkView(category) {

  // Display category information
  if (categories == null) {
    categories = await loadJson('./data/categories.json');
  }

  if (categories[category]) {
    $("#categories").hide();
    $("#links").show();

    showLinks(category);
    $("#title").text(categories[category].fullTitle);
    $("#description").text(categories[category].description);
  } else {
    window.location.href= "index.html";
  }

}


$(document).ready(function() {
  // Check for category in the URL
  var url = new URL(window.location.href);
  var category = url.searchParams.get("category");
  if (category) {
    // Show page for specific category
    makeLinkView(category);
  } else {
    // Show the main page
    showCategories();
  }

  showRandomQuote();

  // Hide footer
  $(".avoid .button").click(function() {
    $("#footer").fadeOut(300);
  })

  // Click on category
  $("#categories").on("click", ".category-image", function() {

    var currentCategory = $(this).attr("id");
    location.href += "?category=" + currentCategory;
    //window.history.replaceState(null, null, "?category=" + currentCategory);
    //makeLinkView(currentCategory);

  });

  $("#allLinks").on("click", function() {
    window.history.replaceState(null, null, "?category=all");
    makeLinkView("all");
  })

  // Click on back button from a category
  $("#back").on("click", function() {
    window.history.replaceState(null, null, "index.html");
    $("#links").hide();
    $("#categories").show();
    if ($("#categoryList").text() == "") { showCategories(); }
  })

})
