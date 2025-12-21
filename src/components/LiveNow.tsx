import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Label } from '@/components/ui/label';

type LiveNowProps = {
  value: boolean
  onChange: (value: boolean) => void
}

export default function LiveNow({ value, onChange }: LiveNowProps) {
    return(
        <div className="flex items-center space-x-2">
          <Checkbox
            id="live"
            checked={value}
            onCheckedChange={(checked) => {
              onChange(!!checked)
            }}
          />
          <Label htmlFor="live">Rolando agora</Label>
        </div>
    )
}