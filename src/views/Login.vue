<template>
    <div id="login">
        <div class="login-section-wrapper">
            <img
                style="
                    width: auto;
                    height: 200px;
                    margin: 1rem auto;
                    text-align: center;
                    display: block;
                "
                :src="coverUrl"
            />
            <div class="login-section-input-wrapper">
                <el-input
                    size="small"
                    placeholder="账号"
                    v-model="loginForm.account"
                ></el-input>
                <el-input
                    size="small"
                    placeholder="密码"
                    type="password"
                    v-model="loginForm.password"
                    @keyup.enter="login"
                ></el-input>
            </div>
            <div class="login-section-button-wrapper">
                <el-button @click="login" size="small" type="primary"
                    >登陆</el-button
                >
                <el-button @click="reset" size="small">重置</el-button>
            </div>
        </div>
    </div>
</template>

<script>
const coverUrl = require('../static/img/cover.jpg');
export default {
    data() {
        return {
            loading: false,
            loginForm: {
                account: null,
                password: null
            },
            coverUrl
        };
    },
    methods: {
        login() {
            this.loading = true;
            this.$axios
                .postFetch(this.$api.login, {
                    account: this.loginForm.account,
                    password: this.loginForm.password
                })
                .then(res => {
                    this.$auth.login(res.data.token);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        reset() {
            this.$set(this, `loginForm`, {
                account: null,
                password: null
            });
        }
    },
    mounted() {
        if (localStorage.getItem(`token`)) {
            this.$router.push('/admin');
        }
    }
};
</script>

<style lang="scss" scoped>
#login {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .login-section-wrapper {
        width: 500px;
        height: 400px;
        background-color: white;
        border-radius: 16px;
    }
    .login-section-button-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
    }
    .login-section-input-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .el-input {
            margin: 0.5rem 0;
            width: 15rem;
        }
    }
}
</style>
