import type { NextApiRequest, NextApiResponse } from 'next'

module.exports = async function handler(req: NextApiRequest, res: NextApiResponse) {
    const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
    const EDGE_CONFIG_TOKEN = process.env.EDGE_CONFIG_TOKEN;
    if (!EDGE_CONFIG_TOKEN) {
        return res.status(500).json({ error: 'Edge Config token not set on server.' });
    }

    if (req.method === 'GET') {
        try {
            const response = await fetch(
                `https://edge-config.vercel.com/${EDGE_CONFIG_ID}/item/Discord_UID`,
                {
                    headers: {
                        'Authorization': `Bearer ${EDGE_CONFIG_TOKEN}`
                    }
                }
            );
            if (!response.ok) {
                return res.status(response.status).json({ error: 'Failed to fetch from Edge Config' });
            }
            const value = await response.json();
            return res.status(200).json({ value: value.value });
        } catch (err) {
            return res.status(500).json({ error: 'Error fetching from Edge Config' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}