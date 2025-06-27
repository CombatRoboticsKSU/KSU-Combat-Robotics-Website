import { useState, useEffect } from 'react'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import { getSupabaseClient } from '@site/supabaseClient';


function Login() {
    const [session, setSession] = useState<any>(null);
    const [theme, setTheme] = useState('dark');
    const [edgeValue, setEdgeValue] = useState<string>('Not Users Found');
    const [supabase, setSupabase] = useState<any>(null);

    useEffect(() => {
        fetch('/api/edge-config')
        //fetch('http://localhost:4000/api/edge-config')
            .then(res => res.json())
            .then(data => setEdgeValue(data.value ?? null));

        const themeChoice = document.documentElement.getAttribute('data-theme-choice');
        setTheme(themeChoice === 'dark' ? 'dark' : 'supa');

        (async () => {
            try {
                const supabaseClient = await getSupabaseClient();
                if (!supabaseClient) {
                    throw new Error('Supabase client is undefined');
                }
                setSupabase(supabaseClient);
                supabaseClient.auth.getSession().then(({ data: { session } }) => {
                    setSession(session);
                });
                const {
                    data: { subscription },
                } = supabaseClient.auth.onAuthStateChange((_event: any, session: any) => {
                    setSession(session);
                });
                return () => subscription.unsubscribe();
            } catch (err) {
                console.error('Error initializing Supabase client:', err);
            }
        })();
    }, []);

    const logOut = async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            setSession(null);
        }
    };

    const isWhitelisted = (() => {
        if (!session || !session.user || !session.user.id || !edgeValue) return false;
        if (Array.isArray(edgeValue)) {
            return edgeValue.includes(session.user.id);
        }
        if (typeof edgeValue === 'string') {
            // Allow comma or newline separated list, or single string
            return edgeValue.split(/[,\n]/).map(s => s.trim()).includes(session.user.id);
        }
        return false;
    })();

    if (!session) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    width: '200px',
                    maxWidth: '90vw',
                    transform: 'scale(1.7)',
                    transformOrigin: 'center',
                }}>
                    {!supabase ? (
                        <div style={{ textAlign: 'center', fontSize: 18, color: '#888' }}>Loading authentication...</div>
                    ) : (
                        <Auth
                            supabaseClient={supabase}
                            appearance={{ theme: ThemeSupa }}
                            theme={theme}
                            providers={['discord']}
                            //redirectTo='http://localhost:3000/login'
                            redirectTo='http://ian.ksucombat.club/login'
                            onlyThirdPartyProviders
                        />
                    )}
                </div>
            </div>
        );
    } else if (isWhitelisted) {
        return (
            <div>
                <button onClick={logOut}>Log Out</button>
                <div>Logged in!</div>
                <div>Discord UID: {session.user.id}</div>
                <div>Discord Username: {session.user.user_metadata.full_name}</div>
                <div>
                  Edge Config Value:
                  {edgeValue && typeof edgeValue === 'object' ? (
                    <ul>
                      {Object.entries(edgeValue).map(([key, value]) => (
                        <li key={key}>
                          {key}: {String(value)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span> {String(edgeValue)}</span>
                  )}
                </div>
            </div>
        )
    } else {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center'
            }}>
                <h2>Access Restricted</h2>
                <p>
                    Your account is not on the whitelist.<br />
                    Please contact a member of the club to gain access.
                </p>
                <button onClick={logOut} style={{ marginTop: 20 }}>
                    Log Out
                </button>
            </div>
        );
    }
}

export default Login;