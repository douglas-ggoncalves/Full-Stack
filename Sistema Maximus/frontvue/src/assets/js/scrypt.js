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
//exports.serverIP = 'localhost:4000'
//exports.serverIP = '192.168.1.12:4000'


export default exports

