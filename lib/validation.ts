export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Partial<Record<keyof T, string>>;
}

export type FieldValidator<T> = (value: unknown) => {
  valid: boolean;
  value?: T;
  error?: string;
};

export function stringField(options: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  pattern?: RegExp;
  label?: string;
  transform?: (value: string) => string;
} = {}): FieldValidator<string | undefined> {
  const {
    required = false,
    minLength,
    maxLength,
    email = false,
    pattern,
    label = "Ce champ",
    transform,
  } = options;

  return (value: unknown) => {
    if (value === undefined || value === null || value === "") {
      if (required) {
        return { valid: false, error: `${label} est obligatoire.` };
      }
      return { valid: true, value: undefined };
    }

    if (typeof value !== "string") {
      return { valid: false, error: `${label} est invalide.` };
    }

    const trimmed = value.trim();
    if (required && trimmed.length === 0) {
      return { valid: false, error: `${label} est obligatoire.` };
    }

    if (minLength && trimmed.length < minLength) {
      return {
        valid: false,
        error: `${label} doit contenir au moins ${minLength} caractères.`,
      };
    }

    if (maxLength && trimmed.length > maxLength) {
      return {
        valid: false,
        error: `${label} doit contenir au maximum ${maxLength} caractères.`,
      };
    }

    if (email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(trimmed)) {
        return { valid: false, error: "Adresse e-mail invalide." };
      }
    }

    if (pattern && !pattern.test(trimmed)) {
      return { valid: false, error: `${label} a un format invalide.` };
    }

    return {
      valid: true,
      value: transform ? transform(trimmed) : trimmed,
    };
  };
}

export function enumField<T extends string>(
  values: readonly T[],
  options: { required?: boolean; label?: string } = {},
): FieldValidator<T | undefined> {
  const { required = false, label = "Ce champ" } = options;
  return (value: unknown) => {
    if (value === undefined || value === null || value === "") {
      if (required) {
        return { valid: false, error: `${label} est obligatoire.` };
      }
      return { valid: true, value: undefined };
    }
    if (typeof value !== "string" || !values.includes(value as T)) {
      return { valid: false, error: `${label} est invalide.` };
    }
    return { valid: true, value: value as T };
  };
}

export function booleanField(options: { required?: boolean; label?: string } = {}): FieldValidator<boolean | undefined> {
  const { required = false, label = "Ce champ" } = options;
  return (value: unknown) => {
    if (value === undefined || value === null) {
      if (required) {
        return { valid: false, error: `${label} est obligatoire.` };
      }
      return { valid: true, value: undefined };
    }
    if (typeof value === "boolean") {
      return { valid: true, value };
    }
    if (value === "true") {
      return { valid: true, value: true };
    }
    if (value === "false") {
      return { valid: true, value: false };
    }
    return { valid: false, error: `${label} est invalide.` };
  };
}

export type SchemaShape<T> = {
  [K in keyof T]: FieldValidator<T[K]>;
};

export function createSchema<T>(shape: SchemaShape<T>) {
  return {
    safeParse(data: unknown): ValidationResult<T> {
      const errors: Partial<Record<keyof T, string>> = {};
      const values: Partial<T> = {};
      const source = (data ?? {}) as Record<string, unknown>;

      for (const key of Object.keys(shape) as Array<keyof T>) {
        const validator = shape[key];
        const result = validator(source[key as string]);
        if (!result.valid) {
          errors[key] = result.error ?? "Valeur invalide.";
        } else if (result.value !== undefined) {
          values[key] = result.value;
        }
      }

      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      return { success: true, data: values as T };
    },
  };
}
