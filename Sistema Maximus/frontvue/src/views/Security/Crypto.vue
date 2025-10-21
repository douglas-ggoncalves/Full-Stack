<template>
    <div class="home" id="divMainCrypto">
        <div class="wrapper">
            <!-- Sidebar -->
            <nav id="sidebar">
                <ul class="list-unstyled components">
                    <div class="sidebar-header">
                        <img class="img-fluid" src="../../assets/img/logo-white.png">
                        <hr>
                    </div>

                    <li>
                        <a href="acessos">Acessos</a>
                    </li>

                    <li>
                        <a href="tarefas">Checagem Fecha Mês</a>
                    </li>

                    <li>
                        <a href="napp">Checagem Napp</a>
                    </li>

                    <li>
                        <a href="criptografia">Criptografia</a>
                    </li>

                    <li>
                        <a href="dashboard">Dashboard</a>
                    </li>

                    <li>
                        <a href="usuarios">Gestão de Usuários</a>
                    </li>

                    <li>
                        <a href="implantacoes">Implantações</a>
                    </li>

                    <li>
                        <a href="replicacoes">Replicação</a>
                    </li>
                    
                    <li>
                        <a href="versoes">Versões</a>
                    </li>

                    <li>
                        <a href="whatsAppApi">WhatsApp API Status</a>
                    </li>

                    <li>
                        <a href="wiki">Wiki</a>
                    </li>

                    <li>
                        <a href="javascript:;" @click="logout()">Sair</a>
                    </li>
                </ul>
            </nav>

            <div class="container-fluid" id="content">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <div class="container-fluid">
                        <button type="button" id="sidebarCollapse" class="btn btn-outline-dark" @click="clique()">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </nav>

                <div class="container">
                    <div class="field-group">
                        <div class="label-with-button">
                            <label>TEXTO ORIGEM</label>
                            <!-- Botão invisível para manter alinhamento -->
                            <button class="copy-btn invisible-btn" disabled>
                                📋 Copiar
                            </button>
                        </div>
                        <textarea v-model="originText" placeholder="Digite o texto aqui..."></textarea>
                    </div>
                    
                    <div class="field-group">
                        <div class="label-with-button">
                            <label>RESULTADO</label>
                            <button class="copy-btn" @click="copiarResultado" :disabled="!resultText">
                                {{ copiado ? '✓ Copiado!' : '📋 Copiar' }}
                            </button>
                        </div>
                        <textarea v-model="resultText" readonly ></textarea>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="descriptografar">🔓 Descriptografar</button>
                    <button @click="criptografar">🔒 Criptografar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import VModal from 'vue-js-modal';
import '../../assets/style/style.css';
import Multiselect from 'vue-multiselect';
import scrypt from "../../assets/js/scrypt";

Vue.component('multiselect', Multiselect)

Vue.use(VModal, {
  dynamicDefaults: {height: 'auto'} 
})

export default {
    data() {
        return {
                originText: '',
                resultText: '',
                copiado: false  
            }
        },
        methods: {
            async criptografar() {
                if (!this.originText.trim()) {
                    alert('Por favor, insira um texto para criptografar.');
                    return;
                }

                try {
                    const response = await fetch(`${scrypt.serverIP}/Cryptography/encrypt-text`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ text: this.originText })
                    });

                    if (!response.ok) {
                        alert('Erro ao criptografar. Verifique se o texto está em formato válido.');
                        return;
                    }

                    const data = await response.json();
                    this.resultText = data.text;
                } catch (err) {
                    console.error(err);
                    alert('Erro ao criptografar. Verifique se o texto está em formato válido.');
                }

            },
            async descriptografar() {
                if (!this.originText.trim()) {
                    alert('Por favor, insira um texto para descriptografar.');
                    return;
                }

                try {
                    const response = await fetch(`${scrypt.serverIP}/Cryptography/decrypt-text`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ text: this.originText })
                    });

                    const data = await response.json();
                    
                    if (!response.ok) {
                        alert(data.mensagem || 'Erro ao descriptografar. Verifique se o texto está em formato válido.');
                        return;
                    }

                    this.resultText = data.text;
                } catch (err) {
                    console.error(err);
                    alert('Erro ao descriptografar. Verifique se o texto está em formato válido.');
                }
            },
            async copiarResultado() {
                if (!this.resultText) return;
                
                try {
                    await navigator.clipboard.writeText(this.resultText);
                    this.copiado = true;
                    setTimeout(() => {
                        this.copiado = false;
                    }, 2000);
                } catch (err) {
                    console.error(err);
                    alert('Erro ao copiar texto');
                }
            }
        }
    }
</script> 

<style scoped lang="scss">
    #divMainCrypto{
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }

        .field-group {
            display: flex;
            flex-direction: column;
        }

        label {
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
            color: #333;
        }

        textarea {
            width: 100%;
            height: 500px;
            padding: 16px;
            border: 1px solid #d0d0d0;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            resize: none;
            background-color: #fafafa;
            transition: all 0.2s ease;
        }

        textarea:focus {
            outline: none;
            border-color: #999;
            background-color: white;
        }

        textarea:read-only {
            background-color: #f5f5f5;
            cursor: default;
        }

        .buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
        }

        button {
            padding: 12px 32px;
            background: white;
            border: 1px solid #d0d0d0;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        button:hover {
            background: #f8f8f8;
            border-color: #b0b0b0;
        }

        button:active {
            background: #f0f0f0;
        }

        .label-with-button {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            min-height: 21px;
        }

        .label-with-button label {
            margin-bottom: 0;
            line-height: 1.5;
        }

        .copy-btn {
            padding: 6px 14px;
            font-size: 12px;
            background: #4CAF50;
            color: white;
            border: none;
            transition: all 0.3s ease;
        }

        .copy-btn:hover:not(:disabled) {
            background: #45a049;
            transform: translateY(-1px);
        }

        .copy-btn:disabled {
            background: #cccccc;
            cursor: not-allowed;
            opacity: 0.6;
        }

        .invisible-btn {
            visibility: hidden;
            pointer-events: none;
        }

        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            #app {
                padding: 20px;
            }

            textarea {
                height: 300px;
            }
        }
    }
</style>