// src/routes/page/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { findPageById } from '$lib/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, parent }) => {
  const parentData = await parent();
  const pages = parentData?.pages;

  const id = params.id;
  const page = await findPageById(id);

  if (!page) {
    throw error(404, 'Page introuvable');
  }

  return {
    id,
    page,
    pages
  };
};
