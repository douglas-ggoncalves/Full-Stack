<template>
    <div class="home" id="divMainWhatsApp">
        <div class="wrapper">
            <!-- Sidebar -->
            <nav id="sidebar">
                <ul class="list-unstyled components">
                    <div class="sidebar-header">
                        <img class="img-fluid" src="../assets/img/logo-white.png">
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
                    <div id="app">
                        <h1>Status da API</h1>
                        
                        <div class="status-container">
                            <div class="status-badge" :class="{
                                'online': apiStatus === true,
                                'offline': apiStatus === false,
                                'loading': apiStatus === null
                            }">
                                <span class="status-dot" :class="{
                                    'online': apiStatus === true,
                                    'offline': apiStatus === false,
                                    'loading': apiStatus === null
                                }"></span>
                                {{ statusText }}
                            </div>

                            <div class="status-info">
                                {{ statusDescription }}
                            </div>

                            <div class="actions">
                                <button class="btn primary" @click="checkStatus" :disabled="loading">
                                    <span :class="{ 'spinning': loading }">⟳</span>
                                    {{ loading ? 'Verificando...' : 'Verificar Status' }}
                                </button>
                                <button class="btn" @click="toggleAutoRefresh">
                                    {{ autoRefresh ? '⏸ Pausar' : '▶ Auto-refresh' }}
                                </button>
                            </div>

                            <div class="last-check" v-if="lastCheck">
                                Última verificação: {{ lastCheck }}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import VModal from 'vue-js-modal';
import '../assets/style/style.css';
import Multiselect from 'vue-multiselect';

Vue.component('multiselect', Multiselect)

Vue.use(VModal, {
  dynamicDefaults: {height: 'auto'} 
})

export default {
  data() {
    return {
        apiStatus: null,
        loading: false,
        lastCheck: null,
        autoRefresh: true,
        apiUrl: 'https://replic.maximusgestao.com:4000/api/whatsapp/status',
        refreshInterval: null
    }
  },
  computed: {
        statusText() {
            if (this.apiStatus === true) return 'API Online';
            if (this.apiStatus === false) return 'API Offline';
            return 'Verificando...';
        },
        statusDescription() {
            if (this.apiStatus === true) return 'Conexão estabelecida com sucesso';
            if (this.apiStatus === false) return 'Não foi possível conectar à API';
            return 'Aguarde enquanto verificamos a conexão';
        }
    },
    methods: {
        async checkStatus() {
            this.loading = true;
            
            try {
                const response = await fetch(this.apiUrl);
                const data = await response.json();
                
                this.apiStatus = data.status === true;
                this.updateLastCheck();
            } catch (error) {
                console.error('Erro ao verificar status da API:', error);
                this.apiStatus = false;
                this.updateLastCheck();
            } finally {
                this.loading = false;
            }
        },
        updateLastCheck() {
            const now = new Date();
            this.lastCheck = now.toLocaleString('pt-BR');
        },
        toggleAutoRefresh() {
            this.autoRefresh = !this.autoRefresh;
            
            if (this.autoRefresh) {
                this.startAutoRefresh();
            } else {
                this.stopAutoRefresh();
            }
        },
        startAutoRefresh() {
            this.refreshInterval = setInterval(() => {
                this.checkStatus();
            }, 30000);
        },
        stopAutoRefresh() {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }
        }
    },
    mounted() {
        this.checkStatus();
        if (this.autoRefresh) {
            this.startAutoRefresh();
        }
    },
    beforeDestroy() {
        this.stopAutoRefresh();
    }
}
</script> 

<style scoped lang="scss">
    #divMainWhatsApp{
        h1 {
            font-size: 32px;
            font-weight: 600;
            color: #333;
            margin-bottom: 30px;
            text-align: center;
        }

        .status-container {
            background: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 20px;
        }

        .status-badge.online {
            background: #d1fae5;
            color: #065f46;
        }

        .status-badge.offline {
            background: #fee2e2;
            color: #991b1b;
        }

        .status-badge.loading {
            background: #fef3c7;
            color: #92400e;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .status-dot.online {
            background: #10b981;
        }

        .status-dot.offline {
            background: #ef4444;
        }

        .status-dot.loading {
            background: #f59e0b;
        }

        .status-info {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }

        .actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-bottom: 20px;
        }

        .btn {
            padding: 10px 20px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            color: #374151;
            font-weight: 500;
        }

        .btn:hover {
            border-color: #9ca3af;
            background: #f9fafb;
        }

        .btn:active {
            transform: scale(0.98);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .btn.primary {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
        }

        .btn.primary:hover {
            background: #2563eb;
            border-color: #2563eb;
        }

        .last-check {
            color: #9ca3af;
            font-size: 13px;
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .spinning {
            display: inline-block;
            animation: spin 1s linear infinite;
        }
    }
</style>