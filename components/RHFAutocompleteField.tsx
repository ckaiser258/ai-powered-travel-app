import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Autocomplete, TextField, Typography } from "@mui/material";

interface RHFAutocompleteFieldProps<
  O extends { label: string; value: string },
  TField extends FieldValues
> {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  label: string;
  requiredMessage?: string;
  freeSolo?: boolean;
}

// A reusable component that wraps the Material UI Autocomplete
// component with react-hook-form functionality.
const RHFAutocompleteField = <
  O extends { label: string; value: string },
  TField extends FieldValues
>(
  props: RHFAutocompleteFieldProps<O, TField>
) => {
  const { control, name, options, label, requiredMessage, freeSolo } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={requiredMessage && { required: requiredMessage }}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field;
        return (
          <>
            <Autocomplete
              sx={{ width: 300 }}
              freeSolo={freeSolo}
              autoHighlight
              value={
                value
                  ? options.find((option) => value === option.value) ?? null
                  : null
              }
              onChange={(event, newValue) => {
                if (typeof newValue !== "string") {
                  onChange(newValue?.value);
                } else {
                  onChange(newValue);
                }
              }}
              // If freeSolo is false, then that means the user MUST select an option from the list.
              // In that case, we don't want to change the value of the field while the user is typing
              // because that would mean that the value of the field could: a) Be invalid, and/or b) Cause unexpected behavior.
              onInputChange={
                freeSolo ? (event, value) => onChange(value) : null
              }
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </>
        );
      }}
    />
  );
};

export default RHFAutocompleteField;
