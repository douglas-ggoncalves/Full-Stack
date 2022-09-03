let exports = {};

exports.clique = () => {
    var X = document.getElementById("sidebar").className;
    if (X == "") {
        document.getElementById("sidebar").className = "active"
    } else {
        document.getElementById("sidebar").className = ""
    }
};

exports.serverIP = 'localhost:4000'

export default exports

