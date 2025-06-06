import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { username, role }
    const navigate = useNavigate();

    const login = (username, password) => {
        // Fake user auth
        const fakeUsers = [
            { username: "sales", password: "sales123", role: "sales" },
            { username: "service", password: "service123", role: "service" },
            { username: "accounts", password: "accounts123", role: "accounts" },
            { username: "admin", password: "admin123", role: "admin" },
        ];

        const matchedUser = fakeUsers.find(
            (u) => u.username === username && u.password === password
        );

        if (matchedUser) {
            setUser({ username: matchedUser.username, role: matchedUser.role });
            // Redirect based on role
            switch (matchedUser.role) {
                case "sales":
                    navigate("/sales");
                    break;
                case "service":
                    navigate("/service-details");
                    break;
                case "accounts":
                    navigate("/accounts");
                    break;
                case "admin":
                    navigate("/admin");
                    break;
                default:
                    break;
            }
        } else {
            alert("Invalid credentials");
        }
    };

    const logout = () => {
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
