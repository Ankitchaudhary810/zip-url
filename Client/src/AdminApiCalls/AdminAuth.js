const API = "http://localhost:1234/admin"

export const AdminSignup = async (user) => {
    try {
        const response = await fetch(`${API}/signup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        return console.log(err);
    }
};

export const AdminSignin = async (user) => {
    try {
        const response = await fetch(`${API}/signin`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        return console.log(err);
    }
}

export const AdminaAthenticate = (data, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("adminjwt", JSON.stringify(data));
        next();
    }
};


export const AdminIsAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }
    if (localStorage.getItem("adminjwt")) {
        return JSON.parse(localStorage.getItem("adminjwt"));
    } else {
        return false;
    }
};

export const AdminSignout = next => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("adminjwt");
        next();
        return fetch(`${API}/signout`, {
            method: "GET"
        })
            .then(response => console.log("Admin signout success"))
            .catch(err => console.log(err));
    }
};

export const AdminGetUsers = async (adminId, admintoken) => {
    try {
        const response = await fetch(`${API}/users/${adminId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${admintoken}`,
            },
        })
        return await response.json();
    } catch (error) {
        return error;
    }
}

export const AdminUserUrls = async (adminId, userId, admintoken) => {
    try {
        const response = await fetch(`${API}/users/url/${userId}/${adminId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${admintoken}`,
            }
        });
        return await response.json();
    } catch (error) {
        return error;
    }
}

export const AdminDeleteUser = async (adminId, userId, admintoken) => {
    try {
        const response = await fetch(`${API}/user/account/delete/${userId}/${adminId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${admintoken}`
            }
        });
        return await response.json();
    } catch (error) {
        return error;
    }
}
export const AdminReports = async (admintoken, id) => {
    try {
        const response = await fetch(`${API}/user-side/reports/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${admintoken}`,
            }
        });
        return await response.json();
    } catch (error) {
        return error
    }
}


export const DeleteUserUrl = async (admintoken, urlId, userId) => {
    try {
        const response = await fetch(`${API}/user/delete/url/${urlId}/${userId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${admintoken}`,
            }
        });
        return await response.json();
    } catch (error) {
        return error
    }
}