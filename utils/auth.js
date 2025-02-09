import Cookies from 'js-cookie'

export const storeCookies = async (user_data) => {
    Cookies.set('user', JSON.stringify(user_data), { expires: 1 })
    Cookies.set('isAuthenticated', true, { expires: 1 })
    Cookies.set('expires', new Date(Date.now() + 24 * 60 * 60 * 1000))
}

export const getCookies = async () => {
    const user = Cookies.get('user')
    const isAuthenticated = Cookies.get('isAuthenticated')
    const expires = Cookies.get('expires')
    return { user, isAuthenticated, expires }
}
export const checkExpired = () => {
    const expires = Cookies.get('expires')

    if (!Cookies.get('user')) {
        return true
    }

    if (!expires || new Date(expires) < new Date()) {
        // Convert expires to Date
        Cookies.remove('user')
        Cookies.remove('isAuthenticated')
        Cookies.remove('expires')
        return true
    }

    return false
}

export const logout = async () => {
    Cookies.remove('user')
    Cookies.remove('isAuthenticated')
    Cookies.remove('expires')
}

export const getUserRole = async () => {
    const user = Cookies.get('user')
    if (user) {
        return JSON.parse(user).role
    }
    return null
}

export const isAuthenticated = async () => {
    const isAuthenticated =
        Cookies.get('isAuthenticated') && checkExpired() === false
    if (isAuthenticated) {
        return true
    }
    return false
}
