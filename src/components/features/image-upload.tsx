'use client'

import { useState } from 'react'
import { uploadImage } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
    resumeId: string
    imageType: 'profile' | 'project'
    projectIndex?: number
    currentImageUrl?: string
    onUploadComplete?: (imageUrl: string) => void
}

export function ImageUpload({ resumeId, imageType, projectIndex, currentImageUrl, onUploadComplete }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to server
        setIsUploading(true)
        const formData = new FormData()
        formData.append('image', file)

        const result = await uploadImage(formData, resumeId, imageType, projectIndex)
        setIsUploading(false)

        if (result.success && result.imageUrl) {
            onUploadComplete?.(result.imageUrl)
        } else {
            alert(result.error || 'Failed to upload image')
            setPreviewUrl(currentImageUrl || null)
        }
    }

    return (
        <div className="relative group">
            <label
                htmlFor={`upload-${imageType}-${projectIndex || 'main'}`}
                className={cn(
                    "cursor-pointer block",
                    imageType === 'profile' ? "aspect-[3/4] rounded-2xl" : "aspect-video rounded-xl"
                )}
            >
                {previewUrl ? (
                    <div className="relative w-full h-full overflow-hidden rounded-inherit">
                        <img
                            src={previewUrl}
                            alt={imageType === 'profile' ? 'Profile' : 'Project'}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-white text-center space-y-2">
                                <Icons.upload className="w-8 h-8 mx-auto" />
                                <p className="text-sm font-bold">Change Image</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-inherit flex flex-col items-center justify-center text-gray-400 hover:border-[#D85828] hover:text-[#D85828] transition-colors">
                        <Icons.upload className="w-12 h-12 mb-2" />
                        <p className="text-sm font-bold">Upload Image</p>
                        <p className="text-xs">{imageType === 'profile' ? 'Profile Photo' : 'Project Image'}</p>
                    </div>
                )}
            </label>
            <input
                id={`upload-${imageType}-${projectIndex || 'main'}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
            />
            {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-inherit flex items-center justify-center">
                    <Icons.spinner className="w-8 h-8 text-white animate-spin" />
                </div>
            )}
        </div>
    )
}
