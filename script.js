var categories =  {};
var sites;

async function loadJson(file) {
  const response = await fetch(file);
  return await response.json();
}

async function showCategories() {
  categories = await loadJson('./data/categories.json');

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
  });

}

async function showLinks(category) {
  if (!sites) { await loadSitesByCategory(); }

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


$(document).ready(function() {

  showCategories();

  // Click on category
  $("#categories").on("click", ".category-image", function() {

    $(".hero").css("height", "20vh");
    $("#categories").hide();
    $("#links").show();

    // Display category information
    var currentCategory = $(this).attr("id");
    $("#title").text(categories[currentCategory].fullTitle);
    $("#description").text(categories[currentCategory].description);
    showLinks(currentCategory);
  });

  // Click on back button from a category
  $("#back").on("click", function() {
    $("#links").hide();
    $("#categories").show();
  })

})
