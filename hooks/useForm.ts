import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import type { ValidationResult } from "@/lib/validation";

interface Schema<T> {
  safeParse: (data: unknown) => ValidationResult<T>;
}

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  schema?: Schema<T>;
}

export function useForm<T extends Record<string, unknown>>({ initialValues, schema }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const register = useCallback(
    (name: keyof T) => {
      const currentValue = values[name];
      const fieldProps: Record<string, unknown> = {
        name: name as string,
        onChange: (
          event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        ) => {
          const element = event.target;
          const newValue = element.type === "checkbox" ? (element as HTMLInputElement).checked : element.value;
          setValues((current) => ({ ...current, [name]: newValue }));
        },
        onBlur: () => {
          if (!schema) {
            return;
          }
          const result = schema.safeParse(values);
          if (!result.success) {
            setErrors(result.errors ?? {});
          } else {
            setErrors({});
          }
        },
      };

      if (typeof currentValue === "boolean") {
        fieldProps.checked = currentValue;
      } else {
        fieldProps.value = (currentValue ?? "") as string;
      }

      return fieldProps as {
        name: string;
        value?: string;
        checked?: boolean;
        onChange: (
          event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        ) => void;
        onBlur: () => void;
      };
    },
    [schema, values],
  );

  const handleSubmit = useCallback(
    (submitter: (values: T) => Promise<void> | void) =>
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitted(true);
        if (!schema) {
          await submitter(values);
          return;
        }
        const result = schema.safeParse(values);
        if (!result.success) {
          setErrors(result.errors ?? {});
          return;
        }
        setErrors({});
        setIsSubmitting(true);
        try {
          await submitter(result.data as T);
        } finally {
          setIsSubmitting(false);
        }
      },
    [schema, values],
  );

  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const reset = useCallback((nextValues?: Partial<T>) => {
    setValues({ ...initialValues, ...(nextValues ?? {}) });
    setErrors({});
    setIsSubmitted(false);
  }, [initialValues]);

  const formState = useMemo(
    () => ({
      values,
      errors,
      isSubmitting,
      isSubmitted,
      isValid: Object.keys(errors).length === 0,
    }),
    [values, errors, isSubmitting, isSubmitted],
  );

  return {
    register,
    handleSubmit,
    setValue,
    reset,
    formState,
  };
}
