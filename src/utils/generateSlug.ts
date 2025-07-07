import slugify from "slugify";
export function generateSlug(title:string) {
    return slugify(title, {
      lower: true,
      strict: true,        
      remove: /[*+~.()'"!:@]/g,  
      locale: 'en'        
    }).substring(0, 100);
  }

  import { db } from "../libs/db"; // adjust path to your Prisma instance

export async function generateUniqueSlug(title: string) {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (await db.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}
