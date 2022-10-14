let exports = {};

exports.clique = () => {
    var X = document.getElementById("sidebar").className;
    if (X == "") {
        document.getElementById("sidebar").className = "active"
    } else {
        document.getElementById("sidebar").className = ""
    }
};

exports.serverIP = 'http://localhost:4000'
//exports.serverIP = 'http://replic.maximusgestao.com:4000'


export default exports

