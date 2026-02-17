
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { uploadResume } from '@/app/actions'

export function ResumeUploader() {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length) {
            setFile(acceptedFiles[0])
            setError(null)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
        },
        maxFiles: 1,
        multiple: false,
    })

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        setError(null)

        const formData = new FormData()
        formData.append('resume', file)

        try {
            const result = await uploadResume(formData)

            if (result?.error) {
                setError(result.error)
                setIsUploading(false)
            } else if (result?.success && result?.id) {
                router.push(`/preview/${result.id}`)
            } else {
                setError('Unknown error occurred')
                setIsUploading(false)
            }

        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
            setIsUploading(false)
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <AnimatePresence mode="wait">
                {!file && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        key="dropzone"
                    >
                        <div
                            {...getRootProps()}
                            className={cn(
                                "relative group cursor-pointer flex flex-col items-center justify-center w-full min-h-[220px] rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-orange-500/50 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-orange-500/5",
                                isDragActive && "border-orange-500 bg-orange-500/10 scale-[1.01]"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center gap-6 text-center p-8">
                                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors duration-500">
                                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-orange-500 group-hover:scale-110 transition-all duration-500" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-bold text-foreground leading-tight">
                                        {isDragActive ? "Drop to parse" : "Upload your resume"}
                                    </p>
                                    <p className="text-sm font-medium text-muted-foreground tracking-tight">
                                        Drag & drop or <span className="text-orange-500 border-b border-orange-500/30">browse</span> (PDF, DOCX)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {file && !isUploading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        key="file-preview"
                        className="bg-background rounded-[2rem] border border-white/10 p-8 shadow-2xl shadow-black/50 space-y-8"
                    >
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-bold text-foreground line-clamp-1">{file.name}</p>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="h-10 px-4 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 font-bold transition-all">
                                Replace
                            </Button>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-500/20"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <Button
                            onClick={handleUpload}
                            className="w-full h-16 text-lg rounded-2xl font-black !bg-white !text-black hover:!bg-white/90 shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0 group border-none"
                            size="lg"
                        >
                            Build My Portfolio
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                )}

                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key="loading"
                        className="bg-background rounded-[2rem] border border-white/10 p-12 text-center shadow-2xl shadow-black/50 space-y-8"
                    >
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                            <motion.div
                                className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-orange-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-foreground tracking-tight leading-none">Parsing Resume</h3>
                            <p className="text-sm font-medium text-muted-foreground">
                                Our AI is decoding your experience...
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-4">
                            {[
                                { text: 'Analyzing experience', done: true },
                                { text: 'Extracting skills', done: false },
                                { text: 'Generating layout', done: false }
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-wider">
                                    {step.done ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-white/10 animate-spin border-t-orange-500" />}
                                    <span className={step.done ? 'text-foreground' : 'text-muted-foreground'}>{step.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
)
