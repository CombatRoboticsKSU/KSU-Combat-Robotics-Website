import { useState, useEffect } from 'react'

import { supabase } from '@site/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

function Login() {
    const [session, setSession] = useState(null)
    const [theme, setTheme] = useState('dark')

    const [edgeValue, setEdgeValue] = useState<string>("Not Users Found")

    useEffect(() => {
        fetch('/api/edge-config')
            .then(res => res.json())
            .then(data => setEdgeValue(data.value ?? null))

        const themeChoice = document.documentElement.getAttribute('data-theme-choice')
        setTheme(themeChoice === 'dark' ? 'dark' : 'supa')

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
        return () => subscription.unsubscribe()
    }, [])

    const logOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error("Error signing out:", error)
        } else {
            setSession(null)
        }
    }

    const postEdgeConfig = async (newValue: string) => {
        const res = await fetch('/api/edge-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value: newValue })
        });
        const data = await res.json();
        console.log('POST response:', data);
    };

    if (!session) {
        return (
            <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
            }}>
                <div style={{
                    width: "200px",
                    maxWidth: "90vw",
                    transform: "scale(1.7)",
                    transformOrigin: "center"
                }}>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        theme={theme}
                        providers={['discord']}
                        redirectTo='http://localhost:3000/login'
                        onlyThirdPartyProviders
                    />
                </div>
            </div>
        )
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
                {/* <button onClick={() => postEdgeConfig('Hello from client!')}>
                    Send POST to Edge Config
                </button> */}
            </div>
        )
    }
}

export default Login;