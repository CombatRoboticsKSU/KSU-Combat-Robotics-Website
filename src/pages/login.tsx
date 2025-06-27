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
    } else {
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
    }
}

export default Login;