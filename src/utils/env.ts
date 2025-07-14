// Helper to access Docusaurus customFields in React
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function useBackendUrl() {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields?.backendUrl || '';
}

export function useFrontendUrl() {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields?.frontendUrl || '';
}
