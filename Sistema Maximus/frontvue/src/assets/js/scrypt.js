const connection = require("../../../../connection/backConnection.json")
let exports = {};

exports.clique = () => {
    var X = document.getElementById("sidebar").className;
    if (X == "") {
        document.getElementById("sidebar").className = "active"
    } else {
        document.getElementById("sidebar").className = ""
    }
};

exports.serverIP = connection.serverIP

export default exports

