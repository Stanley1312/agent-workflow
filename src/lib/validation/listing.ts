import { productAssetIds } from "../../data/product-assets";
import { z } from "zod";

const titleSchema = z.string().trim().min(1, 'Title is required').max(120, 'Title must be 120 characters or fewer');
const descriptionSchema = z.string().trim().min(1, 'Description is required').max(5000, 'Description must be 5000 characters or fewer');
const categorySchema = z.string().trim().min(1, 'Category is required').max(60, 'Category must be 60 characters or fewer');
const conditionSchema = z.enum(['new', 'like-new', 'good', 'fair', 'used']);
const productAssetIdSet = new Set(productAssetIds);
const imageAssetIdsSchema = z
  .array(z.string().trim().min(1, 'Image reference is required'))
  .optional()
  .superRefine((imageAssetIds, context) => {
    for (const imageAssetId of imageAssetIds ?? []) {
      if (!productAssetIdSet.has(imageAssetId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Image reference is not supported',
        });
      }
    }
  });

export const listingInputSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  category: categorySchema,
  condition: conditionSchema,
  priceCents: z.coerce.number().int('Price must be a whole number').min(100, 'Price must be at least 100 cents').max(999_999_00, 'Price is too large'),
  imageAssetIds: imageAssetIdsSchema,
});

export type ListingInput = z.infer<typeof listingInputSchema>;
