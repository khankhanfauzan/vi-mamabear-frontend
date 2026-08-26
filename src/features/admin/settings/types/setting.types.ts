/**
 * Defines the possible data types for a setting value.
 * Even though the API returns the `value` field as a string,
 * this type helps in parsing the value correctly on the client side.
 */
export type SettingValueType = "string" | "json" | "number" | "boolean";

/**
 * Represents a single setting configuration from the API.
 */
export interface Setting {
    id: number;
    key: string;
    value: string;
    type: SettingValueType;
    description: string;
    createdAt: string;
    updatedAt: string;
}