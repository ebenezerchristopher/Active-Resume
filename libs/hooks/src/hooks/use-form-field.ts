import { createContext, useContext } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

/**
 * @typedef {Object} FormFieldContextValue
 * @property {TName} name - The name of the form field.
 *
 * Defines the shape of the context value for a form field.
 * TFieldValues extends FieldValues: Generic for the form's field values.
 * TName extends FieldPath<TFieldValues>: Generic for the field's path within the form values.
 */
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

/**
 * @constant FormFieldContext
 * @description React Context for providing the form field's name to its children.
 * Initialized with an empty object cast to FormFieldContextValue, as it will be provided by a parent component.
 */
export const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

/**
 * @typedef {Object} FormItemContextValue
 * @property {string} id - The unique ID for the form item.
 *
 * Defines the shape of the context value for a form item.
 */
type FormItemContextValue = { id: string };

/**
 * @constant FormItemContext
 * @description React Context for providing the form item's unique ID to its children.
 * Initialized with an empty object cast to FormItemContextValue, as it will be provided by a parent component.
 */
export const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

/**
 * @function useFormField
 * @description A custom hook to access form field and item context, and retrieve field state from react-hook-form.
 * It provides all necessary IDs and field state for building accessible form components.
 * @returns {Object} An object containing the field's ID, name, generated IDs for accessibility, and its state.
 * @throws {Error} If useFormField is not used within a <FormField> component (which provides the necessary contexts).
 */
export const useFormField = () => {
  // Retrieve the field context, which contains the field's name.
  const fieldContext = useContext(FormFieldContext) as FormFieldContextValue | undefined;
  // Retrieve the item context, which contains the unique ID for the form item.
  const itemContext = useContext(FormItemContext) as FormItemContextValue | undefined;
  // Access react-hook-form's context to get field state and form state.
  const { getFieldState, formState } = useFormContext();

  // Ensure that the hook is used within the correct provider components.
  if (!fieldContext || !itemContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  // Get the detailed state of the field using its name and the current form state.
  const fieldState = getFieldState(fieldContext.name, formState);

  // Extract the unique ID from the item context.
  const { id } = itemContext;

  // Return an object combining all relevant information for the form field.
  return {
    id, // The unique ID for the form item.
    name: fieldContext.name, // The name of the form field.
    formItemId: `${id}-form-item`, // Generated ID for the form item element.
    formDescriptionId: `${id}-form-item-description`, // Generated ID for the form item's description.
    formMessageId: `${id}-form-item-message`, // Generated ID for the form item's error/help message.
    ...fieldState, // Spread all properties from the fieldState (e.g., `invalid`, `isDirty`, `error`).
  };
};
