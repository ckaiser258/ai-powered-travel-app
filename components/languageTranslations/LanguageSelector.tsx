import ISO6391 from "iso-639-1";
import { ControllerRenderProps } from "react-hook-form";
import Select from "react-select";

export const LanguageSelector: React.FC<ControllerRenderProps> = ({
  ...rest
}) => {
  const options = ISO6391.getAllNames().map((language) => ({
    label: language,
    value: language,
  }));

  return (
    <Select
      {...rest}
      options={options}
      styles={{
        control: (provided) => ({
          ...provided,
          width: 200,
          height: 40,
        }),
      }}
      isSearchable
      placeholder="Select a Language"
    />
  );
};
