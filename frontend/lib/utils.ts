// Utility Functions

/**
 * Detect device type
 */
export const getDeviceType = (): string => {
    if (typeof window === 'undefined') return 'unknown'

    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet'
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile'
    }
    return 'desktop'
}

/**
 * Check if Web Contacts API is supported
 */
export const isContactsAPISupported = (): boolean => {
    return 'contacts' in navigator && 'ContactsManager' in window
}

/**
 * Check if Web Share API is supported
 */
export const isShareAPISupported = (): boolean => {
    return 'share' in navigator
}

/**
 * Check if NFC is supported
 */
export const isNFCSupported = (): boolean => {
    return 'NDEFReader' in window
}

/**
 * Open Native Contact Form (Android) or Share VCF (iOS)
 */
export const saveContactNative = async (data: {
    name: string
    title: string
    phone: string
    email: string
    website: string
}) => {
    const isAndroid = /Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

    console.log('📱 Attempting to save contact...', { isAndroid, isIOS })

    // 1. Android: Use Intent to open native "Insert Contact" screen
    if (isAndroid) {
        try {
            const intentUrl = `intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;S.name=${encodeURIComponent(data.name)};S.phone=${encodeURIComponent(data.phone)};S.email=${encodeURIComponent(data.email)};S.company=${encodeURIComponent(data.title)};end`
            window.location.href = intentUrl
            return
        } catch (err) {
            console.error('Android intent failed', err)
        }
    }

    // 2. iOS/Others: Try Web Share API with VCF File
    if (navigator.share && navigator.canShare) {
        const vcfString = generateVCF(data)
        const file = new File([vcfString], `${data.name.replace(/\s+/g, '_')}.vcf`, { type: 'text/vcard' })

        if (navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: data.name,
                })
                return
            } catch (err) {
                console.error('Share API failed', err)
            }
        }
    }

    // 3. Last Resort Fallback: Download VCF File
    console.log('💾 Falling back to VCF download...')
    const vcf = generateVCF(data)
    downloadVCF(vcf, `${data.name.replace(/\s+/g, '_')}.vcf`)
}

/**
 * Generate VCF fallback
 */
export const generateVCF = (data: {
    name: string
    title: string
    phone: string
    email: string
    website: string
}): string => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TITLE:${data.title}
TEL:${data.phone}
EMAIL:${data.email}
URL:${data.website}
END:VCARD`
}

/**
 * Download VCF file
 */
export const downloadVCF = (vcfData: string, filename: string = 'contact.vcf') => {
    const blob = new Blob([vcfData], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

/**
 * Share via Web Share API
 */
export const shareCard = async (url: string, title: string) => {
    if (!isShareAPISupported()) {
        throw new Error('Share API not supported')
    }

    try {
        await navigator.share({
            title: title,
            text: `Check out ${title}'s digital business card`,
            url: url,
        })
        return true
    } catch (error) {
        if ((error as Error).name !== 'AbortError') {
            console.error('Error sharing:', error)
            throw error
        }
        return false
    }
}

/**
 * Share via WhatsApp
 */
export const shareViaWhatsApp = (phoneNumber: string, message: string) => {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
}

/**
 * Write to NFC tag
 */
export const writeNFC = async (url: string) => {
    if (!isNFCSupported()) {
        throw new Error('NFC not supported')
    }

    try {
        // @ts-ignore - NDEFReader is not in TypeScript types yet
        const ndef = new NDEFReader()
        await ndef.write({
            records: [{ recordType: 'url', data: url }],
        })
        return true
    } catch (error) {
        console.error('Error writing NFC:', error)
        throw error
    }
}

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '')

    // Format based on length
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }

    return phone
}

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (error) {
        console.error('Error copying to clipboard:', error)
        return false
    }
}
