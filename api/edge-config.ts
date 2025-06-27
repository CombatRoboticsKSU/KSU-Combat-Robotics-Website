/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
module.exports = async function handler(req, res) {
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
            const raw = await response.text();
            let value;
            try {
                value = JSON.parse(raw);
            } catch (e) {
                value = raw;
            }
            return res.status(200).json({ value });
        } catch (err) {
            return res.status(500).json({ error: 'Error fetching from Edge Config', details: String(err) });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}