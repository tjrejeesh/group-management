import * as React from 'react';
function tokenGenerator() {
    const store = JSON.parse(localStorage.getItem('token'));
    const tokenValue = "Bearer " + store.token;
    return tokenValue;
}

export {tokenGenerator};
