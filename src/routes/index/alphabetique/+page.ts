export const ssr = false;

export async function load({ parent }) {
  const { pages } = await parent();
  return { pages };
}
