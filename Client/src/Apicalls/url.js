const API = "http://localhost:1234/api"

export const createShortUrl = async (userId, Token, urlData) => {
    try {
        const response = await fetch(`http://localhost:1234/url/create/${userId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify(urlData)
        });
        return await response.json();
    } catch (error) {
        return error;
    }
}

export const getShortUrlByUserId = async (userId) => {
    try {
        const response = await fetch(`http://localhost:1234/api/urls/${userId}`, {
            method: "GET",
        })
        return await response.json();
    } catch (error) {
        return error
    }
}

export const deleteShortUrl = async (shortUrl, Token) => {
    try {
        const response = await fetch(`http://localhost:1234/delete/url`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`
            },
            body: JSON.stringify({ shortUrl })
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

export const getUrlInfoByShortUrl = async (shortUrl) => {
    try {
        const response = await fetch(`http://localhost:1234/url/${shortUrl}`, {
            method: "GET",
        })
        return await response.json();
    } catch (error) {
        return error
    }
}
