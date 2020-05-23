import router from '../router/index';

export const login = token => {
    localStorage.setItem(`token`, token);
    router.push(`/admin`);
};

export const logout = () => {
    localStorage.removeItem(`token`);
    router.push(`/login`);
};
