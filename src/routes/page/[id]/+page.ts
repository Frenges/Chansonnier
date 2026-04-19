export const ssr = false;

export async function load({ params, parent }) {
  const { pages } = await parent();
  return {
    id: params.id,
    pages
  };
}
