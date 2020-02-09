$(document).ready(function () {
    $("#scrape-new").on("click", function () {
        $.ajax({
            url: "/api/fetch",
            method: "GET"
        }).then(function () {
            location.reload();
        });
    });

    $("#clear").on("click", function () {
        $.ajax({
            url: "/api/clear",
            method: "GET"
        }).then(function () {
            location.reload();
        });
    });

});
