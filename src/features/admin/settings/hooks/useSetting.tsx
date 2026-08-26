import { useState, useMemo } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateSettingByKey } from "../services/settingService";
import { Setting } from "@/features/admin/settings/types/setting.types";

const RAW_JSON_KEYS = ["courier", "payment_type"]; 

export const useSettings = (initialSettings: Setting[]) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const mappedValues = useMemo(() => {
        const values: FieldValues = {};

        initialSettings.forEach((setting) => {
            if (RAW_JSON_KEYS.includes(setting.key)) {
                try {
                    values[setting.key] = JSON.stringify(JSON.parse(setting.value), null, 2);
                } catch {
                    values[setting.key] = setting.value;
                }
            } else if (setting.type === "boolean" || setting.value === "true" || setting.value === "false") {
                values[setting.key] = setting.value === "true";
            } else {
                // Clear out corrupted string "[object Object]" from backend so UI shows an empty input
                values[setting.key] = setting.value === "[object Object]" ? "" : setting.value;
            }
        });

        return values;
        }, [initialSettings]);

        const form = useForm<FieldValues>({
            defaultValues: mappedValues,
            values: mappedValues, 
    });

    const onSubmit = async (data: FieldValues) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const updatePromises: Promise<Setting>[] = [];

            initialSettings.forEach((setting) => {
                let newValue = data[setting.key];
                let originalValue = setting.value;

                if (RAW_JSON_KEYS.includes(setting.key)) {
                    try {
                        newValue = JSON.stringify(JSON.parse(newValue));
                        originalValue = JSON.stringify(JSON.parse(setting.value));
                    } catch {
                        newValue = String(newValue);
                    }
                } else if (setting.type === "boolean" || typeof newValue === "boolean") {
                    newValue = String(newValue);
                } else {
                    // If the form still uses nested registers like {...register("ig_link.instagram")},
                    // it outputs an object. We extract the actual string URL from it to be safe.
                    if (typeof newValue === "object" && newValue !== null) {
                        const extractedString = Object.values(newValue)[0];
                        newValue = extractedString ? String(extractedString) : "";
                    } else {
                        newValue = String(newValue || "");
                    }
                }

                // If the original value in the DB is corrupted, force an API update to fix it
                if (originalValue === "[object Object]" && newValue !== "[object Object]") {
                    originalValue = "CORRUPTED_FORCE_UPDATE";
                }

                if (newValue !== originalValue) {
                    updatePromises.push(updateSettingByKey(setting.key, newValue));
                }
            });

            if (updatePromises.length === 0) {
                setIsSubmitting(false);
                return;
            }

            await Promise.all(updatePromises);

            form.reset(data); 
            setSubmitSuccess(true);
            router.refresh();

            setTimeout(() => setSubmitSuccess(false), 3000);
            } catch (error) {
                console.error("[useSettings] Error updating settings:", error);
                setSubmitError(
                    error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat menyimpan pengaturan."
                );
            } finally {
                setIsSubmitting(false);
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting,
        submitError,
        submitSuccess,
    };
};