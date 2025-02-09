import Cookies from 'js-cookie'

export const storeCookies = async (user_data) => {
    Cookies.set('user', JSON.stringify(user_data), { expires: 1 })
    Cookies.set('isAuthenticated', true, { expires: 1 })
}

export const getCookies = async () => {
    const user = Cookies.get('user')
    const isAuthenticated = Cookies.get('isAuthenticated')
    const expires = Cookies.get('expires')
    return { user, isAuthenticated, expires }
}

export const checkExpired = async () => {
    const expires = Cookies.get('expires')
    if (Cookies.get('user') === undefined) {
        return true
    }
    if (expires < new Date()) {
        Cookies.remove('user')
        Cookies.remove('isAuthenticated')
        Cookies.remove('expires')
        return true
    } else {
        return false
    }
}
