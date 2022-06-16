<template>
    <div>
        <div class="wrapper">
            <!-- Sidebar -->
            <nav id="sidebar">
                <ul class="list-unstyled components">
                    <div class="sidebar-header">
                        <img class="img-fluid" src="../assets/img/logo-white.png">
                        <hr>
                    </div>

                    <li v-if="roleUserLogged == 'M' || roleUserLogged == 'A'">
                        <a href="usuarios">Gestão de Usuários</a>
                    </li>

                    <li>
                        <a href="replicacoes">Replicação</a>
                    </li>

                    <li>
                        <a href="wiki">Wiki</a>
                    </li>

                    <li>
                        <a href="javascript:;" @click="logout()">Sair</a>
                    </li>
                </ul>
            </nav>

            <div id="content">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <div class="container-fluid">
                        <button type="button" id="sidebarCollapse" class="btn btn-outline-dark" @click="clique()">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
  </div>
</template>

<script>
import '../assets/style/style.css'
import scrypt from "../assets/js/scrypt";

export default {
    data(){
        return {
            roleUserLogged: ''
        }
    },
    created(){
        this.myFunction();
    },
    methods: {
        clique() {
            scrypt.clique(this);
        }, 
        myFunction(){
            this.roleUserLogged = localStorage.getItem("roleUser")
        },
        logout(){
           if(confirm("Deseja sair?")){
                localStorage.removeItem("token")
                localStorage.removeItem("roleUser")
                localStorage.removeItem("redeIdUser")
                localStorage.removeItem("loginUser")
                this.$router.push({name: "Home"})
           }
        }
    }
}
</script>
