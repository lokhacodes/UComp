// ✅ Fixed: min length was 2, but message said 3 — also removed trailing comma
import * as z from "zod";

const subeventSchema = z.object({
  name: z.string().min(1, 'Subevent name is required'),
  description: z.string().min(1, 'Subevent description is required'),
  competitionType: z.enum(['individual', 'team']),
  teamSize: z.number().min(2, 'Team size must be at least 2').optional(),
}).refine((data) => {
  if (data.competitionType === 'team') {
    return data.teamSize && data.teamSize >= 2;
  }
  return true;
}, {
  message: "Team size must be specified for team competitions",
  path: ["teamSize"],
})

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters').max(400, 'Location must be less than 400 characters'),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
  subevents: z.array(subeventSchema).optional(),
})
