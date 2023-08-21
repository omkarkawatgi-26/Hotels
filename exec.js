const url = "https://api.unsplash.com/search/photos?page=1&query=office&client_id=_-gJDXlZw4ZiGaTbFq2hwqgUfoezzleVzhQHwkoznzA"

fetch(url)
    .then((data) => {
        console.log(data.urlList);
    })