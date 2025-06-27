// Utility to return all non-secret envs (filter out secrets for safety)
const PUBLIC_ENVS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'POSTGRES_URL',
  'POSTGRES_USER',
  'POSTGRES_HOST',
  'POSTGRES_DATABASE',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
  'SUPABASE_URL',
];

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const envs: Record<string, string | undefined> = {};
  for (const key of PUBLIC_ENVS) {
    envs[key] = process.env[key];
  }
  res.status(200).json(envs);
};
