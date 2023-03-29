import ISO6391 from "iso-639-1";
import { useEffect, useState } from "react";
import Select from "react-select";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [valueForSelect, setValueForSelect] = useState(undefined);

  const options = ISO6391.getAllNames().map((language) => ({
    label: language,
    value: language,
  }));

  const handleChange = (option: { label: string; value: string }) => {
    onSelectLanguage(option.value);
  };

  useEffect(() => {
    // useEffect for making sure react-select knows to render the placeholder when no language is selected
    if (selectedLanguage) {
      setValueForSelect({
        label: selectedLanguage,
        value: selectedLanguage,
      });
    } else {
      setValueForSelect(undefined);
    }
  }, [selectedLanguage]);

  return (
    <Select
      options={options}
      value={valueForSelect}
      styles={{
        control: (provided) => ({
          ...provided,
          width: 200,
          height: 40,
        }),
      }}
      onChange={handleChange}
      isSearchable
      placeholder="Select a Language"
    />
  );
};
