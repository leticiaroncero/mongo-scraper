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

    $(".note-form").on("submit", function(event) {
        event.preventDefault();
        var noteBody = $(this).find("input").val().trim();
        var articleId = $(this).attr("data-article-id");

        $.post("/api/articles/" + articleId, {
            body: noteBody
        }).then(function () {
            location.reload();
        });
    });

    $(".delete-note").on("click", function() {
        var noteId = $(this).attr("data-note-id");
        $.ajax({
            url: "/api/articles/" + noteId,
            method: "DELETE"
        }).then(function () {
            location.reload();
        });
    });
});
