import React, { useState, useEffect } from 'react';
import { FaDiscord } from 'react-icons/fa';

// Centralized API base URL
const API_BASE_URL = 'http://localhost:4000';
//const API_BASE_URL = '/api';

function Login() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkingWhitelist, setCheckingWhitelist] = useState(false);
    const [isWhitelisted, setIsWhitelisted] = useState(false);

    // Hardcoded allowed role IDs and guild ID
    const allowedGuildId = '972594004485103637'; // KSU Combat Robotics
    const allowedRoleIds = [
        '1015665083935903775', // Club Advisor
        '981962694611566622', // Officer
        '1387983504351957114', // Website Editor
    ];

    // Fetch user info
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${API_BASE_URL}/info`, { credentials: 'include' })
            .then(res => {
                if (res.status === 401) return null;
                return res.json();
            })
            .then(userInfo => {
                setUser(userInfo?.user ?? null);
            })
            .catch((err) => {
                setError('Failed to load authentication info.');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    // Check whitelist by Discord roles in a specific guild
    useEffect(() => {
        if (!user || !user.guilds || !Array.isArray(user.guilds)) {
            setIsWhitelisted(false);
            return;
        }
        setCheckingWhitelist(true);
        // Find the guild object for the allowed guild
        const guild = user.guilds.find((g: any) => g.id === allowedGuildId);
        let allowed = false;
        if (guild && guild.roles && Array.isArray(guild.roles)) {
            allowed = guild.roles.some((role: string) => allowedRoleIds.includes(role));
        }
        setIsWhitelisted(allowed);
        setCheckingWhitelist(false);
    }, [user]);

    const handleLogin = () => {
        window.location.href = `${API_BASE_URL}/discord-login`;
    };

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/logout`, { credentials: 'include' });
            console.log('Logout response:', res);
            if (res.ok) {
                setUser(null);
                if (window.location.pathname !== '/login') {
                    window.location.assign('/login');
                }
            } else {
                const text = await res.text();
                setError('Logout failed.' + text);
                console.error('Logout failed:', text);
            }
        } catch (err) {
            setError('Logout failed.' + err);
            console.error('Logout failed 2:', err);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 18, color: '#888' }}>Loading authentication...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red' }}>
                <div>{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <button onClick={handleLogin} style={{ fontSize: 20, padding: '12px 32px', borderRadius: 8, background: '#5865F2', color: 'white', border: 'none', cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center' }}>
                    <FaDiscord style={{ marginRight: 12, width: 28, height: 28, verticalAlign: 'middle' }} />
                    <span style={{ fontWeight: 700, fontSize: 22 }}>Login with Discord</span>
                </button>
                <div style={{ color: '#888', fontSize: 16 }}>You must log in with Discord to access this page.</div>
            </div>
        );
    }

    if (checkingWhitelist) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 18, color: '#888' }}>Checking whitelist...</div>
            </div>
        );
    }

    if (!isWhitelisted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                <h2>Access Restricted</h2>
                <p>
                    Your Discord account is not on the whitelist.<br />
                    Please contact a member of the club to gain access.
                </p>
                <button onClick={handleLogout} style={{ marginTop: 20, fontSize: 16, padding: '8px 24px', borderRadius: 6, background: '#5865F2', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Log Out
                </button>
            </div>
        );
    }

    // Authenticated and whitelisted
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#222', color: 'white', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px #0002' }}>
                <div style={{ marginBottom: 16, fontSize: 22, fontWeight: 700 }}>Welcome!</div>
                <div style={{ marginBottom: 8 }}>Discord UID: <b>{user.id}</b></div>
                <div style={{ marginBottom: 8 }}>Discord Username: <b>{user.username || user.displayName || user.full_name || user.name || 'Unknown'}</b></div>
                <button onClick={handleLogout} style={{ marginTop: 18, fontSize: 16, padding: '8px 24px', borderRadius: 6, background: '#5865F2', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Log Out
                </button>
            </div>
        </div>
    );
}

export default Login;