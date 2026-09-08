"use client"

import * as React from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { ImageUp, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
}

interface ThumbnailDropzoneProps {
  value: string | null
  onChange: (preview: string | null) => void
}

function ThumbnailDropzone({ value, onChange }: ThumbnailDropzoneProps) {
  const onDrop = React.useCallback(
    (accepted: File[]) => {
      const file = accepted[0]
      if (!file) return
      onChange(URL.createObjectURL(file))
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: false,
  })

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-border">
        <Image
          src={value}
          alt="Thumbnail preview"
          width={640}
          height={360}
          unoptimized
          className="aspect-video w-full object-cover"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="absolute top-2 right-2 bg-background"
          aria-label="Remove thumbnail"
          onClick={() => onChange(null)}
        >
          <X />
        </Button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-panel text-center transition-colors hover:bg-muted",
        isDragActive && "border-ring bg-muted"
      )}
    >
      <input {...getInputProps()} />
      <ImageUp className="size-6 text-muted-foreground" />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">
          Drag & drop a thumbnail, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">JPG, PNG, or WebP</p>
      </div>
    </div>
  )
}

export { ThumbnailDropzone }
