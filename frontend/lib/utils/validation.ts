// lib/validation.ts
export const ValidationRules = {
    title: {
        minLength: 5,
        maxLength: 200,
        pattern: /^[a-zA-Z0-9\s\-.,!?'"()]+$/,
        message: "Title must be 5-200 characters and contain only letters, numbers, and basic punctuation",
    },
    description: {
        minLength: 20,
        maxLength: 2000,
        message: "Description must be 20-2000 characters",
    },
    severity: {
        min: 1,
        max: 5,
        message: "Severity must be between 1 and 5",
    },
    coordinates: {
        latitude: { min: -90, max: 90 },
        longitude: { min: -180, max: 180 },
        message: "Invalid coordinates",
    },
    file: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
        message: "File must be an image (JPEG, PNG, WebP, HEIC) and less than 10MB",
    },
    phone: {
        pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        message: "Invalid phone number format",
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email format",
    },
    password: {
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
    },
};

export function validateComplaint(data: {
    title: string;
    description: string;
    severity: number;
    lat: number | null;
    lng: number | null;
    file: File | null;
}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Title validation
    if (!data.title || data.title.trim().length < ValidationRules.title.minLength) {
        errors.push(`Title must be at least ${ValidationRules.title.minLength} characters`);
    }
    if (data.title && data.title.length > ValidationRules.title.maxLength) {
        errors.push(`Title must not exceed ${ValidationRules.title.maxLength} characters`);
    }
    if (data.title && !ValidationRules.title.pattern.test(data.title)) {
        errors.push(ValidationRules.title.message);
    }

    // Description validation
    if (!data.description || data.description.trim().length < ValidationRules.description.minLength) {
        errors.push(`Description must be at least ${ValidationRules.description.minLength} characters`);
    }
    if (data.description && data.description.length > ValidationRules.description.maxLength) {
        errors.push(`Description must not exceed ${ValidationRules.description.maxLength} characters`);
    }

    // Severity validation
    if (data.severity < ValidationRules.severity.min || data.severity > ValidationRules.severity.max) {
        errors.push(ValidationRules.severity.message);
    }

    // Coordinates validation
    if (data.lat === null || data.lng === null) {
        errors.push("GPS location is required");
    } else {
        if (data.lat < ValidationRules.coordinates.latitude.min || data.lat > ValidationRules.coordinates.latitude.max) {
            errors.push("Invalid latitude");
        }
        if (data.lng < ValidationRules.coordinates.longitude.min || data.lng > ValidationRules.coordinates.longitude.max) {
            errors.push("Invalid longitude");
        }
    }

    // File validation
    if (!data.file) {
        errors.push("Photo evidence is required");
    } else {
        if (data.file.size > ValidationRules.file.maxSize) {
            errors.push(`File size must not exceed ${ValidationRules.file.maxSize / (1024 * 1024)}MB`);
        }
        if (!ValidationRules.file.allowedTypes.includes(data.file.type)) {
            errors.push(ValidationRules.file.message);
        }
    }

    return { valid: errors.length === 0, errors };
}

export function validateEmail(email: string): boolean {
    return ValidationRules.email.pattern.test(email);
}

export function validatePhone(phone: string): boolean {
    return ValidationRules.phone.pattern.test(phone);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < ValidationRules.password.minLength) {
        errors.push(`Password must be at least ${ValidationRules.password.minLength} characters`);
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number");
    }
    if (!/[@$!%*?&]/.test(password)) {
        errors.push("Password must contain at least one special character (@$!%*?&)");
    }

    return { valid: errors.length === 0, errors };
}

export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, "") // Remove potential HTML tags
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+=/gi, ""); // Remove event handlers
}
