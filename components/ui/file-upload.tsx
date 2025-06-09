"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Upload, X, File, AlertCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

export interface FileUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilesSelected: (files: File[]) => void
  onFileRemove?: (file: File) => void
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
  value?: File[]
  preview?: boolean
  error?: string
  helperText?: string
}

export function FileUpload({
  onFilesSelected,
  onFileRemove,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept,
  value = [],
  preview = true,
  error,
  helperText,
  className,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>(value)

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onFilesSelected(newFiles)
    },
    [files, maxFiles, onFilesSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  })

  const removeFile = (file: File) => {
    const newFiles = files.filter((f) => f !== file)
    setFiles(newFiles)
    onFileRemove?.(file)
    onFilesSelected(newFiles)
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + " B"
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB"
    else return (size / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50",
          isDragActive && "border-primary/50 bg-primary/5",
          error && "border-destructive/50 hover:border-destructive",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <input {...getInputProps()} {...props} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm font-medium">
            {isDragActive ? (
              <span className="text-primary">Drop files here</span>
            ) : (
              <>
                Drag & drop files here, or{" "}
                <Button type="button" variant="link" className="px-1">
                  browse
                </Button>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {helperText || `Maximum file size: ${formatFileSize(maxSize)}`}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {preview && files.length > 0 && (
        <div className="grid gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border border-border bg-card p-2"
            >
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <div className="grid">
                  <span className="truncate text-sm font-medium">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(file)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove file</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}