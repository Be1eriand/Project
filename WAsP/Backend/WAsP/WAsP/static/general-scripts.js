//highlight the current page on navbar
var navitems = document.querySelectorAll(".nav-link")

for(var i=0; i <navitems.length; i++) {
    console.log(navitems[i].textContent.trim())
    if (document.title == navitems[i].textContent.trim()) {
        navitems[i].classList.add("active")
    }
    else {
        navitems[i].classList.add("link-dark")
    }
}