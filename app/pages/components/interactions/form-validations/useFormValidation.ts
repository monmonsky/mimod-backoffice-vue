import { ref } from "vue";
import type { ZodObject, ZodRawShape } from "zod";
import z from "zod";

export const useFormValidation = <Shape extends ZodRawShape, T extends ZodObject<Shape>>({
    schema,
    initialValues,
}: {
    schema: T;
    initialValues: z.infer<T>;
}) => {
    type FormData = z.infer<T>;
    type FormErrors = Partial<Record<keyof FormData, string>>;
    type SchemaKeys = keyof FormData;

    const formData = ref<FormData>({ ...initialValues });
    const errors = ref<FormErrors>({});

    const checkError = (key: SchemaKeys, value: unknown) => {
        const shape = schema.shape as unknown as Record<string, z.ZodType>;
        const fieldSchema = z.object({ [key]: shape[key as string] });
        const result = fieldSchema.safeParse({ [key]: value });

        errors.value[key] = result.success ? undefined : result.error.issues[0]?.message;
    };

    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value, type } = target;
        const key = name as SchemaKeys;

        const parsed: string | number | boolean =
            type === "checkbox"
                ? (target as HTMLInputElement).checked
                : type === "number" || type === "range"
                  ? value === ""
                      ? ""
                      : Number(value)
                  : value;

        formData.value[key] = parsed;
        checkError(key, parsed);
    };

    const updateFormData = (key: SchemaKeys, value: string | number | boolean) => {
        formData.value[key] = value;
        checkError(key, value);
    };

    const handleSubmit = (e: Event, onSuccess: (data: FormData) => void) => {
        e.preventDefault();
        const result = schema.safeParse(formData.value);

        if (!result.success) {
            const newErrs: FormErrors = {};
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as SchemaKeys;
                newErrs[key] = issue.message;
            });
            errors.value = newErrs;
        } else {
            errors.value = {};
            onSuccess(result.data);
        }
    };

    const handleClear = () => {
        formData.value = { ...initialValues };
        errors.value = {};
    };

    return {
        formData,
        errors,
        handleChange,
        handleSubmit,
        updateFormData,
        handleClear,
    };
};
