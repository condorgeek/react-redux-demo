export function authConfig() {
    //{headers: {'Access-Control-Allow-Origin': '*'};

    return  {
        headers: {...authHeader(), 'X-Requested-With': 'XMLHttpRequest'}
    };
}

export function authHeader() {
    const bearer = JSON.parse(localStorage.getItem('bearer'));


    if (bearer && bearer.token) {
        return { 'Authorization': 'Bearer ' + bearer.token };
    } else {
        return {};
    }
}

export function refreshHeader() {
    const bearer = JSON.parse(localStorage.getItem('bearer'));

    if (bearer && bearer.refreshToken) {
        return {'Authorization': 'Bearer ' + bearer.refreshToken};
    } else {
        return {};
    }
}