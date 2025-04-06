import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface OptionSelectorProps {
  defaultOptions: string[];
  onChange: (options: string[], selectedIndex: number) => void;
  disabled?: boolean;
}

export default function OptionSelector({
  defaultOptions,
  onChange,
  disabled = false,
}: OptionSelectorProps) {
  const [options, setOptions] = useState<string[]>(defaultOptions);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onChange(newOptions, selectedIndex);
  };

  const handleSelectOption = (index: number) => {
    setSelectedIndex(index);
    onChange(options, index);
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div key={index} className="flex flex-row items-center justify-between w-full p-2 mb-2">
          <Input
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="w-full mr-2"
            disabled={disabled}
          />
          <div 
            onClick={() => handleSelectOption(index)}
            className={`bubble-selector ${
              selectedIndex === index
                ? "selected"
                : "bg-transparent border-slate-600"
            }`}
            aria-label={`Select option ${index + 1} as the correct answer`}
          />
        </div>
      ))}
    </div>
  );
}