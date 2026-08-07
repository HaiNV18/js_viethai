// Get data users.json
function loadUser() {
    let xhr = new XMLHttpRequest;
    xhr.open("GET", "users.json", true);

    xhr.onload = function() {
        if (xhr.status == 200) {
            users = JSON.parse(xhr.responseText);
        }
    }
    xhr.send();
}
