"use client"

import { useState } from"react"
import { useForm } from"react-hook-form"
import { zodResolver } from"@hookform/resolvers/zod"
import * as z from"zod"
import { useMutation, useQueryClient, useQuery } from"@tanstack/react-query"
import { fetchApi } from"@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from"@/components/ui/dialog"
import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Label } from"@/components/ui/label"
import { MoveRight } from"lucide-react"

const moveSchema = z.object({
  new_rack_id: z.coerce.number().optional().nullable(),
  new_u_position: z.coerce.number().optional().nullable(),
  action: z.string().min(1,"Action is required"),
  notes: z.string().optional(),
})

type MoveFormValues = z.infer<typeof moveSchema>

export function MoveAssetModal({ assetId, currentRackId, currentU }: { assetId: number, currentRackId: number | null, currentU: number | null }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetch available racks for dropdown
  const { data: racks } = useQuery({
    queryKey: ["racks"],
    queryFn: () => fetchApi("/locations/racks"),
  })

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<MoveFormValues>({
    resolver: zodResolver(moveSchema),
    defaultValues: {
      new_rack_id: currentRackId,
      new_u_position: currentU,
      action:"Relocated",
      notes:""
    }
  })

  const mutation = useMutation({
    mutationFn: (data: MoveFormValues) => fetchApi(`/assets/${assetId}/move`, {
      method:"POST",
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset", assetId.toString()] })
      queryClient.invalidateQueries({ queryKey: ["asset-history", assetId.toString()] })
      setOpen(false)
      reset()
    }
  })

  const onSubmit = (data: MoveFormValues) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <MoveRight size={16} />
          Move Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="text-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move / Update Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="action">Action Type</Label>
            <select 
              id="action"
              {...register("action")}
              className="w-full    rounded-md p-2 text-sm text-foreground"
            >
              <option value="Relocated">Relocated</option>
              <option value="Status Change">Status Change</option>
              <option value="Maintenance">Sent to Maintenance</option>
            </select>
            {errors.action && <p className="text-sm text-red-500">{errors.action.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_rack_id">Target Rack</Label>
            <select 
              id="new_rack_id"
              {...register("new_rack_id")}
              className="w-full    rounded-md p-2 text-sm text-foreground"
            >
              <option value="">Unracked</option>
              {racks?.map((rack: any) => (
                <option key={rack.id} value={rack.id}>{rack.name} ({rack.height_u}U)</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_u_position">U-Position</Label>
            <Input 
              id="new_u_position" 
              type="number"
              {...register("new_u_position")}
              className="" 
              placeholder="e.g. 10" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              {...register("notes")}
              className="" 
              placeholder="Reason for move..." 
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ?"Saving..." :"Confirm Move"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
