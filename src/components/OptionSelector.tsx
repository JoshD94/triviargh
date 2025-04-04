import React, { useState } from 'react';

interface OptionSelectorProps {
  defaultOptions?: string[];
  onChange?: (options: string[], selectedIndex: number) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  defaultOptions = ['', '', '', ''],
  onChange,
}) => {
  const [options, setOptions] = useState<string[]>(defaultOptions);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    if (onChange) {
      onChange(newOptions, selectedIndex);
    }
  };

  const handleRadioSelect = (index: number) => {
    setSelectedIndex(index);
    
    if (onChange) {
      onChange(options, index);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {options.map((option, index) => (
        <div key={index} className="optionselectordiv">
          <input
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Enter option ${index + 1}`}
            className=""
          />
          <div
            className={`bubble-selector ${selectedIndex === index ? 'selected' : 'unselected'}`}
            onClick={() => handleRadioSelect(index)}
          >
            {selectedIndex === index && (
              <div className="inner-circle" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OptionSelector;