import { z } from "zod";

export const assetSchema = z.object({
  tag: z.string().min(1, "Tag is required").max(50),
  hostname: z.string().max(100).optional().nullable(),
  status: z.enum(["Active", "Inactive", "Maintenance", "Retired"]).default("Active"),
  categoryId: z.string().min(1, "Category is required"),
  vendorId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  rack: z.string().optional().nullable(),
  uPosition: z.string().optional().nullable(),
  parentAssetId: z.string().optional().nullable(),
  warranty: z.string().optional().nullable(),
  
  // ITAM Fields
  lifecycleState: z.string().optional().nullable(),
  eolDate: z.string().datetime().optional().nullable(),
  eosDate: z.string().datetime().optional().nullable(),
  slaLevel: z.string().optional().nullable(),
  contractNumber: z.string().optional().nullable(),
  
  // Business Context
  businessApp: z.string().optional().nullable(),
  businessOwner: z.string().optional().nullable(),
  techOwner: z.string().optional().nullable(),
  costCenter: z.string().optional().nullable(),
  ownershipType: z.string().optional().nullable(),
  
  // Electrical/Cooling
  powerWatts: z.number().nonnegative().optional().nullable(),
  weightKg: z.number().nonnegative().optional().nullable(),
  coolingBTU: z.number().nonnegative().optional().nullable(),
  upstreamPowerId: z.string().optional().nullable(),
  upstreamNetId: z.string().optional().nullable(),
});

export type AssetInput = z.infer<typeof assetSchema>;
