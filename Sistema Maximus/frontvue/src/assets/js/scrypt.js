let exports = {};

exports.clique = () => {
    var X = document.getElementById("sidebar").className;
    if (X == "") {
        document.getElementById("sidebar").className = "active"
    } else {
        document.getElementById("sidebar").className = ""
    }
};

exports.serverIP = '67.207.84.123'

export default exports

