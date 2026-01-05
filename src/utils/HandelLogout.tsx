export const handleLogout = () => {
        window.dispatchEvent(new Event("app:logout"));
    };