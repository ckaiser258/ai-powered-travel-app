import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

interface RHFAutocompleteFieldProps<
  O extends { label: string; value: string },
  TField extends FieldValues
> {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  label: string;
  requiredMessage?: string;
}

// A reusable component that wraps the Material UI Autocomplete
// component with react-hook-form functionality.
const RHFAutocompleteField = <
  O extends { label: string; value: string },
  TField extends FieldValues
>(
  props: RHFAutocompleteFieldProps<O, TField>
) => {
  const { control, name, options, label, requiredMessage } = props;
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
              freeSolo
              autoHighlight
              value={
                value
                  ? options.find((option) => value === option.value) ?? null
                  : null
              }
              onChange={(event, newValue) => {
                if (typeof newValue !== "string") {
                  onChange(newValue.value);
                } else {
                  onChange(newValue);
                }
              }}
              onInputChange={(event, value) => onChange(value)}
              options={options}
              renderInput={(params) => (
                <TextField {...params} label={label} inputRef={ref} />
              )}
            />
            {error && <span style={{ color: "red" }}>{error.message}</span>}
          </>
        );
      }}
    />
  );
};

export default RHFAutocompleteField;
