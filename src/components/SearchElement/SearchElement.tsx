import { useEffect, useState } from "react"
import { TextField, Box, Autocomplete } from "@mui/material"
import "./SearchElement.scss"

interface OptionType {
  label: string
  value: string
}

interface SearchElementProps {
  onFilterChange: (selected: string[], searchTerm: string) => void
  options: OptionType[]
  placeholder?: string
}

const SearchElement: React.FC<SearchElementProps> = ({ onFilterChange, options, placeholder = "Ieškoti..." }) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    const selectedValues = selectedOptions.map((opt) => opt.value)
    onFilterChange(selectedValues, searchTerm)
  }, [selectedOptions, searchTerm])

  return (
    <Box className="search-element" sx={{ display: "flex", flexDirection: "column", gap: 2, width: "50%" }}>
      <TextField
        variant="outlined"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />

      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(option) => option.label}
        value={selectedOptions}
        onChange={(event, newValue) => setSelectedOptions(newValue)}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" placeholder="Pasirinkite kryptis..." />
        )}
        sx={{ width: "100%" }}
      />
    </Box>
  )
}

export default SearchElement
