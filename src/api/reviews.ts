import { getDb } from '../lib/db';
import { z } from 'zod';

const reviewSchema = z.object({
  name: z.string().min(2).max(100),
  rating: z.number().min(1).max(5),
  text: z.string().min(10).max(1000)
});

export async function createReview(data: unknown) {
  const validated = reviewSchema.parse(data);
  const db = await getDb();

  await db.run(
    'INSERT INTO reviews (name, rating, text) VALUES (?, ?, ?)',
    [validated.name, validated.rating, validated.text]
  );
}

export async function getApprovedReviews() {
  const db = await getDb();
  return db.all('SELECT * FROM reviews WHERE approved = TRUE ORDER BY created_at DESC');
}

export async function getPendingReviews() {
  const db = await getDb();
  return db.all('SELECT * FROM reviews WHERE approved = FALSE ORDER BY created_at DESC');
}

export async function approveReview(id: number) {
  const db = await getDb();
  await db.run('UPDATE reviews SET approved = TRUE WHERE id = ?', [id]);
}

export async function deleteReview(id: number) {
  const db = await getDb();
  await db.run('DELETE FROM reviews WHERE id = ?', [id]);
}