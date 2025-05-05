import { useEffect, useState } from "react"
import Select from "react-select"
import './SearchElement.scss'

interface OptionType {
  label: string
  value: string
}

interface SearchElementProps {
  onFilterChange: (selected: string[], searchTerm: string) => void
  options: OptionType[]
  placeholder?: string
}

const SearchElement: React.FC<SearchElementProps> = ({
  onFilterChange,
  options,
  placeholder = "Ieškoti..."
}) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    const selectedValues = selectedOptions.map((opt) => opt.value)
    onFilterChange(selectedValues, searchTerm)
  }, [selectedOptions, searchTerm])

  return (
    <div className="search-element">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "6px",
          width: "80%",
          boxSizing: "border-box"
        }}
      />

      <Select
        className="search-element-select"
        classNamePrefix="react-select"
        options={options}
        value={selectedOptions}
        onChange={(selected) => setSelectedOptions(selected as OptionType[])}
        isMulti
        placeholder="Pasirinkite kryptis..."
        noOptionsMessage={() => "Duomenų nerasta"}
      />
    </div>
  )
}

export default SearchElement
