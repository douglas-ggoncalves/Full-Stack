// controllers/APIWhatsAppController.js
const axios = require('axios');

class APIWhatsAppController {
    async checkStatus(req, res) {
        try {
            const response = await axios.get('http://replic.maximusgestao.com:5019/APIWhatsAppConnection/CheckStatusAPI');
            
            return res.json(response.data);
        } catch (error) {
            console.error('Erro ao verificar status da API WhatsApp:', error.message);
            
            return res.status(500).json({
                status: false,
                error: 'Erro ao conectar com a API do WhatsApp',
                message: error.message
            });
        }
    }
}

module.exports = new APIWhatsAppController();